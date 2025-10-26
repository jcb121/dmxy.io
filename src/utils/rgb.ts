export const animateRGB = (
  [aR, aG, aB]: [number, number, number],
  [bR, bG, bB]: [number, number, number],
  duration: number,
  time: number
): [number, number, number] => {
  const rDiff = bR - aR;
  const gDiff = bG - aG;
  const bDiff = bB - aB;

  const distance = time / duration;

  const r = Math.round(aR + rDiff * distance);
  const g = Math.round(aG + gDiff * distance);
  const b = Math.round(aB + bDiff * distance);

  return [r, g, b];
};

export const animateColour = (
  startColour: string,
  endColour: string,
  duration: number,
  time: number
) => {
  const aR = parseInt(`${startColour[0]}${startColour[1]}`, 16);
  const aG = parseInt(`${startColour[2]}${startColour[3]}`, 16);
  const aB = parseInt(`${startColour[4]}${startColour[5]}`, 16);

  const bR = parseInt(`${endColour[0]}${endColour[1]}`, 16);
  const bG = parseInt(`${endColour[2]}${endColour[3]}`, 16);
  const bB = parseInt(`${endColour[4]}${endColour[5]}`, 16);

  const [r, g, b] = animateRGB([aR, aG, aB], [bR, bG, bB], duration, time);

  return `${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

export const getRGB = (colour: string): [number, number, number] => {
  const red = parseInt(`${colour[0]}${colour[1]}`, 16);
  const green = parseInt(`${colour[2]}${colour[3]}`, 16);
  const blue = parseInt(`${colour[4]}${colour[5]}`, 16);

  return [red, green, blue];
};

export const rgbToHex = ([r, g, b]: [number, number, number]) => {
  return `${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase();
};

export const isWhite = (a: string) => {
  return (
    `${a[0]}${a[1]}` === `${a[2]}${a[3]}` &&
    `${a[0]}${a[1]}` === `${a[4]}${a[5]}`
  );
};
