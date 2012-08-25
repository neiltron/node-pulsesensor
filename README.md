# node-pulsesensor
A browser front-end for an arduino [pulse sensor](http://pulsesensor.com/) using johnny-five, express, socket.io, and flot.


## Usage
Assuming your pulse sensor is [setup properly](http://pulsesensor.myshopify.com/pages/code-and-guide) and you've installed StandardFirmata on your arduino (as per [johnny-five setup instructions](https://github.com/rwldrn/johnny-five#setup-and-assemble-arduino)):

    git clone https://github.com/neiltron/node-pulsesensor.git
    cd node-pulsesensor
    node bin/server&
    open http://localhost:8082