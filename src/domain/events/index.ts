import { useActiveScene } from "../../context/active-scene";
import {
  CycleScene,
  MergeScene,
  SetBeatLength,
  SetChannelValue,
  SetScene,
  SetVar,
  useEvents,
  UserEvent,
} from "../../context/events";
import { GlobalTypes, useGlobals } from "../../context/globals";
import { MidiCallback, MidiEventTypes } from "../../context/midi";
import { useScenes } from "../../context/scenes";

export const handleEvent = (e: UserEvent, t: MidiEventTypes) => {
  if (e.function === MidiCallback.setBeatLength) {
    setBeatLength(e, t);
  } else if (e.function === MidiCallback.setScene) {
    setScene(e, t);
  } else if (e.function === MidiCallback.cycleScene) {
    cycleScene(e, t);
  } else if (e.function === MidiCallback.mergeScene) {
    mergeScene(e, t);
  } else if (e.function === MidiCallback.setVar) {
    setVar(e, t);
  } else if (e.function === MidiCallback.setChannelValue) {
    setChannelValue(e, t);
  }
};

const setChannelValue = (e: SetChannelValue, type: MidiEventTypes) => {
  if (type === MidiEventTypes.onPress || MidiEventTypes.onTurn) {
    if (type === MidiEventTypes.onTurn && e.functionId) {
      useEvents.getState().setButtonFuncs(e.functionId, e);
    }

    useGlobals.setState((state) => ({
      ...state,
      values: {
        ...state.values,
        [`${e.type}_${e.channel}`]: {
          type: GlobalTypes.byte,
          value: e.value,
        },
      },
    }));
  }
};

const mergeScene = (e: MergeScene, type: MidiEventTypes) => {
  const scene = useScenes.getState().scenes.find((s) => s.id === e.scene);

  if (!scene) return;

  // on press we always make the new scene

  if (type === MidiEventTypes.onPress) {
    useActiveScene.setState((state) => ({
      ...state,
      activeScenes: state.activeScenes
        ? [
            {
              ...state.activeScenes[0],
              vars: {
                ...state.activeScenes[0].vars,
                ...scene.vars,
              },
              new_profiles: {
                ...state.activeScenes[0].new_profiles,
                ...scene.new_profiles,
              },
            },
            ...state.activeScenes,
          ]
        : [scene],
    }));
  }

  if (type === MidiEventTypes.onRelease) {
    // do we need to do anything, we want to persist
  }

  if (type === MidiEventTypes.onHoldRelease) {
    useActiveScene.setState((state) => ({
      ...state,
      activeScenes: state.activeScenes
        ? state.activeScenes.filter((_s, index) => index !== 0)
        : [],
    }));
  }
};

const setVar = (e: SetVar, type: MidiEventTypes) => {
  if (!e.varName || typeof e.value === "undefined") return;
  if (type === MidiEventTypes.onPress || type === MidiEventTypes.onTurn) {
    if (type === MidiEventTypes.onTurn && e.functionId) {
      useEvents.getState().setButtonFuncs(e.functionId, e);
    }
    // sets scene
    useActiveScene.setState((state) => ({
      ...state,
      activeScenes: state.activeScenes.map((scene) => ({
        ...scene,
        vars: {
          ...scene.vars,
          [e.varName]: {
            type: GlobalTypes.byte,
            value: e.value,
          },
        },
      })),
    }));

    // sets globals
    useGlobals.setState((state) => ({
      ...state,
      values: {
        ...state.values,
        [e.varName]: {
          type: GlobalTypes.byte,
          value: e.value,
        },
      },
    }));
  }
};

const cycleScene = (e: CycleScene, type: MidiEventTypes) =>
  type === MidiEventTypes.onPress &&
  useGlobals.setState((state) => {
    const sceneAnimationIndex = `_${e.cycleName}_sceneAnimationIndexKey`;
    const sAIVar = state.values[sceneAnimationIndex];
    const sceneIndex =
      sAIVar !== undefined && sAIVar.type === GlobalTypes.byte
        ? sAIVar.value
        : -1;
    const nextSceneIndex = e.scenes[sceneIndex + 1] ? sceneIndex + 1 : 0;

    const { scenes } = useScenes.getState();
    const activeScene = scenes.find((s) => s.id === e.scenes[nextSceneIndex]);

    activeScene &&
      useActiveScene.setState({
        activeScenes: [activeScene],
      });

    return {
      ...state,
      values: {
        ...state.values,
        [sceneAnimationIndex]: {
          value: nextSceneIndex,
          type: GlobalTypes.byte,
        },
      },
    };
  });

let lastClickTime: number | undefined;
let lastClickTimeout: number | undefined;

const setBeatLength = (e: SetBeatLength, type: MidiEventTypes) => {
  if (type !== MidiEventTypes.onPress) return;
  lastClickTimeout && clearTimeout(lastClickTimeout);
  if (lastClickTime && e.timeStamp) {
    const seconds = e.timeStamp - lastClickTime;
    // sets globals
    useGlobals.setState((state) => ({
      ...state,
      values: {
        ...state.values,
        Beatlength: {
          type: GlobalTypes.time,
          value: Math.round(seconds),
        },
      },
    }));

    // sets scene
    useActiveScene.setState((state) => ({
      ...state,
      activeScenes: state.activeScenes.map((scene) => ({
        ...scene,
        vars: {
          ...scene.vars,
          ["Beatlength"]: {
            type: GlobalTypes.time,
            value: Math.round(seconds),
          },
        },
      })),
    }));
  }
  lastClickTime = e.timeStamp;
  lastClickTimeout = setTimeout(() => {
    lastClickTime = undefined;
  }, 5000);
};

const setScene = (e: SetScene, type: MidiEventTypes) => {
  const { scenes } = useScenes.getState();
  const activeScene = scenes.find((s) => s.id === e.sceneId);
  if (!activeScene) return;

  if (type === MidiEventTypes.onHoldRelease) {
    useActiveScene.setState((state) => {
      return {
        ...state,
        activeScenes: [...state.activeScenes.filter((s) => s.id !== e.sceneId)],
      };
    });
  }

  if (type === MidiEventTypes.onPress) {
    useActiveScene.setState((state) => {
      return {
        ...state,
        activeScenes: [activeScene, ...state.activeScenes],
      };
    });
  }
};
