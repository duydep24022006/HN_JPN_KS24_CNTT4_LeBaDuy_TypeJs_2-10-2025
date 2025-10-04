import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <div>
      <RouterProvider router={router} />
      <Toaster position="top-left" reverseOrder={false} />
    </div>
  );
}
