import tensorflow as tf
import pandas as pd
import argparse
import socket
from collect_real_traffic import CollectTraffic
from pre_processing_of_traffic import PreProcess
from send_prediction import SendPrediction
from urllib.parse import urlparse

# argument server-url when main is called in the Dockerfile
parser = argparse.ArgumentParser("Script Model stuff")
parser.add_argument("--server_url", dest='server_url', help="A valid websocket url to where the model output is going to get passthrough through a websocket connection", type=str)
args = parser.parse_args()

# load model
multiclass_model = tf.keras.models.load_model('model_multiclass.h5', compile=False)

# instance classes
pre_processing = PreProcess()
send_prediction = SendPrediction(args.server_url)

# prevent TShark from spying on our ws pakcets (ignore IP)
ws_server_ip = socket.gethostbyname(urlparse(args.server_url).hostname)

# instance CollectTraffic class and grab iterator from it
for x in iter(CollectTraffic(ws_server_ip)):
    model_data, extra = x.values()

    y = pre_processing.preprocess(model_data)

    # construir data frame para enviar ao modelo
    df = pd.DataFrame.from_dict(y)

    # previsao do modelo
    prediction = multiclass_model.predict(df, verbose=0) # verbose disabled to keep this script wasting performance (could be enabled to debug)
    
    # enviar previsao para a api por ws
    send_prediction.send(prediction.flatten().tolist(), extra['ip_src'], extra['ip_dst'], "1")