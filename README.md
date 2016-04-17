# Radical Quest: Tactics

A multiplayer online game developed for CSCE 315.

# Dependencies

* cmake >= version 3.1
* libwebsockets 1.7-stable
* g++ >= version 4.8

# Compiling and Running the Server

Navigate to the server directory and run the following commands.

```
cmake .
make

# If you want to leave the server running in the background, use screen.
screen -S server # not necessary, but recommended

./rqserver

# If you are in screen and want to leave..
Ctrl + A, then press D

# To resume again...
screen -r server
```
