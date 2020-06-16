import sys
import re
from skip_thoughts import configuration
from skip_thoughts import encoder_manager
from nltk.tokenize import TweetTokenizer
import nltk.data
import scipy.spatial.distance as sd
import numpy as np
import os
import email
from bs4 import BeautifulSoup

print("Imports complete.")

sentence_detector = nltk.data.load("tokenizers/punkt/english.pickle")
tokenizer = TweetTokenizer()

print("Constructing encoder manager...")

encoder = encoder_manager.EncoderManager()
encoder.load_model(configuration.model_config(bidirectional_encoder=True), vocabulary_file="skip_thoughts_bi_2017_02_16/vocab.txt", embedding_matrix_file="skip_thoughts_bi_2017_02_16/embeddings.npy", checkpoint_path="skip_thoughts_bi_2017_02_16/model.ckpt-500008")

parser = email.parser.Parser()

def encoding_for_email(path):
    handle = open(path, "r")
    msg = parser.parse(handle)
    handle.close()

    subject = None
    try:
        subject = handle["subject"]
    except:
        subject = None
    
    text = None
    for part in msg.walk():
        if part.get_content_type() == "text/plain":
            text = part.get_payload(decode=True).decode(part.get_content_charset("utf-8")).split("________________________________")[0]
            try:
                text = BeautifulSoup(text).get_text()
            except:
                print("Unable to parse HTML.")

    print("Detecting sentences...")
    sentences = []
    if text is not None:
        sentences += sentence_detector.tokenize(re.sub(r"=(\r?\n)?", "", text.replace("=92", "'")).strip())
    if subject is not None:
        sentences.append(subject)

    print("Tokenizing sentences...")

    data = [" ".join(tokenizer.tokenize(sentence.strip())) for sentence in sentences]

    print("Encoding...")

    encodings = encoder.encode(data)

    handle.close()

    return np.mean(encodings, axis=0), subject, data

if __name__ == "__main__":
    folders = [filename for filename in os.listdir(sys.argv[1]) if not filename.startswith(".")]
    i = 0
    x = np.empty((0, 2400))
    y = np.array([])
    for folder in folders:
        files = [filename for filename in os.listdir(os.path.join(sys.argv[1], folder)) if filename.endswith(".eml")]
        for filename in files:
            try:
                encoding, _a, _b = encoding_for_email(os.path.join(sys.argv[1], folder, filename))
                x = np.append(x, [encoding], axis=0)
                y = np.append(y, i)
                print("Done with %s - %s" % (folder, filename))
            except:
                print("==> Error reading %s - %s" % (folder, filename))
                print(sys.exc_info()[0])
        i += 1
    np.save('x.npy', x)
    np.save('y.npy', y)