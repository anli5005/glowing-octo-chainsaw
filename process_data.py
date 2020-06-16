import sys
import re
from skip_thoughts import configuration
from skip_thoughts import encoder_manager
from nltk.tokenize import TweetTokenizer
import nltk.data
import scipy.spatial.distance as sd
import numpy as np
import os

print("Imports complete.")

sentence_detector = nltk.data.load("tokenizers/punkt/english.pickle")
tokenizer = TweetTokenizer()

print("Constructing encoder manager...")

encoder = encoder_manager.EncoderManager()
encoder.load_model(configuration.model_config(bidirectional_encoder=True), vocabulary_file="skip_thoughts_bi_2017_02_16/vocab.txt", embedding_matrix_file="skip_thoughts_bi_2017_02_16/embeddings.npy", checkpoint_path="skip_thoughts_bi_2017_02_16/model.ckpt-500008")

def encoding_for_email(path):
    handle = open(path, "r")

    header = ""
    subject = None
    boundary = None
    header_ended = False
    text = None
    section_header_ended = False
    section_is_text = False

    while True:
        line = handle.readline()

        if len(line) == 0:
            break

        if not header_ended and re.match(r"^(?:\r?\n)?$", line) is not None:
            header_ended = True
            subject = re.search(re.compile(r"^Subject: (.*)$", re.MULTILINE), header).group(1)

            boundary = re.search(re.compile(r"^Content-Type: multipart/(alternative|related|mixed);\r?\n?[ \t]+boundary=\"(.*)\"", re.MULTILINE), header).group(1)

        if header_ended:
            if re.match(r"^--" + re.escape(boundary) + r"(?:--)?(?:\r?\n)?$", line) is not None or re.match(r"^________________________________(?:\r?\n)?$", line) is not None:
                section_header_ended = False
                if section_is_text:
                    break
                section_is_text = False
                text = None
                if line.endswith("--"):
                    print("No text section.")
            elif not section_header_ended:
                if re.match(r"^(?:\r?\n)?$", line) is not None:
                    section_header_ended = True
                    continue

                if re.search(r"^Content-Type: text/plain", line) is not None:
                    section_is_text = True
                    text = ""
                
                if section_is_text and re.search("base64", line) is not None:
                    section_is_text = False
                    text = None
            elif section_is_text:
                text += line
        else:
            header += line

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

    return np.mean(encodings, axis=0), subject, text

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
        i += 1
    np.save('x.npy', x)
    np.save('y.npy', y)