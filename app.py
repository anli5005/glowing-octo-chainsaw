from process_data import encoding_for_text
import tensorflow as tf
import numpy as np
from flask import Flask, request, json

app = Flask(__name__)

print("Loading model...")
model = tf.keras.models.load_model('models/saved_model')

@app.route("/", methods=["POST"])
def analyze_email():
    encoding = encoding_for_text(request.json["subject"], request.json["text"])
    inp = np.array([encoding])
    y = model.predict(inp, verbose=2)
    result = {"ok": True, "result": y[0].tolist()}
    if "include_encoding" in request.json and request.json["include_encoding"]:
        result["encoding"] = encoding.tolist()
    return json.jsonify(result)

print("Done starting!")
