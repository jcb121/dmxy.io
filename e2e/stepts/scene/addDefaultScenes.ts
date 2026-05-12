import { Page } from "@playwright/test";
import { _createSceneProps } from "./_createScene";
import { createScenes } from "./ceateScene";

export const COLORS = {
  red: "#ff0000",
  blue: "#0000ff",
  green: "#00ff00",
  magenta: "#ff00ff",
};

function scene(
  sceneName: string,
  colors: string | string[],
  fade = 0,
  fadeGap = 0,
): _createSceneProps {
  const colorList = Array.isArray(colors) ? colors : [colors];
  const n = colorList.length;
  const rules =
    n === 1
      ? [
          {
            selector: "all",
            frames: [
              [
                { function: "Color" as const, value: colorList[0] },
                { function: "Intensity", value: 255 },
              ],
            ],
          },
        ]
      : [
          {
            selector: "odd",
            frames: colorList.map((color) => [
              { function: "Color" as const, value: color },
              { function: "Intensity", value: 255 },
            ]),
          },
          {
            selector: "even",
            frames: colorList.map((_, i) => [
              { function: "Color" as const, value: colorList[(i + 1) % n] },
              { function: "Intensity", value: 255 },
            ]),
          },
        ];
  return { sceneName, fade, fadeGap, rules };
}

const DEFAULT_SCENES: _createSceneProps[] = [
  scene("RED Fade 0 Gap 0", COLORS.red, 0, 0),
  scene("RED Fade 255 Gap 0", COLORS.red, 255, 0),
  scene("RED Fade 0 Gap 255", COLORS.red, 0, 255),
  scene("RED Fade 255 Gap 255", COLORS.red, 255, 255),
  scene("RED 2 BLUE Fade 0 Gap 0", [COLORS.red, COLORS.blue], 0, 0),
  scene("RED 2 BLUE Fade 255 Gap 0", [COLORS.red, COLORS.blue], 255, 0),
  scene("RED 2 BLUE Fade 0 Gap 255", [COLORS.red, COLORS.blue], 0, 255),
  scene("RED 2 BLUE Fade 255 Gap 255", [COLORS.red, COLORS.blue], 255, 255),
];

export const RGB_SCENES: _createSceneProps[] = [
  scene("RED Fade 0 Gap 0", COLORS.red, 0, 0),
  scene("GREEN Fade 0 Gap 0", COLORS.green, 0, 0),
  scene("BLUE Fade 0 Gap 0", COLORS.blue, 0, 0),
];



export const addDefaultScenes = async (page: Page) => {
  await createScenes(page, DEFAULT_SCENES);
};
