import { useEffect, useState } from "react";
import { Star, Calendar, Edit2, Trash } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { Board } from "../utils/types";
import { confirmNotification } from "../utils/ConfirmNotification";
import Swal from "sweetalert2";
import { BarsOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { deleteBoard, getAllBoard } from "../services/boardApi";

type ContextType = {
  onChangeToggle?: (board: Board | null) => void;
};

export default function EventBoard() {
  const { onChangeToggle } = useOutletContext<ContextType>();
  const currentUserId = Number(localStorage.getItem("currentUserId"));
  const dispatch = useDispatch<AppDispatch>();
  const ListBoards = useSelector((data: RootState) => data.boardSlice.boards);
  const [isMobileView, setIsMobileView] = useState(false);
  const navigate = useNavigate();
  const TaskList = (id: number | undefined) => {
    navigate(`tasklist/${id}`);
  };
  useEffect(() => {
    const checkWidth = () => {
      setIsMobileView(window.innerWidth <= 577);
    };
    if (currentUserId) {
      dispatch(getAllBoard(currentUserId));
    }
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, [dispatch, currentUserId]);

  const boards = ListBoards.filter(
    (item) => item.is_starred === false && item.is_close === false
  );
  const starredBoards = ListBoards.filter(
    (item) => item.is_starred === true && item.is_close === false
  );

  const confirm = async (key: string, boardId: number) => {
    try {
      const result = await confirmNotification(key);
      if (!result) return;
      await dispatch(deleteBoard(boardId)).unwrap();

      dispatch(getAllBoard(currentUserId));

      await Swal.fire({
        title: key,
        text: `Your board has been deleted successfully.`,
        icon: "success",
      });
    } catch (err) {
      console.error("Lỗi khi xóa board:", err);
      Swal.fire({
        title: "Error",
        text: "Something went wrong while deleting the board.",
        icon: "error",
      });
    }
  };

  return (
    <div className=" min-h-[calc(100vh-64px)] bg-white ">
      <div className="h-[calc(100vh-240px)] w-[calc(100vw-240px)] p-6">
        <div className="flex  items-center justify-between mb-6 pb-1 border-b border-gray-200">
          <div className="flex items-center gap-3 text-[#212529]">
            <BarsOutlined className=" text-[32px]" />
            <h2 className="text-lg font-normal ">Your Workspaces</h2>
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
              } h-[130px] hover:scale-105 transition-transform duration-300`}
            >
              {board.type === "image" ? (
                <img
                  src={board.backdrop}
                  alt={board.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={` w-full h-full object-cover `}
                  style={{ background: board.backdrop }}
                ></div>
              )}

              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all z-0"></div>
              <div
                className="absolute top-2.5 left-3 z-2"
                onClick={() => TaskList(board.id)}
              >
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
                <div className="absolute bottom-2.5 right-3 opacity-0 group-hover:!opacity-100 transition-opacity z-2">
                  <button
                    className="flex items-center gap-1 text-white text-xs bg-red-500 px-2 py-1 rounded"
                    onClick={() => confirm("delete", Number(board.id))}
                  >
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
                } h-[130px] hover:scale-105 transition-transform duration-300`}
              >
                {board.type === "image" ? (
                  <img
                    src={board.backdrop}
                    alt={board.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={` w-full h-full object-cover `}
                    style={{ background: board.backdrop }}
                  ></div>
                )}

                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all z-0"></div>

                <div
                  className="absolute top-2.5 left-3 z-2 "
                  onClick={() => TaskList(board.id)}
                >
                  <p className="text-white font-medium text-[18.5px]">
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
                  onClick={() => confirm("delete", Number(board.id))}
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
