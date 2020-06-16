import numpy as np
import datetime
import tensorflow as tf
from sklearn.model_selection import train_test_split

x = np.load("x.npy")
y = np.load("y.npy")

trainX, testX, trainY, testY = train_test_split(x, y, test_size=0.2)

model = tf.keras.Sequential([
    tf.keras.layers.Dense(128, activation="relu"),
    tf.keras.layers.Dense(16, activation="relu"),
    tf.keras.layers.Dense(8)
])

model.compile(tf.keras.optimizers.Adam(learning_rate=0.01), loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True), metrics=["accuracy"])
tensorboard_callback = tf.keras.callbacks.TensorBoard(log_dir="logs/fit/" + datetime.datetime.now().strftime("%Y%m%d-%H%M%S"), histogram_freq=1)
model.fit(trainX, trainY, epochs=30, validation_data=(testX, testY), callbacks=[tensorboard_callback])

test_loss, test_acc = model.evaluate(testX, testY, verbose=2)
print('\nTest accuracy:', test_acc)

np.set_printoptions(threshold=np.inf)
print(testY)

model.save('./models/saved_model')
