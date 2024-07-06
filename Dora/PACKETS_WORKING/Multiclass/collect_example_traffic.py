import csv

# SLOWHTTPTEST tool expects a target to send http packets to. So this is a just a dummy http server so we have a target
# subprocess.Popen(["python3", "-m", "http.server", "4000"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

class CollectTraffic:
    def __iter__(self):
        self.f = open('/mnt/IP-Based Packets Dataset.csv', newline='')
        self.reader = csv.reader(self.f)
        self.headers = next(self.reader)
        return self

    def __next__(self):
        row = next(self.reader)
        if row != None:
            obj = {}
            for i, h in enumerate(self.headers):
                obj[h] = row[i]
            
            del obj['is_malicious']
            del obj['attack_type']
            return obj
        else:
            self.f.close();
            raise StopIteration