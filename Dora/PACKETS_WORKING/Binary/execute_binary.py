import subprocess
import sys
import pickle as pkl
from starthinker.util.csv import response_utf8_stream
import tensorflow as tf
import pandas as pd
from scipy.stats import zscore
import json
from scipy.stats import norm

# por o tcdump a correr - nao esta a fazer nada for now, é só para usar depois.
# process = subprocess.Popen(['tcpdump', '-s', '65585', '-l'], stdout=subprocess.PIPE)

# por o tshark a correr
tsharkProcess = subprocess.Popen([
    "tshark",
    "-T",
    "ek"
], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

# tensorflow carrega o modelo
new_model = tf.keras.models.load_model('model_binary.h5', compile = False)

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

# for para percorrer todos os jsons (1 json = 1 packet)
for x in iter(tsharkProcess.stdout.readline, ""):
    y = json.loads(x)
    if 'layers' in y and 'tcp' in y['layers'] and 'http' in y['layers'] and 'http_http_content_length' in y['layers']['http']:

        # descobrir o tipo do campo tcp_tcp_flags
        # print(type(y['layers']['tcp']['tcp_tcp_flags']));

        # descobrir o valor do campo tcp_tcp_analysis_initial_rtt
        # print([y['layers']['tcp']['tcp_tcp_analysis_initial_rtt']])
        # print([y['layers']['eth']['eth_eth_src_lg']])
        # print([y['layers']['eth']['eth_eth_src_not_group']])
        # print([y['layers']['arp']['arp_arp_isannouncement']])

        # 23 campos
        d = {
            "http.content_length": [getFieldValue(y['layers']['http'], 'http_http_content_length', getAverageValue('http_http_content_length'))],
            "http.request": [-1.0],
            "http.response.code": [getFieldValue(y['layers']['http'], 'http_http_response_code', getAverageValue('http_http_response_code'))],
            "http.response_number":  [getFieldValue(y['layers']['http'], 'http_http_response_number', -1)],
            "http.time": [getFieldValue(y['layers']['http'], 'http_http_time', getAverageValue('http_http_time'))],

            "tcp.analysis.initial_rtt": [getFieldValue(y['layers']['tcp'], 'tcp_tcp_analysis_initial_rtt', getAverageValue('tcp_tcp_analysis_initial_rtt'))],
            "tcp.connection.fin": [getFieldValue(y['layers']['tcp'], 'tcp_tcp_completeness_fin', -1)],
            "tcp.connection.syn": [getFieldValue(y['layers']['tcp'], 'tcp_tcp_completeness_syn', -1)],
            "tcp.connection.synack": [getFieldValue(y['layers']['tcp'], 'tcp_tcp_completeness_syn-ack', -1)],

            "tcp.flags.cwr": [getFieldValue(y['layers']['tcp'], 'tcp_tcp_flags_cwr', -1)],
            "tcp.flags.ecn": [getFieldValue(y['layers']['tcp'], 'tcp_tcp_flags_ece', -1)], 
            "tcp.flags.fin": [getFieldValue(y['layers']['tcp'], 'tcp_tcp_flags_fin', 2)], 
            "tcp.flags.ns": [1.0 if is_ns_flag_set(y['layers']['tcp']['tcp_tcp_flags']) else 0.0], #todo -1
            "tcp.flags.res": [getFieldValue(y['layers']['tcp'], 'tcp_tcp_flags_res', -1)], 
            "tcp.flags.syn": [getFieldValue(y['layers']['tcp'], 'tcp_tcp_flags_syn', 2)],
            "tcp.flags.urg": [getFieldValue(y['layers']['tcp'], 'tcp_tcp_flags_urg', -1)],
            "tcp.urgent_pointer": [norm.cdf([float(y['layers']['tcp']['tcp_tcp_urgent_pointer'])])], #todo 2 e zscore

            "ip.frag_offset":  [getFieldValue(y['layers']['ip'], 'ip_ip_frag_offset', -1)],

            "eth.dst.ig": [getFieldValue(y['layers']['eth'], 'eth_eth_dst_ig', -1)],
            "eth.src.ig": [getFieldValue(y['layers']['eth'], 'eth_eth_src_ig', -1)], 
            "eth.src.lg": [getFieldValue(y['layers']['eth'], 'eth_eth_src_lg', -1)],
            "eth.src_not_group": [-1.0], #todo -1 

            "arp.isannouncement": [-1.0], #todo -1
        }

        df = pd.DataFrame(data=d)

        # pre-proc. supostamente falta aqui

        a = new_model.predict(df)
        # print(a)
        print(json.dumps(a.tolist()))

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