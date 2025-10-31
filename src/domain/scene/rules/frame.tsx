import { ChannelSimpleFunction } from "../../../context/fixtures";
import { New_GenericProfile } from "../../../context/profiles";
import { rgbToHex } from "../../../utils/rgb";

const RGB = [
  ChannelSimpleFunction.red,
  ChannelSimpleFunction.green,
  ChannelSimpleFunction.blue,
];

export const SceneFrames = ({ scene }: { scene: New_GenericProfile[] }) => {
  const tableKeys = [
    ...scene.reduce((tableKeys, s) => {
      for (const key in s.state) {
        tableKeys.add(key as ChannelSimpleFunction);
      }
      return tableKeys;
    }, new Set<ChannelSimpleFunction>()),
  ];

  const isRGB = RGB.every((func) => {
    return tableKeys.find((key) => key === func);
  });

  return (
    <table>
      <tbody>
        {isRGB && (
          <tr>
            <th>Color</th>

            {scene.map((s, index) => (
              <td key={index}>
                <input
                  readOnly={true}
                  type="color"
                  value={`#${rgbToHex([
                    s.state.Red!,
                    s.state.Green!,
                    s.state.Blue!,
                  ])}`}
                />
              </td>
            ))}
          </tr>
        )}
        {tableKeys.map((key) => {
          if (isRGB && RGB.includes(key)) {
            return null;
          }

          return (
            <tr key={key}>
              <th>{key}</th>
              {scene.map((s, index) => (
                <td key={`${index}-${key}`}>{s.state[key]}</td>
              ))}
            </tr>
          );
        })}
        <tr>
          <th>Function</th>
          {scene.map((s, index) => (
            <td key={`${s.targetFunction}-${index}`}>{s.targetFunction}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};
