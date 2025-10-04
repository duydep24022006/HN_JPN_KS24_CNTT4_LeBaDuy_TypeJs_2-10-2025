import React, { useState, useEffect } from "react";
import { Star, SquareX, Settings, Menu, DoorClosed, X } from "lucide-react";
// import { useLocation } from "react-router-dom";
import HomeTrello from "../assets/HomeTrello.png";

type Props = {
  onChangeSiderbar: (key: boolean) => void;
  isSiderbar: boolean;
};

export default function Sidebar({ onChangeSiderbar, isSiderbar }: Props) {
  // const location = useLocation();
  // const isActive = (path: string) => location.pathname.includes(path);

  const show = isSiderbar;
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setIsMobileView(window.innerWidth <= 576); // <=576px là mobile
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const sidebarContent = (
    <div className="w-full h-full bg-[#f8f9fa] flex flex-col">
      {/* Mobile Header - Only show in mobile offcanvas */}
      {show && (
        <div className=" w-100  flex items-center justify-between px-4 py-3 bg-[#f8f9fa]">
          <img src={HomeTrello} alt="Logo" width={80} height={16.35} />
          <button
            onClick={() => onChangeSiderbar(false)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}

      <div
        className={`${
          isMobileView ? "w-100" : " w-60"
        } h-[calc(100vh-48px)] bg-[#f8f9fa] border-r border-gray-300 flex flex-col`}
      >
        <div className=" py-10 pb-1 px-3">
          <div className="mb-3">
            <p className="mt-[40px] font-sans font-medium text-xs text-[#212529BF] leading-[14.4px] tracking-normal align-middle uppercase">
              YOUR WORKSPACES
            </p>
            <div className="space-y-0.5">
              <button className="w-full flex items-center gap-2 px-2 py-1.5 text-blue-600 hover:bg-gray-50 rounded cursor-pointer font-medium">
                <Menu className="w-4 h-4" />
                <span className="text-sm">Boards</span>
              </button>

              <button className="w-full flex items-center gap-2 px-2 py-1.5 text-blue-600 hover:bg-gray-50 rounded cursor-pointer font-medium">
                <Star className="w-4 h-4" />
                <span className="text-sm">Starred Boards</span>
              </button>

              <button className="w-full flex items-center gap-2 px-2 py-1.5 text-blue-600 hover:bg-gray-50 rounded cursor-pointer font-medium">
                <SquareX className="w-4 h-4" />
                <span className="text-sm">Closed Boards</span>
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-300 py-3 px-3">
          <div className="space-y-0.5">
            <button className="w-full flex items-center gap-2 px-2 py-1.5 text-blue-600 hover:bg-gray-50 rounded cursor-pointer">
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </button>

            <button className="w-full flex items-center gap-2 px-2 py-1.5 text-blue-600 hover:bg-gray-50 rounded cursor-pointer">
              <DoorClosed className="w-4 h-4" />
              <span className="text-sm">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      {!isMobileView && (
        <div className="w-60 h-[calc(100vh-48px)] ">{sidebarContent}</div>
      )}

      {/* Mobile Button */}
      {isMobileView && (
        <>
          {show && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
                onClick={() => onChangeSiderbar(false)}
              />

              {/* Offcanvas */}
              <div
                className={`fixed top-0 right-0 bottom-0 w-[399px] max-w-full z-50 bg-[#f8f9fa] transform transition-transform duration-300 ease-in-out ${
                  show ? "translate-x-0" : "translate-x-full"
                }`}
              >
                {sidebarContent}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
