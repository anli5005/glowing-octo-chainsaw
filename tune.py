import numpy as np
import datetime
import tensorflow as tf
from sklearn.model_selection import train_test_split
import kerastuner as kt

x = np.load("x.npy")
y = np.load("y.npy")

trainX, testX, trainY, testY = train_test_split(x, y, test_size=0.2)

def model_builder(hp):
    model = tf.keras.Sequential()
    model.add(tf.keras.layers.Dense(hp.Int("units", min_value = 32, max_value = 512, step = 32), activation='relu'))
    model.add(tf.keras.layers.Dense(128, activation="relu"))
    model.add(tf.keras.layers.Dense(16, activation="relu"))
    model.add(tf.keras.layers.Dense(8))
    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate = hp.Choice("learning_rate", values=[1e-2, 1e-3, 1e-4])), loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True), metrics=["accuracy"])
    return model

tuner = kt.Hyperband(model_builder, objective='val_acc', max_epochs=100, factor=2, directory="tuning", project_name="glowing-octo-chainsaw")
tuner.search(trainX, trainY, epochs=75, validation_data = (testX, testY))
best_hps = tuner.get_best_hyperparameters(num_trials = 4)[0]
print(f"Units: {best_hps.get('units')}, learning rate: {best_hps.get('learning_rate')}")

#tensorboard_callback = tf.keras.callbacks.TensorBoard(log_dir="logs/fit/" + datetime.datetime.now().strftime("%Y%m%d-%H%M%S"), histogram_freq=1)
#model.fit(trainX, trainY, epochs=100, validation_data=(testX, testY), callbacks=[tensorboard_callback])

#test_loss, test_acc = model.evaluate(testX, testY, verbose=2)
#print('\nTest accuracy:', test_acc)

#np.set_printoptions(threshold=np.inf)
#print(testY)

#model.save('./models/saved_model')
