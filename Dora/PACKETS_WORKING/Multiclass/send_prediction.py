import threading
import websocket
import json

class SendPrediction:
    ws = None

    def __init__(self, ws_url):
        self.ws = websocket.WebSocketApp(ws_url, on_error=self.__on_error, on_close=self.__on_close, on_open=self.__on_open)
        thread_ws = threading.Thread(target=self.ws.run_forever)
        thread_ws.daemon = True
        thread_ws.start()

    def __on_error(self, ws, error):
        print("Error: " + str(error))

    def __on_close(self, ws):
        print("### Connection Closed ###")

    def __on_open(self, ws):
        print("Connection established.")

    def send(self, result):
        if self.ws.sock and self.ws.sock.connected:
            self.ws.send(json.dumps({ "prediction": result }))
