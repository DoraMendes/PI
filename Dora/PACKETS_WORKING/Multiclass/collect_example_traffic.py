import csv

# SLOWHTTPTEST tool expects a target to send http packets to. So this is a just a dummy http server so we have a target
# subprocess.Popen(["python3", "-m", "http.server", "4000"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

class CollectTraffic:
    n = 0
    ip_dst = ""
    ip_src = ""
    
    def __iter__(self):
        self.f = open('/mnt/IP-Based Packets Dataset.csv', newline='')
        self.reader = csv.reader(self.f)
        self.headers = next(self.reader)
        return self

    def __next__(self):
        if self.n == 0:
            self.ip_dst = socket.inet_ntoa(struct.pack('>I', random.randint(1, 0xffffffff)))
            self.ip_src = socket.inet_ntoa(struct.pack('>I', random.randint(1, 0xffffffff)))
            self.n = randint(1, 20000)

        row = next(self.reader)
        if row != None:
            obj = {}
            for i, h in enumerate(self.headers):
                obj[h] = row[i]
            
            del obj['is_malicious']
            del obj['attack_type']
            obj["ip.src"] = self.ip_src
            obj["ip.dst"] = self.ip_dst
            return obj
        else:
            self.f.close();
            raise StopIteration