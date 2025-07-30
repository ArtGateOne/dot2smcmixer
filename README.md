# dot2smcmixer
control dot2 use M-Vave smc mixer


💻 Setup Instructions
Download and install Node.js version 14.17 --> https://nodejs.org/dist/v14.17.0/node-v14.17.0-x64.msi

Download the ZIP archive of my code and extract it anywhere you like

Open the folder with the code. Set node.exe as the default program for .js files:

Right-click a .js file → Properties → Choose node.exe from the Node.js folder in Program Files

The file icon should turn green, indicating it’s set correctly

Launch dot2 onPC

In Global Settings, enable Web Remote and set the password to "remote"

To verify that the server is working, open the webpage: http://127.0.0.1

If the page loads correctly, you can launch my code — it will automatically connect to the program.

If it doesn’t start:

Retry

Check if your SMC mixer is connected

Ensure the mixer isn’t being used by another app or selected in the MIDI settings

⚙️ Configuration in dot2smcmixer file
javascript
//config
var midi_in = "SMC-Mixer";      // Set correct MIDI input device name
var midi_out = "SMC-Mixer";     // Set correct MIDI output device name
var page_switch = 0;            // Page switching: 1 = ON, 0 = OFF
var page_switch_pc = 1;         // Page switch in dot2: 1 = ON, 0 = OFF
var wing = 0;                   // Wing selection: 0 = Core, 1/2 = F-Wing

// Core faders
var fader7 = "1.1";             // Left SpecialMaster
var fader8 = "1.2";             // Right SpecialMaster
var fader7_val = 15872;         // Default value for left master
var fader8_val = 128;           // Default value for right master

// Use fader 8 as Grand Master in CORE (optional)
// fader8 = "2.1";
// fader8_val = 15872;

// Custom commands for buttons 1–11
var button_1_on = "";
var button_1_off = "";
var button_2_on = "";
var button_2_off = "";
...
🛠️ Extra Options
If you're using your SMC Mixer via Bluetooth, change the device name in the code

You can also:

Enable page switching

Change wing from Core to F-Wing 1 or 2

Add your own commands that should trigger specific bottom buttons

🚦Automation Features
🔄 Encoders:
DIM

PAN

TILT

SpeedMaster 1

SpeedMaster 2

SpeedMaster 3

SpeedMaster 4

GrandMaster

🎚️ Faders:
Control corresponding faders in the software

Buttons next to each fader trigger executors above and below the fader

💡 Button Feedback:
White = Executor is saved

Red = Executor is running

Blue/Yellow = Executors above are active

🧭 In CORE mode:
Last two faders control Main Exec Master and Main Exec xFade

They do not update automatically (no feedback)

🟨 Button functions at the last fader:
Yellow = Pause

Blue = Go-

Red = Go+

White = B.O.

📌 Tip: If the LED above a fader is blinking, it means the fader position doesn’t match the expected feedback. Move the fader until the blinking stops — now it’s synced and can send commands. You can use globalFix ON or OFF as needed.
