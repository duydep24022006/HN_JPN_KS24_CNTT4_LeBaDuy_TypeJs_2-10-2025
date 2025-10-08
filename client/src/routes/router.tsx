import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import EventBoard from "../pages/EventBoard";
import StarredBoards from "../pages/StarredBoards";
import ClosedBoards from "../pages/ClosedBoards";
import TaskListBoard from "../pages/TaskListBoard";

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
        element: <Navigate to="eventboard" replace />,
      },
      {
        path: "eventboard",
        element: <EventBoard />,
      },
      {
        path: "eventboard/tasklist/:id",
        element: <TaskListBoard />,
      },
      {
        path: "starboards",
        element: <StarredBoards />,
      },
      {
        path: "starboards/tasklist/:id",
        element: <TaskListBoard />,
      },
      {
        path: "closeboards",
        element: <ClosedBoards />,
      },
      {
        path: "closeboards/tasklist/:id",
        element: <TaskListBoard />,
      },
    ],
  },
]);
