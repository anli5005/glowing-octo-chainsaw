import sys
import re
from skip_thoughts import configuration
from skip_thoughts import encoder_manager
from nltk.tokenize import TweetTokenizer
import nltk.data
import scipy.spatial.distance as sd
import numpy as np
import os
from parse_email import parse_email

print("Imports complete.")

sentence_detector = nltk.data.load("tokenizers/punkt/english.pickle")
tokenizer = TweetTokenizer()

print("Constructing encoder manager...")

encoder = encoder_manager.EncoderManager()
encoder.load_model(configuration.model_config(bidirectional_encoder=True), vocabulary_file="skip_thoughts_bi_2017_02_16/vocab.txt", embedding_matrix_file="skip_thoughts_bi_2017_02_16/embeddings.npy", checkpoint_path="skip_thoughts_bi_2017_02_16/model.ckpt-500008")

def encoding_for_text(subject, text):
    print("Detecting sentences...")
    sentences = []
    if text is not None and len(text.strip()) > 0:
        sentences += sentence_detector.tokenize(text)
    if subject is not None and len(subject.strip()) > 0:
        sentences.append(subject)

    print("Tokenizing sentences...")

    data = [" ".join(tokenizer.tokenize(sentence.strip())) for sentence in sentences if len(sentence) > 0]

    print("Encoding...")

    encodings = encoder.encode(data)

    return np.mean(encodings, axis=0)

def encoding_for_email(path):
    subject, text = parse_email(path)
    return encoding_for_text(subject, text)

if __name__ == "__main__":
    folders = [filename for filename in os.listdir(sys.argv[1]) if not filename.startswith(".")]
    i = 0
    x = np.empty((0, 2400))
    y = np.array([])
    for folder in folders:
        files = [filename for filename in os.listdir(os.path.join(sys.argv[1], folder)) if filename.endswith(".eml")]
        j = 0
        for filename in files:
            try:
                encoding = encoding_for_email(os.path.join(sys.argv[1], folder, filename))
                x = np.append(x, [encoding], axis=0)
                y = np.append(y, i)
                print("Done with %s - %s" % (folder, filename))
            except:
                print("==> Error reading %s - %s" % (folder, filename))
                print(sys.exc_info()[0])
            j += 1
            if j > 200: # Hard limit to balance out training data
                break
        i += 1
    np.save('x.npy', x)
    np.save('y.npy', y)
