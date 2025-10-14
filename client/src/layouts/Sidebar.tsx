import { useState, useEffect } from "react";
import { Star, SquareX, Settings, DoorClosed, X, Plus } from "lucide-react";
import { BarsOutlined } from "@ant-design/icons";
import HomeTrello from "../assets/HomeTrello.png";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { getAllBoard } from "../services/boardApi";
import type { Board } from "../utils/types";
import { confirmNotification } from "../utils/ConfirmNotification";
import Swal from "sweetalert2";

type Props = {
  onChangeSiderbar: (key: boolean) => void;
  isSiderbar: boolean;
  onChangModal?: (board: Board | null) => void;
};

export default function Sidebar({
  onChangeSiderbar,
  isSiderbar,
  onChangModal,
}: Props) {
  const navigate = useNavigate();
  const currentUserId = Number(localStorage.getItem("currentUserId"));
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const lastPath = location.pathname.split("/").pop();
  const show = isSiderbar;
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeButton, setActiveButton] = useState<string>(lastPath || "");
  const ListBoard = useSelector((data: RootState) => data.boardSlice.boards);
  const { id } = useParams();
  const ListBoards = ListBoard.filter((item) => item.is_close === false);

  useEffect(() => {
    const checkWidth = () => {
      setIsMobileView(window.innerWidth <= 576);
    };
    if (currentUserId) {
      dispatch(getAllBoard(currentUserId));
    }
    checkWidth();
    window.addEventListener("resize", checkWidth);
    setActiveButton(`/${lastPath}`);

    return () => window.removeEventListener("resize", checkWidth);
  }, [dispatch, id]);

  const handleActive = (buttonName: string) => {
    setActiveButton(buttonName);
    if (buttonName === "/dashboard") {
      navigate(`/dashboard`);
    } else {
      navigate(`/dashboard${buttonName}`);
    }
  };
  const signOut = async (key: string) => {
    const result = await confirmNotification(key);
    if (result) {
      localStorage.removeItem("currentUserId");
      navigate(`/login`);
      Swal.fire({
        title: key,
        text: `Your file has been deleted.`,
        icon: "success",
      });
    }
  };

  const sidebarContent = (
    <div className="w-full h-full bg-[#f8f9fa] flex flex-col">
      {show && (
        <div className=" w-100 flex items-center justify-between px-4 py-3 bg-[#f8f9fa]">
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
          isMobileView ? "w-100" : "w-60"
        } h-[calc(100vh-48px)] bg-[#f8f9fa] border-r border-gray-300 flex flex-col`}
      >
        <div className="py-10 pb-1 px-3">
          <div className="mb-3">
            <p className="mt-[40px] font-sans font-medium text-xs text-[#212529BF] leading-[14.4px] tracking-normal align-middle uppercase">
              YOUR WORKSPACES
            </p>

            <div className="space-y-0.5">
              <button
                onClick={() => handleActive("/eventboard")}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded font-medium cursor-pointer transition-all
                  ${
                    activeButton === "/eventboard"
                      ? "bg-blue-100 text-blue-700"
                      : "text-blue-600 hover:bg-gray-50"
                  }`}
              >
                <BarsOutlined className="text-gray-600 text-[16px]" />
                <span className="text-sm">Boards</span>
              </button>

              <button
                onClick={() => handleActive("/starboards")}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded font-medium cursor-pointer transition-all
                  ${
                    activeButton === "/starboards"
                      ? "bg-blue-100 text-blue-700"
                      : "text-blue-600 hover:bg-gray-50"
                  }`}
              >
                <Star className="w-4 h-4" />
                <span className="text-sm">Starred Boards</span>
              </button>

              <button
                onClick={() => handleActive("/closeboards")}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded font-medium cursor-pointer transition-all
                  ${
                    activeButton === "/closeboards"
                      ? "bg-blue-100 text-blue-700"
                      : "text-blue-600 hover:bg-gray-50"
                  }`}
              >
                <SquareX className="w-4 h-4" />
                <span className="text-sm">Closed Boards</span>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 py-3 px-3 flex-1 overflow-y-auto">
          {id ? (
            <div>
              <div className="text-[#172B4D] font-semibold flex justify-between ">
                <h6 className=" text-[14px] leading-[24px] tracking-[-0.04px] align-middle">
                  Your boards
                </h6>
                <Plus
                  size={18}
                  onClick={() => {
                    onChangModal?.(null);
                  }}
                  className="cursor-pointer "
                />
              </div>
              {ListBoards && ListBoards.length > 0 ? (
                ListBoards.map((board: Board) => (
                  <button
                    key={board.id}
                    onClick={() =>
                      navigate(`/dashboard/eventboard/tasklist/${board.id}`)
                    }
                    className={`w-full flex items-center gap-2 px-2 py-1.5  ${
                      lastPath == board.id ? "bg-gray-200" : ""
                    } hover:bg-gray-300 rounded cursor-pointer transition-colors text-left`}
                  >
                    <div
                      className="w-8 h-6 rounded flex-shrink-0"
                      style={{
                        background:
                          board.type === "color"
                            ? board.backdrop
                            : `url(${board.backdrop}) center/cover no-repeat`,
                      }}
                    />
                    <span className="text-sm text-gray-700 truncate font-medium">
                      {board.title || "Untitled Board"}
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-xs text-gray-500 px-2 py-1 italic">
                  No boards yet
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-0.5">
              <button className="w-full flex items-center gap-2 px-2 py-1.5 text-blue-600 hover:bg-gray-50 rounded cursor-pointer">
                <Settings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </button>

              <button
                className="w-full flex items-center gap-2 px-2 py-1.5 text-blue-600 hover:bg-gray-50 rounded cursor-pointer"
                onClick={() => signOut("Sign Out")}
              >
                <DoorClosed className="w-4 h-4 " />
                <span className="text-sm">Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {!isMobileView && (
        <div className="w-60 h-[calc(100vh-48px)]">{sidebarContent}</div>
      )}
      {isMobileView && show && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
            onClick={() => onChangeSiderbar(false)}
          />
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
  );
}
