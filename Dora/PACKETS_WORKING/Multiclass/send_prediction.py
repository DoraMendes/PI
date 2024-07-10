import threading
import websocket
import json
from time import sleep

class SendPrediction:
    ws = None
    ws_url = ''
    missed_sent_messages = []

    def __connect_websocket(self):
        try:
            self.ws = websocket.WebSocketApp(self.ws_url, on_error=self.__on_error, on_close=self.__on_close, on_open=self.__on_open)
            thread_ws = threading.Thread(target=self.ws.run_forever)
            thread_ws.daemon = True
            thread_ws.start()
        except:
            sleep(5)
            self.__connect_websocket()

    def __init__(self, ws_url):
        self.ws_url = ws_url
        self.__connect_websocket()

    def __on_error(self, ws, error):
        print("Error: " + str(error))
        self.__connect_websocket()

    def __on_close(self, ws):
        print("### Connection Closed ###")
        self.__connect_websocket()

    def __on_open(self, ws):
        while (len(self.missed_sent_messages) >= 1):
            self.ws.send(json.dumps(self.missed_sent_messages.pop()))
        print("Connection established.")

    def send(self, prediction, source_ip, destination_ip, protocol):
        if self.ws.sock and self.ws.sock.connected:
            self.ws.send(json.dumps({ "prediction": prediction, "source_ip": source_ip, "destination_ip": destination_ip, "protocol": protocol }))
        else: 
            self.missed_sent_messages.append({ "prediction": prediction, "source_ip": source_ip, "destination_ip": destination_ip, "protocol": protocol })
