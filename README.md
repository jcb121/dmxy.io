# dmxy.io

Named from the DMX protocol used to control lights and devices on stages, see https://en.wikipedia.org/wiki/DMX512

This project started out as a tool to generate QLC+ save files, but it has become a full suite in itself. see https://www.qlcplus.org/

## Demo

https://dmxy-949e1.web.app/

## Technology

Dmxy.io run completely in the browser and uses modern web APIs to communicate with lights.

* Web Midi API - https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API
  Used for reading the state of Midi devices like the AKAI LPD8
* Web Serial API - https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API
  Used for sending the DMX messages to devices
* Vite with React + TS - https://vite.dev/
* Zustand for state management
* Firebase for hosting and data storage