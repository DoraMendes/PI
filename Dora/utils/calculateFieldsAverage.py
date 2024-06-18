import csv
import json
import numpy
import math

# we need to have this file locally - to big to commit and push it to git (limit of 2GB)
file1 = '/Users/dora.mendes/Downloads/Dataset & Captures/Datasets/IP-Based/Packets/IP-Based Packets Dataset.csv';
with open(file1, newline='') as csvfile:
    reader = csv.reader(csvfile)
    headers = next(reader)  # Read the header row

    # Initialize variables to store column sums and counts
    sums = [0] * len(headers)
    counts = [0] * len(headers)

    # Iterate through each row in the CSV file
    for row in reader:
        for i, value in enumerate(row):
            try:
                num = float(value)
                sums[i] += num
                counts[i] += 1
            except ValueError:
                pass  # Ignore non-numeric values 

    csvfile.seek(1)

    std = [0] * len(headers)

    for row in reader:
        for i, value in enumerate(row):
            try:
                std[i] += pow((float(value) - (sums[i] / counts[i] if counts[i] != 0 else 0)), 2);
            except ValueError:
                pass  # Ignore non-numeric values 

    # Calculate and print the average for each column
    print(f"########## FILE '{file1}' ##########")
    obj = {}
    for i, header in enumerate(headers):
        obj[header] = { 'total': counts[i], 'total_sum': sums[i], 'std': math.sqrt(std[i] / counts[i] if counts[i] != 0 else 0) }

    output = open('a.json', 'w')
    output.write(json.dumps(obj))
    output.close()

########## FILE '/Users/dora.mendes/Downloads/Dataset & Captures/Datasets/IP-Based/Packets/IP-Based Packets Dataset.csv' ##########
# http.chat -> Sum: 25897.0 TotalRows: 187500
# http.content_length -> Sum: 10794.954495745444 TotalRows: 187500
# http.request -> Sum: 10140.0 TotalRows: 125000
# http.response -> Sum: 15757.0 TotalRows: 187500
# http.response.code -> Sum: 5886.378417449204 TotalRows: 187500
# http.response_number -> Sum: 15757.0 TotalRows: 187500
# http.time -> Sum: 1841.3556160637654 TotalRows: 187500
# tcp.analysis.ack_rtt -> Sum: 909.2136690008292 TotalRows: 596760
# tcp.analysis.bytes_in_flight -> Sum: 74510.5339921491 TotalRows: 596760
# tcp.analysis.initial_rtt -> Sum: 453.79924899990857 TotalRows: 596760
# tcp.analysis.push_bytes_sent -> Sum: 71536.73925445936 TotalRows: 596760
# tcp.connection.fin -> Sum: 35684.0 TotalRows: 534260
# tcp.connection.syn -> Sum: 51753.0 TotalRows: 596760
# tcp.connection.synack -> Sum: 20504.0 TotalRows: 596760
# tcp.flags -> Sum: -7789.4136367576475 TotalRows: 596760
# tcp.flags.ack -> Sum: 427861.0 TotalRows: 596760
# tcp.flags.cwr -> Sum: 56531.0 TotalRows: 596760
# tcp.flags.ecn -> Sum: 56531.0 TotalRows: 596760
# tcp.flags.fin -> Sum: -20847.0 TotalRows: 596760
# tcp.flags.ns -> Sum: 56531.0 TotalRows: 596760
# tcp.flags.push -> Sum: 121033.0 TotalRows: 596760
# tcp.flags.res -> Sum: 0.0 TotalRows: 540229
# tcp.flags.reset -> Sum: -21173.0 TotalRows: 596760
# tcp.flags.syn -> Sum: 15726.0 TotalRows: 596760
# tcp.flags.urg -> Sum: 56531.0 TotalRows: 596760
# tcp.hdr_len -> Sum: 18211.354110327546 TotalRows: 596760
# tcp.option_kind -> Sum: 577157.0 TotalRows: 596760
# tcp.option_len -> Sum: 2259295.0 TotalRows: 596760
# tcp.urgent_pointer -> Sum: 56531.0 TotalRows: 596760
# ip.flags.df -> Sum: 318966.0 TotalRows: 596760
# ip.flags.mf -> Sum: 110761.0 TotalRows: 596760
# ip.flags.rb -> Sum: 110761.0 TotalRows: 596760
# ip.frag_offset -> Sum: 110761.0 TotalRows: 596760
# frame.cap_len -> Sum: 78164.82318602319 TotalRows: 721760
# frame.len -> Sum: 78164.82318602319 TotalRows: 721760
# is_malicious -> Sum: 500000.0 TotalRows: 721760
# attack_type -> Sum: 2250000.0 TotalRows: 721760
# tcp.connection.rst -> Sum: 31247.0 TotalRows: 284260
# tcp.len -> Sum: -4117.01882131283 TotalRows: 125000
# ip.ttl -> Sum: -7440.838242781163 TotalRows: 346760
# ip.flags_0 -> Sum: 167033.0 TotalRows: 346760
# ip.flags_64 -> Sum: 179727.0 TotalRows: 346760
# tcp.pdu.size -> Sum: 4667678.0 TotalRows: 284260
# mqtt.dupflag -> Sum: 181189.0 TotalRows: 284260
# mqtt.qos -> Sum: -169346.0 TotalRows: 284260
# mqtt.retain -> Sum: 181189.0 TotalRows: 284260
# mqtt.unknown_version -> Sum: 92578.0 TotalRows: 284260
# eth.dst.ig -> Sum: 31288.0 TotalRows: 62500
# eth.ig -> Sum: 31288.0 TotalRows: 62500
# eth.lg -> Sum: 31049.0 TotalRows: 62500
# eth.src.ig -> Sum: 31254.0 TotalRows: 62500
# eth.src.lg -> Sum: 31345.0 TotalRows: 62500
# eth.src_not_group -> Sum: 31254.0 TotalRows: 62500
# arp.isannouncement -> Sum: 13.0 TotalRows: 62500
# arp.isgratuitous -> Sum: 13.0 TotalRows: 62500
# arp.opcode -> Sum: 62566.0 TotalRows: 62500
# coap.mid -> Sum: -1626.8971612848127 TotalRows: 221760
# coap.opt.end_marker -> Sum: 12316500.0 TotalRows: 221760
# coap.payload_length -> Sum: -1487.0213608769918 TotalRows: 221760
# data.len -> Sum: 17351.191131133597 TotalRows: 221760
# coap.code_3.0 -> Sum: 24150.0 TotalRows: 221760
# coap.code_68.0 -> Sum: 24150.0 TotalRows: 221760
# coap.code_0 -> Sum: 173460.0 TotalRows: 221760
# coap.opt.delta_3.0 -> Sum: 24150.0 TotalRows: 221760
# coap.opt.delta_12.0 -> Sum: 24150.0 TotalRows: 221760
# coap.opt.delta_0 -> Sum: 173460.0 TotalRows: 221760
# coap.opt.length_0.0 -> Sum: 24150.0 TotalRows: 221760
# coap.opt.length_12.0 -> Sum: 24150.0 TotalRows: 221760
# coap.opt.length_1 -> Sum: 173460.0 TotalRows: 221760
# coap.type_0.0 -> Sum: 24150.0 TotalRows: 221760
# coap.type_2.0 -> Sum: 24150.0 TotalRows: 221760
# coap.type_1 -> Sum: 173460.0 TotalRows: 221760




# we need to have this file locally - to big to commit and push it to git (limit of 2GB)
file2 = '/Users/dora.mendes/Downloads/Dataset & Captures/Datasets/IP-Based/Packets/IP-Based Packets Pre-Processed Dataset.csv';
with open(file2, newline='') as csvfile:
    reader = csv.reader(csvfile)
    headers = next(reader)  # Read the header row

    # Initialize variables to store column sums and counts
    sums = [0] * len(headers)
    counts = [0] * len(headers)

    # Iterate through each row in the CSV file
    for row in reader:
        for i, value in enumerate(row):
            try:
                num = float(value)
                sums[i] += num
                counts[i] += 1
            except ValueError:
                pass  # Ignore non-numeric values

    # Calculate and print the average for each column
    print(f"########## FILE '{file1}' ##########")
    for i, header in enumerate(headers):
        print(f"{header} -> Sum: {sums[i]} TotalRows: {counts[i]}")


########## FILE '/Users/dora.mendes/Downloads/Dataset & Captures/Datasets/IP-Based/Packets/IP-Based Packets Dataset.csv' ##########
# http.content_length -> Sum: 57573.09064286281 TotalRows: 1000000
# http.request -> Sum: -864860.0 TotalRows: 1000000
# http.response.code -> Sum: 31394.018227041604 TotalRows: 1000000
# http.response_number -> Sum: -796743.0 TotalRows: 1000000
# http.time -> Sum: 9820.563285753651 TotalRows: 1000000
# tcp.analysis.initial_rtt -> Sum: 518.6277131404368 TotalRows: 1000000
# tcp.connection.fin -> Sum: -151816.0 TotalRows: 1000000
# tcp.connection.syn -> Sum: -73247.0 TotalRows: 1000000
# tcp.connection.synack -> Sum: -104496.0 TotalRows: 1000000
# tcp.flags.cwr -> Sum: 2384.0 TotalRows: 1000000
# tcp.flags.ecn -> Sum: 2384.0 TotalRows: 1000000
# tcp.flags.fin -> Sum: 158300.0 TotalRows: 1000000
# tcp.flags.ns -> Sum: 2384.0 TotalRows: 1000000
# tcp.flags.res -> Sum: -252384.0 TotalRows: 1000000
# tcp.flags.syn -> Sum: 194873.0 TotalRows: 1000000
# tcp.flags.urg -> Sum: 2384.0 TotalRows: 1000000
# tcp.urgent_pointer -> Sum: -1.6694823732343878e-06 TotalRows: 1000000
# ip.frag_offset -> Sum: 97932.0 TotalRows: 1000000
# is_malicious -> Sum: 500000.0 TotalRows: 1000000
# attack_type -> Sum: 2250000.0 TotalRows: 1000000
# eth.dst.ig -> Sum: -906212.0 TotalRows: 1000000
# eth.src.ig -> Sum: -906246.0 TotalRows: 1000000
# eth.src.lg -> Sum: -906155.0 TotalRows: 1000000
# eth.src_not_group -> Sum: -906246.0 TotalRows: 1000000
# arp.isannouncement -> Sum: -937487.0 TotalRows: 1000000