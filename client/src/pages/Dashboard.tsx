import { useEffect, useState } from "react";
import Navbar from "../layouts/Navbar";
import Sidebar from "../layouts/Sidebar";
import BoardFormModal from "../components/BoardFormModal";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  const [isModal, setIsModal] = useState(false);
  const [isSiderbar, setIsSiderbar] = useState(false);
  const onChangeToggle = (key: boolean) => {
    setIsModal(key);
  };
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setIsMobileView(window.innerWidth <= 576);
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);
  const onChangeSiderbar = (key: boolean) => {
    setIsSiderbar(key);
  };
  return (
    <div className="dashboard-container relative ">
      <header className="fixed top-0 left-0 right-0 z-30 ">
        <Navbar onChangeSiderbar={onChangeSiderbar} />
      </header>
      <main className="flex">
        <div className="fixed mt-12 z-40">
          <Sidebar
            onChangeSiderbar={onChangeSiderbar}
            isSiderbar={isSiderbar}
          />
        </div>
        <div
          className={`${isMobileView ? "" : "ml-60"} w-screen relative mt-12`}
        >
          <div className="absolute z-3 w-full">
            <BoardFormModal isModal={isModal} onChangeToggle={onChangeToggle} />
          </div>
          <div className="absolute z-0 ">
            <Outlet context={{ onChangeToggle }} />
          </div>
        </div>
      </main>
    </div>
  );
}
