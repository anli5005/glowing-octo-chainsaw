import process_data
import tensorflow as tf
import sys
import numpy as np

categories = ["Email Chains", "Announcements", "Lost Items", "Links", "Surveys", "Communication", "Automated Emails", "Administration"]

encoding, subject, text = process_data.encoding_for_email(sys.argv[1])
print(subject)
print(text)
print(encoding)

print("Reading model...")
model = tf.keras.models.load_model('models/saved_model')

inp = np.array([encoding])
y = model.predict(inp, verbose=2)
for i in range(len(categories)):
    print("%s: %d" % (categories[i], y[0][i]))