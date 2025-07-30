//dot2SMC-Mixer v 1.1 by ArtGateOne

var easymidi = require("easymidi");
var W3CWebSocket = require("websocket").w3cwebsocket;
var client = new W3CWebSocket("ws://localhost:80/"); //U can change localhost(127.0.0.1) to Your console IP address

//config
var midi_in = "SMC-Mixer"; //set correct midi in device name
var midi_out = "SMC-Mixer"; //set correct midi out device name
var page_switch = 0; //Change pages 1-5 : 1 = ON, 0 = OFF
var page_switch_pc = 1; //Page switch on dot2  1 = ON, 0 = OFF (work if page_switch is on)
var wing = 0; //Select wing: core = 0, f-wing 1 or 2

//-----------------------------------------------------------------------------
var fader7 = "1.1"; //Core fader L SpecialMaster nr
var fader8 = "1.2"; //Core fader R SpecialMaster nr
var fader7_val = 15872; //default fader position for core L master fader
var fader8_val = 128; //default fader position for core R master fader

//Uncoment when u wan use fader 8 as Grand Master in CORE
//fader8 = "2.1";
//fader8_val = 15872;

//custom commands for buttons 1-11
var button_1_on = "";
var button_1_off = "";
var button_2_on = "";
var button_2_off = "";
var button_3_on = "";
var button_3_off = "";
var button_4_on = "";
var button_4_off = "";
var button_5_on = "";
var button_5_off = "";
var button_6_on = "";
var button_6_off = "";
var button_7_on = "";
var button_7_off = "";
var button_8_on = "";
var button_8_off = "";
var button_9_on = "";
var button_9_off = "";
var button_10_on = "";
var button_10_off = "";
var button_11_on = "clear";
var button_11_off = "";

//-------------------------------------------------------------------------------- END config

const prevFaderValues = new Array(8).fill(null);
const prevNoteStates = {};

var speedmaster1 = 60;
var speedmaster2 = 60;
var speedmaster3 = 60;
var speedmaster4 = 60;
var blackout = 0;
var grandmaster = 100;
var gmvalue = 43;
var sessionnr = 0;
var pageIndex = 0;

var request = 0;
var interval_on = 0;
var matrix = [
  213, 212, 211, 210, 209, 208, 207, 206, 113, 112, 111, 110, 109, 108, 107,
  106, 13, 12, 11, 10, 9, 8, 7, 6, 13, 12, 11, 10, 9, 8, 7, 6,
];
var exec = JSON.parse(
  '{"index":[[5,4,3,2,1,0,0,0],[13,12,11,10,9,8,7,6],[21,20,19,18,17,16,15,14]]}'
);

let button_on = [];
let button_off = [];

let mapping = {
  94: 1,
  93: 2,
  95: 3,
  91: 4,
  92: 5,
  46: 6,
  47: 7,
  96: 8,
  97: 9,
  98: 10,
  99: 11,
};

for (let key in mapping) {
  let num = mapping[key];
  button_on[key] = eval("button_" + num + "_on");
  button_off[key] = eval("button_" + num + "_off");
}

function interval() {
  if (sessionnr > 0) {
    if (wing == 2) {
      client.send(
        '{"requestType":"playbacks","startIndex":[14,114,214],"itemsCount":[8,8,8],"pageIndex":' +
          pageIndex +
          ',"itemsType":[2,3,3],"view":2,"execButtonViewMode":1,"buttonsViewMode":0,"session":' +
          sessionnr +
          ',"maxRequests":1}'
      );
    }
    if (wing == 1) {
      client.send(
        '{"requestType":"playbacks","startIndex":[6,106,206],"itemsCount":[8,8,8],"pageIndex":' +
          pageIndex +
          ',"itemsType":[2,3,3],"view":2,"execButtonViewMode":1,"buttonsViewMode":0,"session":' +
          sessionnr +
          ',"maxRequests":1}'
      );
    }
    if (wing === 0) {
      //not used
      client.send(
        '{"requestType":"playbacks","startIndex":[0,100,200],"itemsCount":[6,6,6],"pageIndex":' +
          pageIndex +
          ',"itemsType":[2,3,3],"view":2,"execButtonViewMode":1,"buttonsViewMode":0,"session":' +
          sessionnr +
          ',"maxRequests":1}'
      );
    }
  }
}

//setInterval(interval, 100);

//display info
console.log("dot2 SMC-Mixer");
console.log(" ");

//display all midi devices
console.log("Midi IN");
console.log(easymidi.getInputs());
console.log("Midi OUT");
console.log(easymidi.getOutputs());

console.log(" ");

console.log("Connecting to midi device " + midi_in);

//open midi device
var input = new easymidi.Input(midi_in);
var output = new easymidi.Output(midi_out);

for (var i = 0; i < 128; i++) {
  output.send("noteon", { note: i, velocity: 0, channel: 0 });
}

if (page_switch == 1) {
  output.send("noteon", { note: 94, velocity: 127, channel: 0 });
}

input.on("cc", function (msg) {
  if (msg.controller == 16) {
    //DIM
    if (msg.value < 60) {
      client.send(
        '{"requestType":"encoder","name":"DIM","value":' +
          msg.value +
          ',"session":' +
          sessionnr +
          '","maxRequests":0}'
      );
    } else {
      client.send(
        '{"requestType":"encoder","name":"DIM","value":' +
          (msg.value - 64) * -1 +
          ',"session":' +
          sessionnr +
          '","maxRequests":0}'
      );
    }
  }

  if (msg.controller == 17) {
    //PAN
    if (msg.value < 60) {
      client.send(
        '{"requestType":"encoder","name":"PAN","value":' +
          msg.value +
          ',"session":' +
          sessionnr +
          '","maxRequests":0}'
      );
    } else {
      client.send(
        '{"requestType":"encoder","name":"PAN","value":' +
          (msg.value - 64) * -1 +
          ',"session":' +
          sessionnr +
          '","maxRequests":0}'
      );
    }
  }

  if (msg.controller == 18) {
    //TILT
    if (msg.value < 60) {
      client.send(
        '{"requestType":"encoder","name":"TILT","value":' +
          msg.value +
          ',"session":' +
          sessionnr +
          '","maxRequests":0}'
      );
    } else {
      client.send(
        '{"requestType":"encoder","name":"TILT","value":' +
          (msg.value - 64) * -1 +
          ',"session":' +
          sessionnr +
          '","maxRequests":0}'
      );
    }
  }

  if (msg.controller == 19) {
    //SpeedMaster 1
    if (msg.value < 60) {
      speedmaster1 = speedmaster1 + msg.value;
    } else {
      speedmaster1 = speedmaster1 - (msg.value - 64);
    }
    if (speedmaster1 < 0) {
      speedmaster1 = 0;
    }
    client.send(
      '{"command":"SpecialMaster 3.1 At ' +
        speedmaster1 +
        '","session":' +
        sessionnr +
        ',"requestType":"command","maxRequests":0}'
    );
  }

  if (msg.controller == 20) {
    //SpeedMaster 2
    if (msg.value < 60) {
      speedmaster2 = speedmaster2 + msg.value;
    } else {
      speedmaster2 = speedmaster2 - (msg.value - 64);
    }
    if (speedmaster2 < 0) {
      speedmaster2 = 0;
    }
    client.send(
      '{"command":"SpecialMaster 3.2 At ' +
        speedmaster2 +
        '","session":' +
        sessionnr +
        ',"requestType":"command","maxRequests":0}'
    );
  }

  if (msg.controller == 21) {
    //SpeedMaster 3
    if (msg.value < 60) {
      speedmaster3 = speedmaster3 + msg.value;
    } else {
      speedmaster3 = speedmaster3 - (msg.value - 64);
    }
    if (speedmaster3 < 0) {
      speedmaster3 = 0;
    }
    client.send(
      '{"command":"SpecialMaster 3.3 At ' +
        speedmaster3 +
        '","session":' +
        sessionnr +
        ',"requestType":"command","maxRequests":0}'
    );
  }

  if (msg.controller == 22) {
    //SpeedMaster 4
    if (msg.value < 60) {
      speedmaster4 = speedmaster4 + msg.value;
    } else {
      speedmaster4 = speedmaster4 - (msg.value - 64);
    }
    if (speedmaster4 < 0) {
      speedmaster4 = 0;
    }
    client.send(
      '{"command":"SpecialMaster 3.4 At ' +
        speedmaster4 +
        '","session":' +
        sessionnr +
        ',"requestType":"command","maxRequests":0}'
    );
  }

  if (msg.controller == 23) {
    if (msg.value < 60) {
      grandmaster = grandmaster + msg.value;
    } else {
      grandmaster = grandmaster - (msg.value - 64);
    }
    if (grandmaster > 100) {
      grandmaster = 100;
    } else if (grandmaster < 0) {
      grandmaster = 0;
    }

    gmvalue = grandmaster / 10 + 33;

    if (blackout == 0) {
      client.send(
        '{"command":"SpecialMaster 2.1 At ' +
          grandmaster +
          '","session":' +
          sessionnr +
          ',"requestType":"command","maxRequests":0}'
      );
    }

    if (blackout == 1) {
      gmvalue = gmvalue - 32;
    }
    output.send("cc", { controller: 55, value: gmvalue, channel: 0 });
  }
});

input.on("pitch", function (msg) {
  //send fader pos do dot2
  if (wing == 0) {
    if (msg.channel < 6) {
      const clampedValue = Math.min(Math.max(msg.value, 756), 15872);
      const faderValue = mapRange(clampedValue, 756, 15872, 0, 1);
      client.send(
        '{"requestType":"playbacks_userInput","execIndex":' +
          exec.index[wing][msg.channel] +
          ',"pageIndex":' +
          pageIndex +
          ',"faderValue":' +
          faderValue +
          ',"type":1,"session":' +
          sessionnr +
          ',"maxRequests":0}'
      );
    } else if (msg.channel == 6) {
      const clampedValue = Math.min(Math.max(msg.value, 756), 15872);
      let faderValue = mapRange(clampedValue, 756, 15872, 0, 100);
      faderValue = Math.round(faderValue);
      fader7_val = msg.value;
      output.send("pitch", { value: msg.value, channel: 6 });
      client.send(
        '{"command":"SpecialMaster ' +
          fader7 +
          " At " +
          faderValue +
          '","session":' +
          sessionnr +
          ',"requestType":"command","maxRequests":0}'
      );
    } else if (msg.channel == 7) {
      const clampedValue = Math.min(Math.max(msg.value, 756), 15872);
      let faderValue = mapRange(clampedValue, 756, 15872, 0, 100);
      faderValue = Math.round(faderValue);
      fader8_val = msg.value;
      if (fader8 == "2.1") {
        grandmaster = faderValue;
        if (blackout == 1) {
          faderValue = 0;
        }
      }
      output.send("pitch", { value: msg.value, channel: 7 });
      client.send(
        '{"command":"SpecialMaster ' +
          fader8 +
          " At " +
          faderValue +
          '","session":' +
          sessionnr +
          ',"requestType":"command","maxRequests":0}'
      );
    }
  } else if (wing == 1 || wing == 2) {
    const clampedValue = Math.min(Math.max(msg.value, 756), 15872);
    const faderValue = mapRange(clampedValue, 756, 15872, 0, 1);
    client.send(
      '{"requestType":"playbacks_userInput","execIndex":' +
        exec.index[wing][msg.channel] +
        ',"pageIndex":' +
        pageIndex +
        ',"faderValue":' +
        faderValue +
        ',"type":1,"session":' +
        sessionnr +
        ',"maxRequests":0}'
    );
  }
});

if (wing == 1) {
  matrix = [
    13, 12, 11, 10, 9, 8, 7, 6, 213, 212, 211, 210, 209, 208, 207, 206, 113,
    112, 111, 110, 109, 108, 107, 106, 13, 12, 11, 10, 9, 8, 7, 6,
  ];
} else if (wing == 2) {
  matrix = [
    21, 20, 19, 18, 17, 16, 15, 14, 221, 220, 219, 218, 217, 216, 215, 214, 121,
    120, 119, 118, 117, 116, 115, 114, 21, 20, 19, 18, 17, 16, 15, 14,
  ];
} else if (wing == 0) {
  matrix = [
    5, 4, 3, 2, 1, 0, 0, 0, 205, 204, 203, 202, 201, 200, 0, 0, 105, 104, 103,
    102, 101, 100, 0, 0, 5, 4, 3, 2, 1, 0, 0, 0,
  ];
  output.send("pitch", { value: fader7_val, channel: 6 });
  output.send("pitch", { value: fader8_val, channel: 7 });
}

input.on("noteon", function (msg) {
  if (msg.note <= 31) {
    if (
      (msg.note == 6 && wing == 0) ||
      (msg.note == 7 && wing == 0) ||
      (msg.note == 14 && wing == 0) ||
      (msg.note == 15 && wing == 0) ||
      (msg.note == 22 && wing == 0) ||
      (msg.note == 23 && wing == 0) ||
      (msg.note == 30 && wing == 0) ||
      (msg.note == 31 && wing == 0)
    ) {
      if (msg.note == 7 && msg.velocity == 127) {
        client.send(
          '{"command":"DefGoForward","session":' +
            sessionnr +
            ',"requestType":"command","maxRequests":0}'
        );
      } else if (msg.note == 15 && msg.velocity == 127) {
        client.send(
          '{"command":"DefGoBack","session":' +
            sessionnr +
            ',"requestType":"command","maxRequests":0}'
        );
      } else if (msg.note == 23 && msg.velocity == 127) {
        client.send(
          '{"command":"DefGoPause","session":' +
            sessionnr +
            ',"requestType":"command","maxRequests":0}'
        );
      } else if (msg.note == 31) {
        output.send("noteon", {
          note: msg.note,
          velocity: msg.velocity,
          channel: 0,
        });
        if (msg.velocity == 127) {
          blackout = 1;
          //output.send("pitch", { value: msg.value, channel: 7 });
          client.send(
            '{"command":"SpecialMaster 2.1 At 0","session":' +
              sessionnr +
              ',"requestType":"command","maxRequests":0}'
          );
          if (fader8 == "2.1") {
            output.send("pitch", { value: 756, channel: 7 });
          }
        } else if (msg.velocity == 0) {
          blackout = 0;
          client.send(
            '{"command":"SpecialMaster 2.1 At ' +
              grandmaster +
              '","session":' +
              sessionnr +
              ',"requestType":"command","maxRequests":0}'
          );
          if (fader8 == "2.1") {
            output.send("pitch", { value: fader8_val, channel: 7 });
          }
        }
      }
      //do nothing
    } else {
      if (msg.note < 24) {
        if (msg.velocity === 127) {
          client.send(
            '{"requestType":"playbacks_userInput","cmdline":"","execIndex":' +
              matrix[msg.note] +
              ',"pageIndex":' +
              pageIndex +
              ',"buttonId":0,"pressed":true,"released":false,"type":0,"session":' +
              sessionnr +
              ',"maxRequests":0}'
          );
        } else {
          client.send(
            '{"requestType":"playbacks_userInput","cmdline":"","execIndex":' +
              matrix[msg.note] +
              ',"pageIndex":' +
              pageIndex +
              ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' +
              sessionnr +
              ',"maxRequests":0}'
          );
        }
      } else {
        if (msg.velocity === 127) {
          client.send(
            '{"requestType":"playbacks_userInput","cmdline":"","execIndex":' +
              matrix[msg.note] +
              ',"pageIndex":' +
              pageIndex +
              ',"buttonId":1,"pressed":true,"released":false,"type":0,"session":' +
              sessionnr +
              ',"maxRequests":0}'
          );
        } else {
          client.send(
            '{"requestType":"playbacks_userInput","cmdline":"","execIndex":' +
              matrix[msg.note] +
              ',"pageIndex":' +
              pageIndex +
              ',"buttonId":1,"pressed":false,"released":true,"type":0,"session":' +
              sessionnr +
              ',"maxRequests":0}'
          );
        }
      }
    }
  }

  if (
    msg.note == 94 ||
    msg.note == 93 ||
    msg.note == 95 ||
    msg.note == 91 ||
    msg.note == 92
  ) {
    if (page_switch == 1 && msg.velocity == 127) {
      output.send("noteon", { note: 91, velocity: 0, channel: 0 });
      output.send("noteon", { note: 92, velocity: 0, channel: 0 });
      output.send("noteon", { note: 93, velocity: 0, channel: 0 });
      output.send("noteon", { note: 94, velocity: 0, channel: 0 });
      output.send("noteon", { note: 95, velocity: 0, channel: 0 });

      output.send("noteon", { note: msg.note, velocity: 127, channel: 0 });
      if (msg.note == 94) {
        pageIndex = 0;
      } else if (msg.note == 93) {
        pageIndex = 1;
      } else if (msg.note == 95) {
        pageIndex = 2;
      } else if (msg.note == 91) {
        pageIndex = 3;
      } else if (msg.note == 92) {
        pageIndex = 4;
      }

      if (page_switch_pc == 1) {
        client.send(
          '{"command":"Page ' +
            (pageIndex + 1) +
            '","session":' +
            sessionnr +
            ',"requestType":"command","maxRequests":0}'
        );
      }
    } else {
      output.send("noteon", {
        note: msg.note,
        velocity: msg.velocity,
        channel: 0,
      });
      sendCommand(msg.note, msg.velocity);
    }
  } else if (
    msg.note == 46 ||
    msg.note == 47 ||
    msg.note == 96 ||
    msg.note == 97 ||
    msg.note == 98 ||
    msg.note == 99
  ) {
    output.send("noteon", {
      note: msg.note,
      velocity: msg.velocity,
      channel: 0,
    });
    sendCommand(msg.note, msg.velocity);
  }
});

//WEBSOCKET-------------------

client.onerror = function () {
  console.log("Connection Error");
};

client.onopen = function () {
  console.log("WebSocket Client Connected");
  setInterval(interval, 80);
  function sendNumber() {
    if (client.readyState === client.OPEN) {
      var number = Math.round(Math.random() * 0xffffff);
      client.send(number.toString());
      setTimeout(sendNumber, 1000);
    }
  }
  //sendNumber();
};

client.onclose = function () {
  console.log("Client Closed");
  setInterval(interval, 0);

  for (i = 0; i <= 127; i++) {
    output.send("noteon", { note: i, velocity: 0, channel: 0 });
    sleep(10, function () {});
  }
  /*
  for (i = 0; i <= 127; i++) {
    output.send("cc", { controller: i, value: 55, channel: 0 });
    sleep(10, function () {});
  }

  for (i = 0; i <= 7; i++) {
    output.send("pitch", { value: 0, channel: i });
    sleep(10, function () {});
  }
*/
  input.close();
  output.close();
  process.exit();
};

client.onmessage = function (e) {
  request = request + 1;

  if (request > 9) {
    client.send('{"session":' + sessionnr + "}");

    client.send(
      '{"requestType":"getdata","data":"set","session":' +
        sessionnr +
        ',"maxRequests":1}'
    );

    request = 1;
  }

  if (typeof e.data === "string") {
    //console.log("Received: '" + e.data + "'");
    //console.log("-----------------");
    //console.log(e.data);

    obj = JSON.parse(e.data);

    if (obj.status == "server ready") {
      client.send('{"session":0}');
    }
    if (obj.forceLogin === true) {
      sessionnr = obj.session;
      client.send(
        '{"requestType":"login","username":"remote","password":"2c18e486683a3db1e645ad8523223b72","session":' +
          obj.session +
          ',"maxRequests":10}'
      );
    }

    if (obj.session) {
      sessionnr = obj.session;
    }

    if (obj.responseType == "login" && obj.result === true) {
      if (interval_on == 0) {
        interval_on = 1;
        setInterval(interval, 100); //80
      }
      console.log("...LOGGED");
      console.log("SESSION " + sessionnr);
      if (page_switch_pc == 1) {
        client.send(
          '{"command":"Page ' +
            (pageIndex + 1) +
            '","session":' +
            sessionnr +
            ',"requestType":"command","maxRequests":0}'
        );
      }
    }

    if (obj.responseType == "getdata") {
    }

    if (obj.responseType == "playbacks") {
      if (obj.itemGroups[0].items[0][0].iExec === 0) {
        sendPitchIfChanged(6, fader7_val);
        sendPitchIfChanged(7, fader8_val);

        [6, 7, 14, 15, 22, 23].forEach((note) =>
          sendNoteIfChanged(note, note % 2 === 1 ? 127 : 0)
        );
      }

      let channel = obj.itemGroups[0].items[0][0].iExec === 0 ? 5 : 7;
      let execCount = channel === 5 ? 6 : 8;

      for (let i = 0; i < execCount; i++) {
        sendNoteIfChanged(
          channel + 8,
          obj.itemGroups[2].items[i][0].isRun * 127
        );
        sendNoteIfChanged(
          channel + 16,
          obj.itemGroups[1].items[i][0].isRun * 127
        );

        const isBlack = obj.itemGroups[0].items[i][0].i.c === "#000000";
        const shouldFlash = !isBlack && !obj.itemGroups[0].items[i][0].isRun;
        sendNoteIfChanged(channel + 24, shouldFlash ? 127 : 0);

        sendNoteIfChanged(channel, obj.itemGroups[0].items[i][0].isRun * 127);

        let v = obj.itemGroups[0].items[i][0].executorBlocks[0].fader.v;
        let midiVal = mapRange(v, 0, 1, 384, 15872);
        sendPitchIfChanged(channel, midiVal);

        channel--;
      }
    }
  }
};

function sendPitchIfChanged(channel, value) {
  if (prevFaderValues[channel] !== value) {
    output.send("pitch", { channel, value });
    prevFaderValues[channel] = value;
  }
}

function sendNoteIfChanged(note, velocity, channel = 0) {
  const key = `${note}|${channel}`;
  if (prevNoteStates[key] !== velocity) {
    output.send("noteon", { note, velocity, channel });
    prevNoteStates[key] = velocity;
  }
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function sendCommand(note, velocity) {
  if (velocity == 127) {
    client.send(
      '{"command":"' +
        button_on[note] +
        '","session":' +
        sessionnr +
        ',"requestType":"command","maxRequests":0}'
    );
  } else if (velocity == 0) {
    client.send(
      '{"command":"' +
        button_off[note] +
        '","session":' +
        sessionnr +
        ',"requestType":"command","maxRequests":0}'
    );
  }
}

//sleep function
function sleep(time, callback) {
  var stop = new Date().getTime();
  while (new Date().getTime() < stop + time) {}
  callback();
}
