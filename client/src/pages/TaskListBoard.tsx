import { useEffect, useState, useMemo } from "react";
import {
  Star,
  MoreHorizontal,
  Plus,
  ListFilter,
  X,
  TableProperties,
  SquareX,
  Check,
} from "lucide-react";
import Boards from "../assets/Board.svg";
import Delete from "../assets/Frame (6).svg";
import Button from "react-bootstrap/esm/Button";
import { confirmNotification } from "../utils/ConfirmNotification";
import Swal from "sweetalert2";
import FilterDropdown from "../components/FilterDropdown";
import { DatePickerModal } from "../components/DatePickerModal";
import FormTask from "../components/FormTask";
import MoveCard from "../components/MoveCard";
import Labels from "../components/Labels";
import LabelModal from "../components/LabelModal";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { useNavigate, useParams } from "react-router-dom";
import type { ErrorState, List, Tags, Task } from "../utils/types";
import {
  deleteList,
  edit_Board,
  editList,
  getAllTask,
  getBoardWithAllData,
  postList,
  postTask,
} from "../services/taskListApi";

export default function TaskListBoard() {
  const [isShowFormTask, setIsShowFormTask] = useState(false);
  const [isLabelModal, setIsLabelModal] = useState(false);
  const navigate = useNavigate();
  const [isLabels, setIsLabels] = useState(false);
  const [isMoveCard, setIsMoveCard] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [addingCardToList, setAddingCardToList] = useState<null | number>(null);
  const [addingNewList, setAddingNewList] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newListTitle, setNewListTitle] = useState("");
  const [editListTitle, setEditListTitle] = useState("");
  const [editingListId, setEditingListId] = useState<null | number>(null);
  const [isFilter, setIsFilter] = useState(false);
  const [showDate, setShowDate] = useState<boolean>(false);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editTag, setEditTag] = useState<Tags | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const boardState = useSelector((state: RootState) => state.listSlice);
  const board = boardState.board;

  const lists: List[] = board?.lists || [];

  const [error, setError] = useState<ErrorState>({
    listTitle: "",
    editTitle: "",
    taskTitle: "",
  });

  const allTasks = useMemo(() => {
    return lists.flatMap((list) => list.tasks || []);
  }, [lists]);

  const handleApplyFilter = (filtered: Task[]) => {
    setFilteredTasks(filtered);
    setIsFilterActive(filtered.length !== allTasks.length);
  };

  const resetAllInputs = () => {
    setEditingListId(null);
    setAddingCardToList(null);
    setAddingNewList(false);
    setNewTaskTitle("");
    setNewListTitle("");
    setEditListTitle("");
    setError({
      listTitle: "",
      editTitle: "",
      taskTitle: "",
    });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("input") && !target.closest("button")) {
        resetAllInputs();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const checkWidth = () => {
      setIsMobileView(window.innerWidth <= 576);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(getBoardWithAllData(Number(id)));
    }
  }, [dispatch, id]);

  const confirmDeleteList = async (key: string, listId: number) => {
    const result = await confirmNotification(key);
    if (result) {
      dispatch(deleteList(listId))
        .unwrap()
        .then(() => {
          dispatch(getBoardWithAllData(Number(id)));
        })
        .catch((err) => console.error("Lỗi khi xóa list:", err));
      Swal.fire({
        title: key,
        text: `Your file has been deleted.`,
        icon: "success",
      });
    }
  };

  const newListSubmit = () => {
    if (!newListTitle.trim()) {
      setError((prev) => ({ ...prev, listTitle: "Không được bỏ trống" }));
      return;
    }

    const newlist: List = {
      id: Number(
        `${Date.now().toString().slice(-4)}${Math.floor(
          1000 + Math.random() * 9000
        )}`
      ),
      title: newListTitle,
      boardId: Number(id),
      created_at: new Date().toISOString(),
    };
    dispatch(postList(newlist));
    resetAllInputs();
  };

  const newTaskSubmit = (id: number) => {
    if (!newTaskTitle.trim()) {
      setError((prev) => ({ ...prev, taskTitle: "Không được bỏ trống" }));
      return;
    }

    const newlist: Task = {
      id: Number(
        `${Date.now().toString().slice(-4)}${Math.floor(
          1000 + Math.random() * 9000
        )}`
      ),
      listId: Number(id),
      title: newTaskTitle,
      due_date: "",
      description: "",
      status: false,
      created_at: new Date().toISOString(),
      tags: [],
    };
    dispatch(postTask(newlist));
    resetAllInputs();
  };

  const editListSubmit = (list: List) => {
    if (!editListTitle.trim()) {
      setError((prev) => ({ ...prev, editTitle: "Không được bỏ trống" }));
      return;
    }

    const editlist = {
      id: list.id,
      title: editListTitle,
    };
    dispatch(editList(editlist));
    resetAllInputs();
  };

  const handleOpenFormTask = async (list: List, task: Task) => {
    try {
      const res = await dispatch(getAllTask(Number(task.id))).unwrap();
      setSelectedTask(res);
      setIsShowFormTask(true);
      setSelectedList(list);
    } catch (err) {
      console.error("Lỗi khi lấy task:", err);
    }
  };

  const onChangeToggleStar = async () => {
    if (!board) return;

    const editBoard = {
      id: board.id,
      is_starred: !board.is_starred,
    };

    try {
      await dispatch(edit_Board(editBoard)).unwrap();
      dispatch(getBoardWithAllData(Number(id)));
    } catch (error) {
      console.error("Lỗi khi cập nhật star:", error);
    }
    resetAllInputs();
  };

  const confirmCloseBoard = async (key: string) => {
    const result = await confirmNotification(key);
    if (result) {
      const closeBoard = {
        id,
        is_close: true,
      };
      dispatch(edit_Board(closeBoard))
        .unwrap()
        .then(() => {
          navigate("/dashboard/eventboard");
        })
        .catch((err) => console.error("Lỗi khi đóng board:", err));
      Swal.fire({
        title: key,
        text: `Board has been closed.`,
        icon: "success",
      });
    }
  };

  const getDisplayTasks = (list: List) => {
    if (!isFilterActive) {
      return list.tasks || [];
    }
    return (list.tasks || []).filter((task) =>
      filteredTasks.some((ft) => ft.id === task.id)
    );
  };

  return (
    <div className="h-full !w-[100%] flex flex-col bg-white overflow-hidden">
      <div
        className={`fixed top-[48px] ${
          isMobileView ? "left-0" : "left-60 "
        } right-0 z-10 h-17 pt-3 border-b border-gray-200 bg-[#f8f9fa] flex items-center justify-between px-6`}
      >
        <div className="flex gap-6">
          <div className="flex items-center gap-6">
            <h2 className="text-base font-semibold text-[#172B4D]">
              {board?.title}
            </h2>
            <button
              className="text-gray-600 hover:bg-gray-100 p-1 rounded"
              onClick={onChangeToggleStar}
            >
              <Star
                size={16}
                color={board?.is_starred ? "#FFD700" : "gray"}
                fill={board?.is_starred ? "#FFD700" : "none"}
              />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="!flex items-center justify-center gap-1.5 w-[85px] h-8 text-xs font-medium"
              onClick={() => navigate("/dashboard/eventboard")}
            >
              <img src={Boards} alt="" />
              Board
            </Button>

            <button className="px-2.5 py-1 hover:bg-gray-100 text-[#172B4D] rounded text-xs flex items-center gap-1.5 font-medium">
              <TableProperties
                size={16}
                style={{ transform: "rotate(180deg)" }}
              />
              Table
            </button>

            <button
              className="px-2.5 py-1 hover:bg-gray-100 text-[#172B4D] rounded text-xs flex items-center gap-1.5 font-medium"
              onClick={() => confirmCloseBoard("close")}
            >
              <SquareX size={16} />
              Close this board
            </button>
          </div>
        </div>

        <div>
          <button
            className={`px-2.5 py-1 hover:bg-gray-100 text-[#172B4D] rounded text-xs flex items-center gap-1.5 font-medium ${
              isFilterActive ? "bg-blue-100" : ""
            }`}
            onClick={() => setIsFilter(true)}
          >
            <ListFilter size={16} />
            Filters {isFilterActive && `(${filteredTasks.length})`}
          </button>
        </div>
      </div>

      <div className="overflow-auto mt-20 p-4 flex flex-wrap gap-2 items-start">
        {lists.map((list: List) => {
          const displayTasks = getDisplayTasks(list);

          return (
            <div
              key={list.id}
              className="bg-gray-100 w-[272px] rounded-lg p-2 flex-shrink-0"
            >
              <div className="flex items-center justify-between mb-2 px-1">
                {editingListId === list.id ? (
                  <div>
                    <input
                      type="text"
                      value={editListTitle}
                      onChange={(e) => setEditListTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") editListSubmit(list);
                        if (e.key === "Escape") resetAllInputs();
                      }}
                      autoFocus
                      className="bg-white flex-1 w-[219px] px-2 py-1 text-sm font-semibold text-[#172B4D] border border-blue-500 rounded focus:outline-none"
                    />
                    {error.editTitle && (
                      <p className="text-red-500">{error.editTitle}</p>
                    )}
                  </div>
                ) : (
                  <>
                    <h6 className="font-semibold text-[#172B4D] text-sm cursor-pointer ">
                      {list.title}
                    </h6>
                    <button
                      className="text-gray-600 hover:bg-gray-200 p-0.5 rounded"
                      onClick={() => {
                        setEditListTitle(list.title);
                        setEditingListId(list.id);
                      }}
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </>
                )}
              </div>

              {displayTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded shadow-sm p-2 mb-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    handleOpenFormTask(list, task);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {task.status && (
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                    <span className="text-sm text-gray-800">{task.title}</span>
                  </div>
                </div>
              ))}

              {addingCardToList === list.id ? (
                <div className="w-full space-y-2">
                  <div>
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Enter a title or paste a link"
                      className="bg-white w-full h-[56px] mb-2 px-2 py-1.5 shadow-[inset_0_0_0_1px_#8590A2] text-sm rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                    {error.taskTitle && (
                      <p className="text-red-500">{error.taskTitle}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      onClick={() => newTaskSubmit(list.id)}
                    >
                      Add card
                    </button>
                    <button
                      onClick={resetAllInputs}
                      className="p-1.5 hover:bg-gray-200 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => {
                      resetAllInputs();
                      setAddingCardToList(list.id);
                    }}
                    className=" text-left px-2 py-1.5 text-gray-700 hover:bg-gray-200 rounded text-sm flex items-center gap-1.5"
                  >
                    <Plus size={14} />
                    <span className="font-medium text-[14px] text-[#44546F] leading-[20px] tracking-[0px] text-center">
                      Add a card
                    </span>
                  </button>
                  <img
                    src={Delete}
                    alt=""
                    width={16}
                    height={16}
                    onClick={() => confirmDeleteList("delete", list.id)}
                    className="cursor-pointer "
                  />
                </div>
              )}
            </div>
          );
        })}

        <div className="bg-gray-100 rounded-lg p-2 w-64 flex-shrink-0">
          {addingNewList ? (
            <div className="space-y-2">
              <div>
                <input
                  type="text"
                  value={newListTitle}
                  onChange={(e) => {
                    setNewListTitle(e.target.value);
                    setError({
                      listTitle: "",
                      editTitle: "",
                      taskTitle: "",
                    });
                  }}
                  placeholder="Enter list name..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") newListSubmit();
                    if (e.key === "Escape") resetAllInputs();
                  }}
                  className="bg-white w-full px-2 mb-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
                {error.listTitle && (
                  <p className="text-red-500">{error.listTitle}</p>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  onClick={() => {
                    newListSubmit();
                  }}
                >
                  Add list
                </button>
                <button
                  onClick={() => {
                    resetAllInputs();
                  }}
                  className="p-1.5 hover:bg-gray-200 rounded"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                resetAllInputs();
                setAddingNewList(true);
              }}
              className="w-full text-left px-2 py-1.5 text-[#172B4D] hover:bg-gray-200 rounded text-sm flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span className="font-medium text-[14px]">Add another list</span>
            </button>
          )}
        </div>
      </div>

      <FilterDropdown
        onClose={() => setIsFilter(false)}
        isFilter={isFilter}
        tasks={allTasks}
        onApplyFilter={handleApplyFilter}
      />
      <DatePickerModal
        isOpen={showDate}
        onClose={() => setShowDate(false)}
        setCurrentTask={setSelectedTask}
        currentTask={selectedTask}
      />
      <FormTask
        isShowFormTask={isShowFormTask}
        onClose={() => setIsShowFormTask(false)}
        onShowDate={() => setShowDate(true)}
        onShowMoveCard={() => setIsMoveCard(true)}
        onShowLabel={() => setIsLabels(true)}
        setCurrentTask={setSelectedTask}
        currentList={selectedList}
        currentTask={selectedTask}
      />
      <MoveCard
        isMoveCard={isMoveCard}
        onClose={() => setIsMoveCard(false)}
        lists={lists}
        currentList={selectedList}
        currentTask={selectedTask}
        setSelectedList={setSelectedList}
        setSelectedTask={setSelectedTask}
        titleBoard={board?.title}
      />
      <Labels
        isOpenModal={isLabels}
        setCurrentTask={setSelectedTask}
        currentTask={selectedTask}
        onClose={() => setIsLabels(false)}
        onShowLabelModal={() => setIsLabelModal(true)}
        setEditTag={setEditTag}
      />
      <LabelModal
        setCurrentTask={setSelectedTask}
        currentTask={selectedTask}
        isOpen={isLabelModal}
        onClose={() => setIsLabelModal(false)}
        editTag={editTag}
      />
    </div>
  );
}
