from time import sleep
from sys import stdout

test_length = 240 # seconds
toggle_time = 2 # seconds
states = ['OFF', 'ON']

for val in xrange(test_length / toggle_time):
    stdout.write(states[val % len(states)])
    stdout.flush()
    sleep(toggle_time)
