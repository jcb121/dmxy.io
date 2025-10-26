import { New_GenericProfile } from "../../context/profiles";
import { animateRGB } from "../rgb";

export const animateRGBFade = (
  timeStamp: number,
  profiles: New_GenericProfile[],
  stepDuration: number,
  fade: number,
  fadeGap: number
) => {
  if (!profiles || profiles.length === 0) return;

  const gapTime = (stepDuration / 255) * fadeGap;
  const onTime = stepDuration - gapTime;
  const fadeTime = (onTime / 510) * fade; // 250
  const normalTime = stepDuration - gapTime - fadeTime - fadeTime;

  let currentColour: [number, number, number] | undefined = undefined;

  if (stepDuration) {
    const step = (timeStamp / stepDuration) % profiles.length;
    const frameIndex = Math.floor(step);

    const stepTime = (step - frameIndex) * stepDuration;

    if (stepTime < fadeTime) {
      const lastProfile =
        profiles[frameIndex - 1] || profiles[profiles.length - 1];

      currentColour = animateRGB(
        fadeGap
          ? [0, 0, 0]
          : [
              lastProfile.state.Red || 0,
              lastProfile.state.Green || 0,
              lastProfile.state.Blue || 0,
            ],
        [
          profiles[frameIndex].state.Red || 0,
          profiles[frameIndex].state.Green || 0,
          profiles[frameIndex].state.Blue || 0,
        ],
        fadeGap ? fadeTime : fadeTime * 2,
        fadeGap ? stepTime : stepTime + fadeTime
      );
    } else if (stepTime > stepDuration - gapTime) {
      // in the gap, the colour is black
      currentColour = [0, 0, 0];
    } else if (stepTime > normalTime + fadeTime) {
      const nextProfile = profiles[frameIndex + 1] || profiles[0];

      currentColour = animateRGB(
        [
          profiles[frameIndex].state.Red || 0,
          profiles[frameIndex].state.Green || 0,
          profiles[frameIndex].state.Blue || 0,
        ],
        fadeGap
          ? [0, 0, 0]
          : [
              nextProfile.state.Red || 0,
              nextProfile.state.Green || 0,
              nextProfile.state.Blue || 0,
            ],
        fadeGap ? fadeTime : fadeTime * 2,
        fadeGap
          ? stepTime - fadeTime - normalTime
          : stepTime - normalTime - fadeTime
      );
    } else {
      // console.log("normal");
    }
  }

  return currentColour;
};
