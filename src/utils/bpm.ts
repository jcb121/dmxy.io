export function msToBpm(msPerBeat: number): number {
  if (msPerBeat <= 0) {
    throw new Error("msPerBeat must be greater than zero");
  }
  return 60000 / msPerBeat;
}

export function bpmToMs(bpm: number): number {
  if (bpm <= 0) {
    throw new Error("BPM must be greater than zero");
  }
  return 60000 / bpm;
}