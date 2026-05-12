import ReactDOM from "react-dom/client";
import { BasicPage } from "../ui/layout/basic-page";
import "../index.css";
import { ListWithAction } from "../ui/list-with-actions";
import { useControllers } from "../context/controllers";

import { z } from "zod";
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { EditController } from "../domain/controller/edit";
import { Button } from "../components/button";

const Controllers = () => {
  const { controllerId } = useSearch({ from: "/controllers.html" });
  const navigate = useNavigate({ from: "/controllers.html" });
  const controllers = useControllers((state) => state.controllers);

  return (
    <BasicPage
      back="/"
      header={<h2>Controllers</h2>}
      left={
        <>
          <Button
            onClick={() => {
              navigate({
                search: (prev) => {
                  return { ...prev, controllerId: undefined };
                },
              });
            }}
          >
            New Controller
          </Button>
          <ListWithAction
            items={controllers.map((d) => ({
              name: d.name,
              id: d.id,
            }))}
            onClick={(e) => {
              navigate({
                search: (prev) => ({ ...prev, controllerId: e.id }),
              });
            }}
            actions={[
              {
                name: "delete",
                onClick: (c) => {
                  useControllers.setState((state) => {
                    return {
                      ...state,
                      controllers: controllers.filter(
                        (controller) => controller.id !== c.id,
                      ),
                    };
                  });
                },
              },
            ]}
          />
        </>
      }
    >
      <EditController
        controller={controllers.find((c) => c.id === controllerId)}
        onSave={(c) => {
          if (!c.id) {
            const id = crypto.randomUUID();

            useControllers.setState((state) => {
              return {
                ...state,
                controllers: [
                  ...state.controllers,
                  {
                    ...c,
                    id,
                  },
                ],
              };
            });
            navigate({
              search: (prev) => ({ ...prev, controllerId: id }),
            });
          } else {
            useControllers.setState((state) => {
              return {
                ...state,
                controllers: state.controllers.map((controller) =>
                  controller.id === c.id ? c : controller,
                ),
              };
            });
          }

          // id needed here...ID is the issue...
        }}
      />
    </BasicPage>
  );
};

const itemSearchSchema = z.object({
  controllerId: z.string().optional(),
});

export const rootRoute = createRootRoute();

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/controllers.html",
  validateSearch: (search) => itemSearchSchema.parse(search), // Validation!
  component: Controllers,
});

const routeTree = rootRoute.addChildren([indexRoute]);
export const router = createRouter({ routeTree });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
