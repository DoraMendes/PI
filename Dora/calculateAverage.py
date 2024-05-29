import csv

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

    # Calculate and print the average for each column
    print(f"########## FILE '{file1}' ##########")
    for i, header in enumerate(headers):
        average = sums[i] / counts[i] if counts[i] != 0 else 0
        print(f"Average {header}: {average:.2f}")

#### OUTPUT: ####
# Average http.chat: 0.14
# Average http.content_length: 0.06
# Average http.request: 0.08
# Average http.response: 0.08
# Average http.response.code: 0.03
# Average http.response_number: 0.08
# Average http.time: 0.01
# Average tcp.analysis.ack_rtt: 0.00
# Average tcp.analysis.bytes_in_flight: 0.12
# Average tcp.analysis.initial_rtt: 0.00
# Average tcp.analysis.push_bytes_sent: 0.12
# Average tcp.connection.fin: 0.07
# Average tcp.connection.syn: 0.09
# Average tcp.connection.synack: 0.03
# Average tcp.flags: -0.01
# Average tcp.flags.ack: 0.72
# Average tcp.flags.cwr: 0.09
# Average tcp.flags.ecn: 0.09
# Average tcp.flags.fin: -0.03
# Average tcp.flags.ns: 0.09
# Average tcp.flags.push: 0.20
# Average tcp.flags.res: 0.00
# Average tcp.flags.reset: -0.04
# Average tcp.flags.syn: 0.03
# Average tcp.flags.urg: 0.09
# Average tcp.hdr_len: 0.03
# Average tcp.option_kind: 0.97
# Average tcp.option_len: 3.79
# Average tcp.urgent_pointer: 0.09
# Average ip.flags.df: 0.53
# Average ip.flags.mf: 0.19
# Average ip.flags.rb: 0.19
# Average ip.frag_offset: 0.19
# Average frame.cap_len: 0.11
# Average frame.len: 0.11
# Average is_malicious: 0.69
# Average attack_type: 3.12
# Average tcp.connection.rst: 0.11
# Average tcp.len: -0.03
# Average ip.ttl: -0.02
# Average ip.flags_0: 0.48
# Average ip.flags_64: 0.52
# Average tcp.pdu.size: 16.42
# Average mqtt.dupflag: 0.64
# Average mqtt.qos: -0.60
# Average mqtt.retain: 0.64
# Average mqtt.unknown_version: 0.33
# Average eth.dst.ig: 0.50
# Average eth.ig: 0.50
# Average eth.lg: 0.50
# Average eth.src.ig: 0.50
# Average eth.src.lg: 0.50
# Average eth.src_not_group: 0.50
# Average arp.isannouncement: 0.00
# Average arp.isgratuitous: 0.00
# Average arp.opcode: 1.00
# Average coap.mid: -0.01
# Average coap.opt.end_marker: 55.54
# Average coap.payload_length: -0.01
# Average data.len: 0.08
# Average coap.code_3.0: 0.11
# Average coap.code_68.0: 0.11
# Average coap.code_0: 0.78
# Average coap.opt.delta_3.0: 0.11
# Average coap.opt.delta_12.0: 0.11
# Average coap.opt.delta_0: 0.78
# Average coap.opt.length_0.0: 0.11
# Average coap.opt.length_12.0: 0.11
# Average coap.opt.length_1: 0.78
# Average coap.type_0.0: 0.11
# Average coap.type_2.0: 0.11
# Average coap.type_1: 0.78


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
    print(f"\n\n########## FILE '{file2}' ##########")
    for i, header in enumerate(headers):
        average = sums[i] / counts[i] if counts[i] != 0 else 0
        print(f"Average {header}: {average:.2f}")

#### OUTPUT: ####
# Average http.content_length: 0.06
# Average http.request: -0.86
# Average http.response.code: 0.03
# Average http.response_number: -0.80
# Average http.time: 0.01
# Average tcp.analysis.initial_rtt: 0.00
# Average tcp.connection.fin: -0.15
# Average tcp.connection.syn: -0.07
# Average tcp.connection.synack: -0.10
# Average tcp.flags.cwr: 0.00
# Average tcp.flags.ecn: 0.00
# Average tcp.flags.fin: 0.16
# Average tcp.flags.ns: 0.00
# Average tcp.flags.res: -0.25
# Average tcp.flags.syn: 0.19
# Average tcp.flags.urg: 0.00
# Average tcp.urgent_pointer: -0.00
# Average ip.frag_offset: 0.10
# Average is_malicious: 0.50
# Average attack_type: 2.25
# Average eth.dst.ig: -0.91
# Average eth.src.ig: -0.91
# Average eth.src.lg: -0.91
# Average eth.src_not_group: -0.91
# Average arp.isannouncement: -0.94