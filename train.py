import numpy as np
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

model.compile(optimizer="adam", loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True), metrics=["accuracy"])

model.fit(trainX, trainY, epochs=100)

test_loss, test_acc = model.evaluate(testX, testY, verbose=2)
print('\nTest accuracy:', test_acc)

np.set_printoptions(threshold=np.inf)
print(testY)

model.save_weights('./checkpoints/my_checkpoint')