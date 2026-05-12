import { useEffect, useState } from "react";
import { Button } from "../../../ui/buttonLink";
import styles from "./styles.module.scss";
import { Controller, SAMPLE_CONTROLLER, TempController } from "../../../context/controllers";
import { Layout } from "../../../components/controller/layout/layout";

export const EditController = ({
  controller: _controller,
  onSave,
}: {
  controller?: TempController;
  onSave?: (c: Controller) => void;
}) => {
  const [controller, setController] = useState<Controller>(
    _controller ? JSON.parse(JSON.stringify(_controller)) : SAMPLE_CONTROLLER(),
  );
  useEffect(() => {
    setController(
      _controller
        ? JSON.parse(JSON.stringify(_controller))
        : SAMPLE_CONTROLLER(),
    );
  }, [_controller?.id]);

  return (
    <div>
      <div className={styles.head}>
        <input
          className={styles.name}
          placeholder="Controller Name"
          value={controller.name}
          onChange={(e) => {
            setController((state) => ({
              ...state,
              name: e.target.value,
            }));
          }}
        />
        <Button
          primary
          disabled={!controller.name}
          onClick={() => {
            onSave && onSave(controller)
          }}
        >
          {!_controller?.id ? "Save As" : "Save"}
        </Button>
      </div>

      <Layout
        id=""
        layout={controller.layout}
        onClick={() => {
          // does nothing
        }}
        editMode={true}
        onLayoutChange={(layout) => {
          setController((state) => ({
            ...state,
            layout,
          }));
        }}
      />
    </div>
  );
};
