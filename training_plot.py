from tensorboard.backend.event_processing.event_accumulator import EventAccumulator
import matplotlib.pyplot as plt
import numpy as np
import sys

# Many thanks to https://gist.github.com/tomrunia/1e1d383fb21841e8f144
event_acc = EventAccumulator(sys.argv[1], {
    "compressedHistograms": 10,
    "images": 0,
    "scalars": 100,
    "histograms": 1
})

event_acc.Reload()

epochs = 50

print(event_acc.Tags())
training = event_acc.Scalars("epoch_acc")
val = event_acc.Scalars("epoch_val_acc")

x = np.arange(epochs)
y = np.array([[value[2] for value in values] for values in zip(training, val)])
print(np.shape(y))

plt.plot(x, y[:,0], label="Training accuracy")
plt.plot(x, y[:,1], label="Validation accuracy")

print("Final training accuracy:   " + str(training[epochs - 1][2]))
print("Final validation accuracy: " + str(val[epochs - 1][2]))

plt.xlabel("Epochs")
plt.ylabel("Accuracy")
plt.legend()
plt.savefig("plot.png", transparent=True)
plt.show()