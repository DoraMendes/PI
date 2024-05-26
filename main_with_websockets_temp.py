import subprocess
import sys
import pickle as pkl
import tensorflow as tf
import pandas as pd
import json
import websocket
import threading
import time
import numpy as np

global ws

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
    ws = websocket.WebSocketApp("ws://192.168.1.202:8080/ws",
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

new_model = tf.keras.models.load_model('model.h5')

tsharkProcess = subprocess.Popen([
    "tshark",
    "-T",
    "ek",
    "-i",
    "any"
], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

for x in iter(tsharkProcess.stdout.readline, ""):
    try:
        y = json.loads(x)
        if 'layers' in y and 'tcp' in y['layers'] and 'http' in y['layers']:
            #print(y)
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
            prediction = new_model.predict(df)
            print('Evaluation: ', prediction)

            # Correct conversion to JSON and sending via WebSocket
            prediction_list = prediction.flatten().tolist()  # Flattening and converting to list
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
