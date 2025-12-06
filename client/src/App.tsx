import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { Layout } from "./components/LayoutComponents/Layout.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute";
import type React from "react";

interface RouteCommon {
  ErrorBoundary?: React.ComponentType<any>;
}

interface IRoute extends RouteCommon {
  path: string;
  Element: React.ComponentType<any>;
}

interface Pages {
  [key: string]: {
    default: React.ComponentType<any>;
  } & RouteCommon;
}

const pages: Pages = import.meta.glob("./pages/**/*.tsx", { eager: true });

const routes: IRoute[] = [];
for (const path of Object.keys(pages)) {
  const fileName = path.match(/\.\/pages\/(.*)\.tsx$/)?.[1];
  if (!fileName) continue;

  const normalizedPathName = fileName.includes("$")
    ? fileName.replace("$", ":")
    : fileName.replace(/\/index/, "");

  routes.push({
    path: fileName === "index" ? "/" : `/${normalizedPathName.toLowerCase()}`,
    Element: pages[path].default,
    ErrorBoundary: pages[path]?.ErrorBoundary,
  });
}

// Wrap routes in the Protected Route Component
function wrapRoute(route: IRoute) {
  const { Element, ErrorBoundary, path } = route;
  const lower = path.toLowerCase();

  let element: React.ReactElement = <Element />;

  if (lower.startsWith("/manager")) {
    element = (
      <ProtectedRoute allowedRoles={["manager"]}>
        <Element />
      </ProtectedRoute>
    );
  } else if (lower.startsWith("/cashier")) {
    element = (
      <ProtectedRoute allowedRoles={["cashier", "manager"]}>
        <Element />
      </ProtectedRoute>
    );
  } else if (lower.startsWith("/customer")) {
    if(lower.endsWith("/profile")){
      element = (
        <ProtectedRoute allowedRoles={["customer"]}>
          <Element />
        </ProtectedRoute>
      );
    } else {
      element = (
        <ProtectedRoute allowedRoles={["guest", "customer", "cashier", "manager"]}>
          <Element />
        </ProtectedRoute>
      );
    }
  }

  return {
    path,
    element,
    ...(ErrorBoundary && { errorElement: <ErrorBoundary /> }),
  };
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/any/home" replace />,
      },
      ...routes.map(wrapRoute),
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;

