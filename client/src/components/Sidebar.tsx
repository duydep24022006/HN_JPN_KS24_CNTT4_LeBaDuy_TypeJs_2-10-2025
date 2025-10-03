import React from "react";
import { Star, SquareX, Settings, Menu, DoorClosed } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-60 h-[calc(100vh-64px)] bg-[#DEE2E6] border-r border-gray-300 flex flex-col">
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
  );
}
