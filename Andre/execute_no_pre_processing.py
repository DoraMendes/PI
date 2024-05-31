import subprocess
import sys
import pickle as pkl
import tensorflow as tf
import pandas as pd
from scipy.stats import zscore, norm
import json
import websocket
import threading
import time
import numpy as np
import argparse
import traceback

# Argument parsing to get the model file path
parser = argparse.ArgumentParser(description="Packet capture and prediction script")
parser.add_argument('--model', required=True, help='Path to the .h5 model file')
parser.add_argument('--ws_url', required=True, help='WebSocket server URL')
args = parser.parse_args()
#eg usage: python script.py --model model.h5 --ws_url ws://192.168.1.202:8080/ws

# WebSocket functions
def on_message(ws, message):
    print("Received from server: " + message)

def on_error(ws, error):
    print("Error: " + str(error))

def on_close(ws):
    print("### Connection Closed ###")

def on_open(ws):
    print("Connection established.")

# Establish WebSocket connection
def initiate_websocket():
    global ws
    websocket.enableTrace(True)
    #url eg: ws://192.168.1.202:8080/ws
    ws = websocket.WebSocketApp(args.ws_url,
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close,
                                on_open=on_open)
    ws.run_forever()

# Start WebSocket in a new thread to keep it running in the background
ws_thread = threading.Thread(target=initiate_websocket)
ws_thread.daemon = True
ws_thread.start()

# Give some time for the WebSocket connection to establish
time.sleep(1)

# Load the specified model
new_model = tf.keras.models.load_model(args.model, compile=False)

# 25 campos que modelo binário quer:
# http.content_length
# http.request
# http.response.code
# http.response_number
# http.time
# tcp.analysis.initial_rtt
# tcp.connection.fin
# tcp.connection.syn
# tcp.connection.synack
# tcp.flags.cwr
# tcp.flags.ecn
# tcp.flags.fin
# tcp.flags.ns
# tcp.flags.res
# tcp.flags.syn
# tcp.flags.urg
# tcp.urgent_pointer
# ip.frag_offset
# eth.dst.ig
# eth.src.ig,
# eth.src.lg
# eth.src_not_group
# arp.isannouncement

# tshark ouve o que passa na rede, ve cada pacote e imprime para a consola cada packet q ele conseguiu processar. 
# aka o tshark ouve os packts de rede mas ele faz um peq proc disso e então é um pouco mais lento q na vida real.
# á medida q ele vai conseguindo ouvir cada packer, ele vai imprimir esse packet para a consola em json.
# a cada json q ele imprime, vamos escolher os campos que nos interessam


def is_ns_flag_set(tcp_flags):
    # Convert hex string to integer    
    tcp_flags_int = int(tcp_flags, 16)
    # Check if the 9th bit is set
    return tcp_flags_int & 0x0100 != 0

# retornar valores de cada campo
def getFieldValue(res, field, default):
    if field in res:
        return float(res[field])
    else: return float(default)

# valores médios de cada campo
def getAverageValue(field):
    res = {
        'http_http_content_length': 0.06,
        'http_http_response_code': 0.03,
        'http_http_response_number': 0.08,
        'http_http_time': 0.01,
        'tcp_tcp_analysis_initial_rtt': 0.00,
        'tcp_tcp_completeness_fin': 0.07,
        'tcp_tcp_completeness_syn': 0.09,
        'tcp_tcp_completeness_syn-ack': 0.03,
        'tcp_tcp_flags_cwr': 0.09,

        'http.request': 0.08,
        'http.response': 0.08,
        'tcp.analysis.bytes_in_flight': 0.12,
        'tcp.analysis.ack_rtt': 0.00,
        'tcp.analysis.push_bytes_sent': 0.12,
        'tcp_tcp_flags_ece': 0.09,
        'tcp_tcp_flags_fin': -0.03,
        'tcp_tcp_flags': -0.01,
        'tcp_tcp_flags_res': 0.00,
        'tcp_tcp_flags_syn': 0.03,
        'tcp_tcp_flags_urg': 0.09,
        'tcp_tcp_urgent_pointer': 0.09,

        'ip_ip_frag_offset': 0.19,
        
        'eth_eth_dst_ig': 0.50,
        'eth_eth_src_ig': 0.50,
        'eth_eth_src_lg': 0.50,
        'eth.src_not_group': 0.50,
        
        'arp.isannouncement': 0.00,
    }
    return res[field];

# por o tcdump a correr - nao esta a fazer nada for now, é só para usar depois.
# process = subprocess.Popen(['tcpdump', '-s', '65585', '-l'], stdout=subprocess.PIPE)

# por o tshark a correr
tsharkProcess = subprocess.Popen([
    "tshark",
    "-T",
    "ek",
    "-i",
    "any"
], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

# for para percorrer todos os jsons (1 json = 1 packet)
for x in iter(tsharkProcess.stdout.readline, ""):
    try:
        y = json.loads(x)
        if 'layers' in y and 'tcp' in y['layers'] and 'http' in y['layers']:

            # descobrir o tipo do campo tcp_tcp_flags
            #print(type(y['layers']['tcp']['tcp_tcp_flags']));

            # descobrir o valor do campo tcp_tcp_analysis_initial_rtt
            # print([y['layers']['tcp']['tcp_tcp_analysis_initial_rtt']])
            # print([y['layers']['eth']['eth_eth_src_lg']])
            # print([y['layers']['eth']['eth_eth_src_not_group']])
            # print([y['layers']['arp']['arp_arp_isannouncement']])

            # 23 campos
            d = {
            "http.content_length": [False],
            "http.request": [False],
            "http.response.code": [y['layers']['http']['http_http_response_code']],
            "http.response_number":  [y['layers']['http']['http_http_response_number']],
            "http.time": [y['layers']['http']['http_http_time']],

            "tcp.connection.fin": [y['layers']['tcp']['tcp_tcp_completeness_fin']],
            "tcp.connection.syn": [y['layers']['tcp']['tcp_tcp_completeness_syn']],
            "tcp.connection.synack": [y['layers']['tcp']['tcp_tcp_completeness_syn-ack']],

            "tcp.flags.cwr": [y['layers']['tcp']['tcp_tcp_flags_cwr']],
            "tcp.flags.ecn": [y['layers']['tcp']['tcp_tcp_flags_ece']],
            "tcp.flags.fin": y['layers']['tcp']['tcp_tcp_flags_fin'],
            "tcp.flags.ns": [0.0],
            "tcp.flags.res": [y['layers']['tcp']['tcp_tcp_flags_res']],
            "tcp.flags.syn": [y['layers']['tcp']['tcp_tcp_flags_syn']],
            "tcp.flags.urg": [y['layers']['tcp']['tcp_tcp_flags_urg']],
            "tcp.urgent_pointer": [float(y['layers']['tcp']['tcp_tcp_urgent_pointer'])],

            "ip.frag_offset": [y['layers']['ip']['ip_ip_frag_offset']],
            "is_malicious": [0.0],
            "attack_type": [0.0],

            "eth.dst.ig": [False],
            "eth.src.ig": [False],
            "eth.src_not_group": [True],

            "arp.isannouncement": [False],
        }

            df = pd.DataFrame(data=d)
            a = new_model.predict(df)
            print(json.dumps(a.tolist()))

            # Correct conversion to JSON and sending via WebSocket
            prediction_list = a.flatten().tolist()
            json_data = json.dumps({"prediction": prediction_list})

            # Send prediction to Java backend via WebSocket
            if ws.sock and ws.sock.connected:
                ws.send(json_data)
            else:
                print("WebSocket is not connected.")

    except json.JSONDecodeError:
        continue  # Handle incomplete JSON
    except Exception as e:
        print(f"Unexpected error processing packet: {e}")
        print("Packet data:", y)
        traceback.print_exc()

    # Number(value.tcp?.['tcp.flags_tree']?.['tcp.flags.fin_tree']?.["_ws.expert"]?.["tcp.connection.fin"]),
    # Number(value.tcp?.['tcp.flags_tree']?.['tcp.flags.syn_tree']?.["_ws.expert"]?.["tcp.connection.syn"]),
    # Number(value.tcp?.['tcp.flags_tree']?.['tcp.flags.syn_tree']?.["_ws.expert"]?.["tcp.connection.synack"]),
    # 1,
    # 2,
    # 3,
    # Number(value.tcp?.['tcp.flags_tree']?.['tcp.flags.cwr']),
    # Number(value.tcp?.['tcp.flags_tree']?.['tcp.flags.ece']),
    # Number(value.tcp?.['tcp.flags_tree']?.['tcp.flags.fin']),
    # [0.0],
    # Number(value.tcp?.['tcp.flags_tree']?.['tcp.flags.res']),
    # Number(value.tcp?.['tcp.flags_tree']?.['tcp.flags.syn']),
    # Number(value.tcp?.['tcp.flags_tree']?.['tcp.flags.urg']),
    # Number(value.tcp?.['tcp.urgent_pointer']),
    # 100,
    # 100,//Number(value.http?.['http.request']),
    # 304,
    # Number(value.http?.['http.response_number']),
    # Number(value.http?.['http.time']),
    # Number(value.ip?.['ip.frag_offset']),

# new_model = tf.keras.models.load_model('model_binary.h5')

# for z in pd.read_csv(tsharkProcess.stdout, iterator=True, chunksize=1):
#     print(float(z['http.response.code'].iloc[0]))
#     d = {
#         "http.content_length": [z['http.content_length'].replace(233, 1).astype(float)],
#         "http.request": [z['http.request'].astype(float)],
#         "http.response.code": [z['http.response.code'].replace(400, 1).astype(float)],
#         "http.response_number": [z['http.response_number'].astype(float)],
#         "http.time": [z['http.time'].astype(float)],
#         "tcp.connection.fin": [z['tcp.connection.fin'].astype(float)],
#         "tcp.connection.syn": [z['tcp.connection.syn'].astype(float)],
#         "tcp.connection.synack": [z['tcp.connection.synack'].astype(float)],
#         "tcp.flags.cwr": [z['tcp.flags.cwr'].astype(float)],
#         "tcp.flags.ecn": [z['tcp.flags.ece'].astype(float)],
#         "tcp.flags.fin": [z['tcp.flags.fin'].astype(float)],
#         "tcp.flags.ns": [0.0],
#         "tcp.flags.res": [z['tcp.flags.res'].astype(float)],
#         "tcp.flags.syn": [z['tcp.flags.syn'].astype(float)],
#         "tcp.flags.urg": [z['tcp.flags.urg'].astype(float)],
#         "tcp.urgent_pointer": [zscore(z['tcp.urgent_pointer'].astype(float))],
#         "ip.frag_offset": [z['ip.frag_offset'].astype(float)],
#         "is_malicious": [0.0],
#         "attack_type": [0.0],
#         "eth.dst.ig": [z['eth.dst.ig'].astype(float)],
#         "eth.src.ig": [z['eth.src.ig'].astype(float)],
#         "eth.src_not_group": [z['eth.src_not_group'].astype(float)],
#         "arp.isannouncement": [z['arp.isannouncement'].astype(float)],
#     }
#     df = pd.DataFrame(data=d)
#     a = new_model.predict(df)
#     print(a)