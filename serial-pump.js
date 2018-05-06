var SerialPort = require('serialport');
var port = new SerialPort('/dev/tty.usbmodem1422', { autoOpen: false });

class SerialPump {
  constructor(callback) {
    this._callback = callback;
  }

  start() {
    port.open(function (err) {
      if (err) {
        throw('Error opening port: ', err.message);
      }
    });

    let line = ''
    let cb = this._callback;

    port.on('data', function (data) {
      let c = data.toString()
      if (c === '\r') {
        return
      } else if (c === '\n') {
        let parts = line.split(',');
        cb({
          id: Number.parseInt(parts[0]),
          acceleration: Number.parseFloat(parts[1]),
          temperature: Number.parseFloat(parts[2])
        });
        line = '';
      } else {
        line = line + c
      }
    });
  }
}

module.exports = SerialPump;
