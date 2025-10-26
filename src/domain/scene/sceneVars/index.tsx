import { GlobalTypes, NewGlobalValues } from "../../../context/globals";
import { Scene } from "../../../context/scenes";
import { bpmToMs, msToBpm } from "../../../utils/bpm";

import styles from "./styles.module.scss";

export const SceneVars = ({
  vars,
  setScene,
}: {
  vars?: NewGlobalValues;
  setScene: React.Dispatch<React.SetStateAction<Scene>>;
}) => {
  return (
    <div>
      <h5>Vars</h5>
      <div className={styles.row}>
        <input
          type="checkbox"
          checked={!!vars?.["Beatlength"]?.value}
          onChange={(e) => {
            if (e.target.checked) {
              setScene((state) => {
                return {
                  ...state,
                  vars: {
                    ...state.vars,
                    ["Beatlength"]: {
                      type: GlobalTypes.time,
                      value: bpmToMs(100),
                    },
                  },
                };
              });
            } else {
              setScene((state) => {
                state.vars && delete state.vars["Beatlength"];
                return {
                  ...state,
                  vars: {
                    ...state.vars,
                  },
                };
              });
            }
          }}
        />

        <label>
          BPM{" "}
          <input
            value={
              vars?.["Beatlength"]?.value
                ? msToBpm(vars["Beatlength"].value as number)
                : 0
            }
            min={0}
            max={255}
            type="number"
            onChange={(e) => {
              setScene((state) => {
                return {
                  ...state,
                  vars: {
                    ...state.vars,
                    ["Beatlength"]: {
                      type: GlobalTypes.time,
                      value: bpmToMs(parseInt(e.target.value)),
                    },
                  },
                };
              });
            }}
          />
        </label>

        <input
          type="checkbox"
          checked={vars?.["Fade"]?.value !== undefined}
          onChange={(e) => {
            if (e.target.checked) {
              setScene((state) => {
                return {
                  ...state,
                  vars: {
                    ...state.vars,
                    ["Fade"]: {
                      type: GlobalTypes.byte,
                      value: 128,
                    },
                  },
                };
              });
            } else {
              setScene((state) => {
                state.vars && delete state.vars["Fade"];
                return {
                  ...state,
                  vars: {
                    ...state.vars,
                  },
                };
              });
            }
          }}
        />

        <label>
          Fade
          <input
            type="range"
            value={vars?.["Fade"]?.value || 0}
            min={0}
            max={255}
            onChange={(e) => {
              setScene((state) => {
                return {
                  ...state,
                  vars: {
                    ...state.vars,
                    ["Fade"]: {
                      type: GlobalTypes.byte,
                      value: parseInt(e.target.value),
                    },
                  },
                };
              });
            }}
          />
        </label>

        <input
          type="checkbox"
          checked={vars?.["FadeGap"]?.value !== undefined}
          onChange={(e) => {
            if (e.target.checked) {
              setScene((state) => {
                return {
                  ...state,
                  vars: {
                    ...state.vars,
                    ["FadeGap"]: {
                      type: GlobalTypes.byte,
                      value: 128,
                    },
                  },
                };
              });
            } else {
              setScene((state) => {
                state.vars && delete state.vars["FadeGap"];
                return {
                  ...state,
                  vars: {
                    ...state.vars,
                  },
                };
              });
            }
          }}
        />

        <label>
          FadeGap
          <input
            type="range"
            value={vars?.["FadeGap"]?.value || 0}
            min={0}
            max={255}
            onChange={(e) => {
              setScene((state) => {
                return {
                  ...state,
                  vars: {
                    ...state.vars,
                    ["FadeGap"]: {
                      type: GlobalTypes.byte,
                      value: parseInt(e.target.value),
                    },
                  },
                };
              });
            }}
          />
        </label>
      </div>
    </div>
  );
};
