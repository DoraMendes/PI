import tensorflow as tf
import pandas as pd
import subprocess
import argparse
from collect_real_traffic import CollectTraffic
from pre_processing_of_traffic import PreProcess
from send_prediction import SendPrediction

parser = argparse.ArgumentParser("Script Model stuff")
parser.add_argument("--server_url", dest='server_url', help="A valid websocket url to where the model output is going to get passthrough through a websocket connection", type=str)
args = parser.parse_args()

multiclass_model = tf.keras.models.load_model('model_multiclass.h5', compile=False)

pre_processing = PreProcess()
send_prediction = SendPrediction(args.server_url)

for x in iter(CollectTraffic()):
    y = pre_processing.preprocess(x)
    df = pd.DataFrame.from_dict(y)
    prediction = multiclass_model.predict(df, verbose=0) # verbose disabled to keep this script wasting performance (could be enabled to debug)
    send_prediction.send(prediction.flatten().tolist())