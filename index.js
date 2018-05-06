/*
  Authors: Dillon de Silva (Codetilldrop)
           Buddhike de Silva (buddyspike)
*/

const express = require('express');
const SerialPump = require('./serial-pump');

var lastId = -1;
var records = []; // List of records we've received so far
var clients = []; // List of browsers connected via ws

var outOfOrder = 0;

const pump = new SerialPump(r => {
  if (r.id > lastId) {
    records.push(r)
    lastId = r.id;
    console.log(r);
    outOfOrder = 0;
    let failures = [];
    for (var c of clients) {
      try{
        c.send(JSON.stringify(r))
      } catch (e){
        failures.push(c);
      }
    }

    for (var f of failures) {
      let idx = clients.indexOf(f);
      if (idx > -1 ) {
        clients.splice(idx, 1);
      }
    }
  } else {
    console.log(`Received an old message ${r.acceleration}`);
    outOfOrder++;
    if (outOfOrder >= 20) {
      console.log("Last Tracked ID has been reset");
      lastId = r.id;
      outOfOrder = 0;
    }
  }
});

pump.start();

const app = express();
var expressWs = require('express-ws')(app);

app.use(express.static('ui'));
app.get('/stats', function (req, res) {
  res.json(records);
});

app.ws('/events', (ws, req) => {
  clients.push(ws);
});

app.listen(9000);
