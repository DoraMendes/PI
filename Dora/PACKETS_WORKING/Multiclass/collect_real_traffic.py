import subprocess
import json
from util import get_value_by_path

class CollectTraffic:
    def __init__(self):
        subprocess.Popen(["python3", "-m", "http.server", "4000"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        subprocess.Popen(["slowhttptest", "-H", "-c", "10", "-g", "-u", "http://127.0.0.1:4000"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        self.tshark_process = subprocess.Popen(["tshark", "-T", "ek"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    def __iter__(self):
        return self

    def __next__(self):
        packet = json.loads(self.tshark_process.stdout.readline())
        while 'layers' not in packet:
            packet = json.loads(self.tshark_process.stdout.readline())
            
        obj = {
            "http.content_length": get_value_by_path(packet['layers'], 'http.http_http_content_length', None),
            "http.request": get_value_by_path(packet['layers'], 'http.http_http_request', None),
            "http.response.code": get_value_by_path(packet['layers'], 'http.http_http_response_code', None),
            "http.response_number": get_value_by_path(packet['layers'], 'http.http_http_response_number', None),
            "http.time": get_value_by_path(packet['layers'], 'http.http_http_time', None),

            "tcp.analysis.initial_rtt": get_value_by_path(packet['layers'], 'tcp.tcp_tcp_analysis_initial_rtt', None),
            "tcp.connection.fin": get_value_by_path(packet['layers'], 'tcp.tcp_tcp_completeness_fin', None),
            "tcp.connection.syn": get_value_by_path(packet['layers'], 'tcp.tcp_tcp_completeness_syn', None),
            "tcp.connection.synack": get_value_by_path(packet['layers'], 'tcp.tcp_tcp_completeness_syn-ack', None),
            
            "tcp.flags.cwr": get_value_by_path(packet['layers'], 'tcp.tcp_tcp_flags_cwr', None),
            "tcp.flags.fin": get_value_by_path(packet['layers'], 'tcp.tcp_tcp_flags_fin', None),
            "tcp.flags.res": get_value_by_path(packet['layers'], 'tcp.tcp_tcp_flags_res', None),
            "tcp.flags.syn": get_value_by_path(packet['layers'], 'tcp.tcp_tcp_flags_syn', None),
            "tcp.flags.urg": get_value_by_path(packet['layers'], 'tcp.tcp_tcp_flags_urg', None),
            "tcp.flags.ns": get_value_by_path(packet['layers'], 'tcp.tcp_tcp_flags', None),

            "tcp.urgent_pointer": get_value_by_path(packet['layers'], 'tcp.tcp_tcp_urgent_pointer', None),
            
            "ip.frag_offset": get_value_by_path(packet['layers'], 'ip.ip_ip_frag_offset', None),

            "eth.dst.ig": get_value_by_path(packet['layers'], 'eth.eth_eth_dst_ig', None),
            "eth.src.ig": get_value_by_path(packet['layers'], 'eth.eth_eth_src_ig', None),
            "eth.src.lg": get_value_by_path(packet['layers'], 'eth.eth_eth_src_lg', None),
            "eth.src_not_group": get_value_by_path(packet['layers'], 'eth.eth_eth_src_not_group', None),

            "arp.isannouncement": get_value_by_path(packet['layers'], 'arp.arp_arp_isannouncement', None),
            "ip.src": get_value_by_path(packet['layers'], 'ip.ip_ip_src', get_value_by_path(packet['layers'], 'ipv6.ipv6_ipv6_src', None)),
            "ip.dst": get_value_by_path(packet['layers'], 'ip.ip_ip_dst', get_value_by_path(packet['layers'], 'ipv6.ipv6_ipv6_dst', None)),
        }
        return obj