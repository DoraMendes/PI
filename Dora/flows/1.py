import subprocess
import sys
import pickle as pkl
from starthinker.util.csv import response_utf8_stream
import tensorflow as tf
import pandas as pd
from scipy.stats import zscore
import json

process = subprocess.Popen(['tcpdump', '-s', '65585', '-l'], stdout=subprocess.PIPE)

tsharkProcess = subprocess.Popen([
    "tshark",
    "-T",
    "ek"
], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

new_model = tf.keras.models.load_model('model.h5')


for x in iter(tsharkProcess.stdout.readline, ""):
    y = json.loads(x)
    if 'layers' in y and 'tcp' in y['layers'] and 'http' in y['layers'] and 'http_http_content_length' in y['layers']['http']:
        print(y)
        d = {
            "http.content_length": [y['layers']['http']['http_http_content_length']],
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

            "eth.dst.ig": [y['layers']['eth']['eth_eth_dst_ig']],
            "eth.src.ig": [y['layers']['eth']['eth_eth_src_ig']],
            "eth.src_not_group": [True],

            "arp.isannouncement": [False],
        }
        df = pd.DataFrame(data=d)
        a = new_model.predict(df)
        print(a)
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

# new_model = tf.keras.models.load_model('model.h5')

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