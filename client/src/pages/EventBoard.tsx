import { useEffect, useState } from "react";
import { Star, Menu, Calendar, Edit2, Trash } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { Board } from "../utils/types";
import { confirmNotification } from "../utils/ConfirmNotification";
import Swal from "sweetalert2";
import { BarsOutlined } from "@ant-design/icons";
type ContextType = {
  onChangeToggle?: (board: Board | null) => void;
};

export default function EventBoard() {
  const { onChangeToggle } = useOutletContext<ContextType>();
  const [isMobileView, setIsMobileView] = useState(false);
  const navigate = useNavigate();
  const TaskList = () => {
    navigate(`taskList`);
  };
  useEffect(() => {
    const checkWidth = () => {
      setIsMobileView(window.innerWidth <= 577);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);
  const confirm = async (key: string) => {
    const result = await confirmNotification(key);
    if (result) {
      Swal.fire({
        title: key,
        text: `Your file has been deleted.${key}`,
        icon: "success",
      });
    }
  };
  const [boards] = useState([
    {
      id: 1,
      title: "Board Title 01",
      backdrop:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Board Title 02",
      backdrop:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "Board Title 03",
      backdrop:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      title: "Board Title 01",
      backdrop:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=300&fit=crop",
    },
  ]);

  const [starredBoards] = useState([
    {
      id: 1,
      title: "Important Board 01",
      backdrop:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Important Board 02",
      backdrop:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=300&fit=crop",
    },
  ]);

  return (
    <div className=" min-h-[calc(100vh-64px)] bg-white ">
      <div className="h-[calc(100vh-240px)] p-6">
        <div className="flex items-center justify-between mb-6 pb-1 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <BarsOutlined className="text-gray-600 text-[32px]" />
            <h2 className="text-lg font-normal text-gray-900">
              Your Workspaces
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border-0 ">
              <button className="px-3 py-1 border border-gray-300 !rounded-[4px] !rounded-r-[0px] text-xs text-gray-700 hover:!bg-gray-100 flex items-center gap-1.5">
                Share
              </button>
              <button className="px-3 py-1 border border-gray-300 !rounded-[4px] !rounded-l-[0px]  text-xs text-gray-700 hover:!bg-gray-100 flex items-center gap-1.5">
                Export
              </button>
            </div>

            <button className="px-3 py-1 border border-gray-300 rounded text-xs text-gray-700 hover:!bg-gray-100 flex items-center gap-1.5">
              <Calendar size={12} />
              this week
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 ">
          {boards.map((board) => (
            <div
              key={board.id}
              className={`relative rounded-[5px] overflow-hidden group cursor-pointer ${
                isMobileView ? " w-[240px]" : "w-[270px]"
              } h-[130px]`}
            >
              <img
                src={board.backdrop}
                alt={board.title}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all z-0"></div>

              <div className="absolute top-2.5 left-3 z-2" onClick={TaskList}>
                <p className="text-white font-medium text-[18.5px]">
                  {board.title}
                </p>
              </div>
              <div>
                <div
                  className="absolute bottom-2.5 left-3 opacity-0 group-hover:!opacity-100 transition-opacity z-2"
                  onClick={() => onChangeToggle?.(board)}
                >
                  <button className="flex items-center gap-1 text-white text-xs bg-[#2C3E5D] px-2 py-1 rounded">
                    <Edit2 size={12} />
                    Edit this board
                  </button>
                </div>
                <div
                  className="absolute bottom-2.5 right-3 opacity-0 group-hover:!opacity-100 transition-opacity z-2"
                  onClick={() => confirm("delete")}
                >
                  <button className="flex items-center gap-1 text-white text-xs bg-red-500 px-2 py-1 rounded">
                    <Trash size={12} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div
            className={`mb-10 ${
              isMobileView ? " w-[240px]" : "w-[270px]"
            } h-[130px] bg-gray-200 rounded-[5px] flex justify-center items-center `}
            onClick={() => {
              onChangeToggle?.(null);
            }}
          >
            <button className="px-4 py-2 bg-gray-50 border border-gray-300 text-gray-700 rounded text-sm hover:!bg-gray-100 transition-colors">
              Create new board
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
            <Star size={32} className="text-gray-700" />
            <h2 className="text-lg font-normal text-gray-900">
              Starred Boards
            </h2>
          </div>

          <div className="flex flex-wrap gap-4 mb-6 pb-15">
            {starredBoards.map((board) => (
              <div
                key={board.id}
                className={`relative rounded-[5px] overflow-hidden group cursor-pointer ${
                  isMobileView ? " w-[240px]" : "w-[270px]"
                } h-[130px]`}
              >
                <img
                  src={board.backdrop}
                  alt={board.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all z-0"></div>

                <div className="absolute top-2.5 left-3 z-2">
                  <p
                    className="text-white font-medium text-[18.5px]"
                    onClick={() => confirm("delete")}
                  >
                    {board.title}
                  </p>
                </div>

                <div
                  className="absolute bottom-2.5 left-3 opacity-0 group-hover:!opacity-100 transition-opacity z-2"
                  onClick={() => onChangeToggle?.(board)}
                >
                  <button className="flex items-center gap-1 text-white text-xs bg-[#2C3E5D] px-2 py-1 rounded">
                    <Edit2 size={12} />
                    Edit this board
                  </button>
                </div>
                <div
                  className="absolute bottom-2.5 right-3 opacity-0 group-hover:!opacity-100 transition-opacity z-2"
                  onClick={() => confirm("delete")}
                >
                  <button className="flex items-center gap-1 text-white text-xs bg-red-500 px-2 py-1 rounded">
                    <Trash size={12} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
