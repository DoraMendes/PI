import subprocess
import json
import threading
from util import get_value_by_path
from time import sleep
import random

class CollectTraffic:

    # construir classe
    def __init__(self, server_ip):
        # levanta servidor web
        subprocess.Popen(["python3", "-m", "http.server", "4000"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        # iniciar o TShark. ignora se o pacote vier ou eu enviar pacotes para a api.
        self.tshark_process = subprocess.Popen(["tshark", "-f", f'src host not {server_ip} and dst host not {server_ip}', "-T", "ek"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # iniciar slow_http numa thread à parte para nao ficar presa para sempre
        subprocess_thread = threading.Thread(target=self.__start_slow_http)

        # put the thread in background
        subprocess_thread.daemon = True

        # iniciar thread
        subprocess_thread.start()


    # attack webserver
    def __start_slow_http(self):
        list_of_attacks = ['-H', '-B', '-R', '-X'] # H slow loris; B rudy; R apache killer; X slow read
        while True:
            selected_attack = random.choice(list_of_attacks)
            print(selected_attack)

                                                                                                        # ip rasperry pi local q esta a correr isto
            slow_process = subprocess.Popen(["slowhttptest", selected_attack, "-c", "100", "-g", "-u", "http://192.168.1.75:4000"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            sleep(5 * 60)
            slow_process.kill()


    def __iter__(self):
        return self

    def __next__(self):
        # output tshark transformado em json
        # 1 \n = 1 pacote
        packet = json.loads(self.tshark_process.stdout.readline())

        # descartar pacotes sem info nenhuma
        while 'layers' not in packet:
            packet = json.loads(self.tshark_process.stdout.readline())
        
        obj = {
            # none is default para nao explodir caso as propriedades nao existam
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
        }
        
        return {
            "model_data": obj,
            "extra": {
                "ip_src": get_value_by_path(packet['layers'], 'ip.ip_ip_src', get_value_by_path(packet['layers'], 'ipv6.ipv6_ipv6_src', None)),
                "ip_dst": get_value_by_path(packet['layers'], 'ip.ip_ip_dst', get_value_by_path(packet['layers'], 'ipv6.ipv6_ipv6_dst', None)),
            }
        }