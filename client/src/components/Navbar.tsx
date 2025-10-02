import React, { useState } from "react";
import { Search, Menu } from "lucide-react";
import HomeTrello from "../assets/HomeTrello.png";
export default function Navbar() {
  const [isMobileView, setIsMobileView] = useState(false);

  React.useEffect(() => {
    const checkWidth = () => {
      setIsMobileView(window.innerWidth <= 576);
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  return (
    <div className="w-full h-12 bg-white border-b border-gray-300">
      <div className="flex items-center justify-between px-4 ">
        <div
          className={`flex items-center gap-4 border-r border-gray-300 h-12  ${
            isMobileView ? "min-w-28" : "min-w-54"
          }`}
        >
          <div className="flex items-center gap-2 pr-4 ">
            <img src={HomeTrello} alt="Logo" width={80} height={16.35} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isMobileView ? (
            <>
              <button className="p-1.5 hover:bg-gray-100 rounded">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded">
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            </>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
