import React, { useEffect, useState } from "react";

export const MidiContext = React.createContext<{}>({});

function listInputsAndOutputs(midiAccess: MIDIAccess) {
  for (const entry of midiAccess.inputs) {
    const input = entry[1];
    console.log(
      `Input port [type:'${input.type}']` +
        ` id:'${input.id}'` +
        ` manufacturer:'${input.manufacturer}'` +
        ` name:'${input.name}'` +
        ` version:'${input.version}'`
    );
    input.onmidimessage = (message) => {
      console.log(message, message.data);
    };
  }

  for (const entry of midiAccess.outputs) {
    const output = entry[1];
    console.log(
      `Output port [type:'${output.type}'] id:'${output.id}' manufacturer:'${output.manufacturer}' name:'${output.name}' version:'${output.version}'`
    );
  }
}

function onMIDISuccess(midiAccess: MIDIAccess) {
  console.log("MIDI ready!", midiAccess);
  listInputsAndOutputs(midiAccess);
  // midi = midiAccess; // store in the global (in real usage, would probably keep in an object instance)
}

function onMIDIFailure(msg: string) {
  console.error(`Failed to get MIDI access - ${msg}`);
}

export const MidiProvider = ({ children }: { children: React.ReactNode }) => {
  // const [MIDIInput, setMIDIInput] = useState<MIDIInput>();

  useEffect(() => {
    navigator.permissions
      .query({ name: "midi", sysex: true })
      .then((result) => {
        console.log(result);
        if (result.state === "granted") {
          // Access granted.
        } else if (result.state === "prompt") {
          // Using API will prompt for permission
        }
        // Permission was denied by user prompt or permission policy

        navigator.requestMIDIAccess().then((midiAccess: MIDIAccess) => {
          for (const entry of midiAccess.inputs) {
            const input = entry[1];
            console.log(
              `Input port [type:'${input.type}']` +
                ` id:'${input.id}'` +
                ` manufacturer:'${input.manufacturer}'` +
                ` name:'${input.name}'` +
                ` version:'${input.version}'`
            );

            input.addEventListener("midimessage", (e: Event) => {
              midiEvent(e);
              return;
            });
            // input.addEventListener('statechange', (f) => {
            //   console.log('s', f)
            //   // return;
            // })
          }
        }, onMIDIFailure);
      });
  }, []);

  const midiEvent = (e: Event) => {
    console.log("msg", e);
    const deviceID = e.currentTarget.id as string;
    const [type, controlID, value] = e.data;

    const myEvent = new Event("CustomMidiEvent");
    myEvent.data = {
      type,
      controlID,
      value,
      deviceID,
    };
    document.dispatchEvent(myEvent);
  };

  return <MidiContext.Provider value={{}}>{children}</MidiContext.Provider>;
};

export enum MidiEventTypes {
  onPress = 144,
  onRelease = 128,
  onTurn = 176,
}
