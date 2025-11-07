import { Button } from "../../../ui/buttonLink";
import { ControllerButton } from "../buttons";
import { ControllerDial } from "../knobs";
import styles from "./styles.module.scss";

type RowColLayout = {
  type: "row" | "column";
  children: Layout[];
  flex?: number;
};

type ButtonDialLayout = {
  type: "button" | "dial";
  id: number | string;
  flex?: number;
};

export type Layout = RowColLayout | ButtonDialLayout;

export const Layout = ({
  name = "",
  editMode,
  onLayoutChange,
  layout,
  id,
  onClick,
}: {
  name?: string;
  editMode?: true;
  onLayoutChange?: React.Dispatch<React.SetStateAction<Layout>>;
  id: string;
  layout: Layout;
  onClick: (id: string) => void;
}) => {
  return (
    <div
      className={`${styles[layout.type]} ${editMode ? styles.editMode : "red"}`}
      style={{
        flex: layout.flex || undefined,
      }}
    >
      {editMode && (
        <>
          {(layout.type === "row" || layout.type === "column") && (
            <div className={styles.actions}>
              <Button
                onClick={() => {
                  onLayoutChange &&
                    onLayoutChange((state) => {
                      if (state.type === "row" || state.type === "column")
                        return {
                          ...state,
                          children: [
                            ...state.children,
                            {
                              type: state.type === "row" ? "column" : "row",
                              children: [],
                            },
                          ],
                        };

                      return state;
                    });
                }}
              >
                Add {layout.type === "row" ? "Col" : "Row"}
              </Button>
              <Button
                onClick={() => {
                  onLayoutChange &&
                    onLayoutChange((state) => {
                      if (state.type === "column" || state.type === "row") {
                        return {
                          ...state,
                          children: [
                            ...state.children,
                            {
                              type: "button",
                              id:
                                name !== ""
                                  ? `${name}_${layout.children.length}`
                                  : `${layout.children.length}`,
                            },
                          ],
                        };
                      }
                      return state;
                    });
                }}
              >
                Add Button
              </Button>
              <Button
                onClick={() => {
                  onLayoutChange &&
                    onLayoutChange((state) => {
                      if (state.type === "column" || state.type === "row") {
                        return {
                          ...state,
                          children: [
                            ...state.children,
                            {
                              type: "dial",
                              id:
                                name !== ""
                                  ? `${name}_${layout.children.length}`
                                  : `${layout.children.length}`,
                            },
                          ],
                        };
                      }
                      return state;
                    });
                }}
              >
                Add Dial
              </Button>
            </div>
          )}
        </>
      )}

      {(layout.type == "row" || layout.type === "column") &&
        layout.children.map((child, index) => (
          <Layout
            id={id}
            key={index}
            layout={child}
            name={name !== "" ? `${name}_${index}` : `${index}`}
            onClick={onClick}
            editMode={editMode}
            onLayoutChange={(payload) => {
              onLayoutChange &&
                onLayoutChange((state) => {
                  if (state.type === "row" || state.type === "column") {
                    const layout =
                      typeof payload === "function"
                        ? payload(state.children[index])
                        : payload;

                    state.children[index] = layout;
                    return {
                      ...state,
                      children: [...state.children],
                    };
                  }

                  return state;
                });
            }}
          />
        ))}

      {layout.type === "button" && (
        <ControllerButton id={`${id}_button_${layout.id}`} onClick={onClick} />
      )}

      {layout.type === "dial" && (
        <ControllerDial id={`${id}_dial_${layout.id}`} onClick={onClick} />
      )}
    </div>
  );
};
