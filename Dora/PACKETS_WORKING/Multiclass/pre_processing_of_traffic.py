import json

class PreProcess:
    averageFromDataset = json.load(open('average.json'))
    
    def __is_ns_flag_set(self, tcp_flags):
        try:
            # Convert heobj string to integer 
            tcp_flags_int = int(tcp_flags, 16)
            # Check if the 9th bit is set
            return tcp_flags_int & 0x0100 != 0
        except:
            # maybe its already a boolean/float compatible value or it receives -2 from the default value
            return tcp_flags

    def __getFieldValue(self, res, field, default):
        try:
            if bool(res[field]):
                return float(res[field])
            else: 
                return float(default)
        except KeyError:
            return float(default)
        except ValueError:
            return res[field]
    
    def __getAverageValue(self, field):
        averageFields = self.averageFromDataset[field]
        return averageFields['total_sum'] / averageFields['total']
    
    def __incrementAverageParcels(self, field, value):
        self.averageFromDataset[field]['total_sum'] += value
        self.averageFromDataset[field]['total'] += 1

    def preprocess(self, obj):
        preProcessedObj = {
            "http.content_length": [self.__getFieldValue(obj, 'http.content_length', self.__getAverageValue('http.content_length'))],
            "http.request": [self.__getFieldValue(obj, 'http.request', -1)],
            "http.response.code": [self.__getFieldValue(obj, 'http.response.code', self.__getAverageValue('http.response.code'))],
            "http.response_number":  [self.__getFieldValue(obj, 'http.response_number', -1)],
            "http.time": [self.__getFieldValue(obj, 'http.time', self.__getAverageValue('http.time'))],

            "tcp.analysis.initial_rtt": [self.__getFieldValue(obj, 'tcp.analysis.initial_rtt', self.__getAverageValue('tcp.analysis.initial_rtt'))],
            "tcp.connection.fin": [self.__getFieldValue(obj, 'tcp.connection.fin', -1)],
            "tcp.connection.syn": [self.__getFieldValue(obj, 'tcp.connection.syn', -1)],
            "tcp.connection.synack": [self.__getFieldValue(obj, 'tcp.connection.synack', -1)],

            "tcp.flags.cwr": [self.__getFieldValue(obj, 'tcp.flags.cwr', -1)],
            "tcp.flags.ecn": [self.__getFieldValue(obj, 'tcp.flags.ece', -1)], 
            "tcp.flags.fin": [self.__getFieldValue(obj, 'tcp.flags.fin', 2)], 
            "tcp.flags.ns":  [float(self.__is_ns_flag_set(self.__getFieldValue(obj, 'tcp.flags.ns', -1)))],
            "tcp.flags.res": [self.__getFieldValue(obj, 'tcp.flags.res', -1)], 
            "tcp.flags.syn": [self.__getFieldValue(obj, 'tcp.flags.syn', 2)],
            "tcp.flags.urg": [self.__getFieldValue(obj, 'tcp.flags.urg', -1)],

            "tcp.urgent_pointer": [(self.__getFieldValue(obj, 'tcp.urgent_pointer', 2) - self.__getAverageValue("tcp.urgent_pointer")) / self.averageFromDataset['tcp.urgent_pointer']['std']],

            "ip.frag_offset":  [self.__getFieldValue(obj, 'ip.frag_offset', -1)],

            "eth.dst.ig": [self.__getFieldValue(obj, 'eth.dst.ig', -1)],
            "eth.src.ig": [self.__getFieldValue(obj, 'eth.src.ig', -1)], 
            "eth.src.lg": [self.__getFieldValue(obj, 'eth.src.lg', -1)],
            "eth.src_not_group": [self.__getFieldValue(obj, 'eth.src_not_group', -1)],

            "arp.isannouncement": [self.__getFieldValue(obj, 'arp.isannouncement', -1)]
        }

        self.__incrementAverageParcels("http.content_length", preProcessedObj['http.content_length'][0])
        self.__incrementAverageParcels("http.response.code", preProcessedObj['http.response.code'][0])
        self.__incrementAverageParcels("http.time", preProcessedObj['http.time'][0])
        self.__incrementAverageParcels("tcp.analysis.initial_rtt", preProcessedObj['tcp.analysis.initial_rtt'][0])

        return preProcessedObj