import { ChannelSimpleFunction } from "../../context/fixtures";
import { New_GenericProfile } from "../../context/profiles";
import { animateRGB, decodeColour, encodeColour } from "../rgb";

const profileColour = (profile: New_GenericProfile): [number, number, number] =>
  decodeColour(profile.state.Colour ?? 0);

export const animateRGBFade = (
  timeStamp: number,
  profiles: New_GenericProfile[],
  stepDuration: number,
  fade: number,
  fadeGap: number
): number | undefined => {
  if (!profiles || profiles.length === 0) return undefined;

  const gapTime = (stepDuration / 255) * fadeGap;
  const onTime = stepDuration - gapTime;
  const fadeTime = (onTime / 510) * fade;
  const normalTime = stepDuration - gapTime - fadeTime - fadeTime;

  if (!stepDuration) return undefined;

  const step = (timeStamp / stepDuration) % profiles.length;
  const frameIndex = Math.floor(step);
  const stepTime = (step - frameIndex) * stepDuration;

  if (stepTime < fadeTime) {
    const lastProfile = profiles[frameIndex - 1] || profiles[profiles.length - 1];
    const from = fadeGap ? [0, 0, 0] as [number, number, number] : profileColour(lastProfile);
    const [r, g, b] = animateRGB(
      from,
      profileColour(profiles[frameIndex]),
      fadeGap ? fadeTime : fadeTime * 2,
      fadeGap ? stepTime : stepTime + fadeTime
    );
    return encodeColour(r, g, b);
  }

  if (stepTime > stepDuration - gapTime) {
    return encodeColour(0, 0, 0);
  }

  if (stepTime > normalTime + fadeTime) {
    const nextProfile = profiles[frameIndex + 1] || profiles[0];
    const to = fadeGap ? [0, 0, 0] as [number, number, number] : profileColour(nextProfile);
    const [r, g, b] = animateRGB(
      profileColour(profiles[frameIndex]),
      to,
      fadeGap ? fadeTime : fadeTime * 2,
      fadeGap ? stepTime - fadeTime - normalTime : stepTime - normalTime - fadeTime
    );
    return encodeColour(r, g, b);
  }

  return undefined;
};
