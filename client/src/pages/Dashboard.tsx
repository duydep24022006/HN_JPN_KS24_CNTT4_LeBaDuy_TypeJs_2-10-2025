import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import EventBoard from "./EventBoard";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <header>
        <Navbar />
      </header>
      <main className="flex">
        <div>
          <Sidebar />
        </div>
        <div className="w-screen ">
          <EventBoard />
        </div>
      </main>
    </div>
  );
}
