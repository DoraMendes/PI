import threading
import websocket
import json
from time import sleep

class SendPrediction:
    ws = None
    ws_url = ''
    missed_sent_messages = [] # ordem mantem-se

    def __init__(self, ws_url):
        # aws api
        self.ws_url = ws_url
        self.__connect_websocket()

    def __connect_websocket(self):
        self.ws = websocket.WebSocketApp(self.ws_url, on_error=self.__on_error, on_close=self.__on_close, on_open=self.__on_open)

        # tenta reconectar-se de 5 em 5s
        ws_thread = threading.Thread(target=self.ws.run_forever, kwargs={ 'ping_interval': 15, 'reconnect': 5 })
        # background
        ws_thread.daemon = True
        ws_thread.start()

    def __on_error(self, ws, error):
        print("Error: " + str(error))

    def __on_close(self, ws):
        print("### Connection Closed ###")

    def __on_open(self, ws):
        while (len(self.missed_sent_messages) >= 1):
            self.ws.send(json.dumps(self.missed_sent_messages.pop(0)))
        print("Connection established.")

    def send(self, prediction, source_ip, destination_ip, protocol):
        # se a conexao estisver okay, as previsoes sao enviadas para a api por ws
        if self.ws.sock and self.ws.sock.connected:
            self.ws.send(json.dumps({ "prediction": prediction, "source_ip": source_ip, "destination_ip": destination_ip, "protocol": protocol }))
        else: 
            # as previsoes sao guardadas temporiamente localmente ate que a conexao volte
            self.missed_sent_messages.append({ "prediction": prediction, "source_ip": source_ip, "destination_ip": destination_ip, "protocol": protocol })
