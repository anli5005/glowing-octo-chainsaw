from process_data import encoding_for_text
import tensorflow as tf
import numpy as np
from flask import Flask, request, json, make_response

app = Flask(__name__)

print("Loading model...")
model = tf.keras.models.load_model('models/saved_model')

@app.route("/", methods=["POST"])
def analyze_email():
    encoding = encoding_for_text(request.json["subject"] if "subject" in request.json else None, request.json["text"] if "text" in request.json else None)
    inp = np.array([encoding])
    y = model.predict(inp, verbose=2)
    result = {"ok": True, "result": y[0].tolist()}
    if "include_encoding" in request.json and request.json["include_encoding"]:
        result["encoding"] = encoding.tolist()
    return json.jsonify(result)

@app.after_request
def add_cors_header(res):
    res.headers["Access-Control-Allow-Origin"] = "*"
    res.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return res

print("Done starting!")
