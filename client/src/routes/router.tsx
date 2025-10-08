import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import EventBoard from "../pages/EventBoard";
import TaskListBoard from "../pages/TaskListBoard";
import StarredBoards from "../pages/StarredBoards";
import ClosedBoards from "../pages/ClosedBoards";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <SignUp />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <EventBoard />,
      },
      {
        path: "tasklist",
        element: <TaskListBoard />,
      },
      {
        path: "starboards",
        element: <StarredBoards />,
      },
      {
        path: "closeboards",
        element: <ClosedBoards />,
      },
    ],
  },
]);
