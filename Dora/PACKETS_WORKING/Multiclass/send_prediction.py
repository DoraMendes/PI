import threading
import websocket
import json
import rel

class SendPrediction:
    ws = None
    missed_sent_messages = []

    def __init__(self, ws_url):
        self.ws = websocket.WebSocketApp(ws_url, on_error=self.__on_error, on_close=self.__on_close, on_open=self.__on_open)
        thread_ws = threading.Thread(target=self.ws.run_forever, kwargs={ dispatcher: rel, reconnect: 3 })
        thread_ws.daemon = True
        thread_ws.start()

    def __on_error(self, ws, error):
        print("Error: " + str(error))

    def __on_close(self, ws):
        while (len(self.missed_sent_messages) >= 1):
            self.ws.send(json.dumps(self.missed_sent_messages.pop()))
        print("### Connection Closed ###")

    def __on_open(self, ws):
        print("Connection established.")

    def send(self, prediction, source_ip, destination_ip, protocol):
        if self.ws.sock and self.ws.sock.connected:
            self.ws.send(json.dumps({ "prediction": prediction, "source_ip": source_ip, "destination_ip": destination_ip, "protocol": protocol }))
        else: 
            self.missed_sent_messages.append({ "prediction": prediction, "source_ip": source_ip, "destination_ip": destination_ip, "protocol": protocol })
