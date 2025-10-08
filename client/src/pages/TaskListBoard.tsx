import { useEffect, useState } from "react";
import {
  Star,
  MoreHorizontal,
  Plus,
  ListFilter,
  X,
  TableProperties,
  SquareX,
} from "lucide-react";
import Board from "../assets/Board.svg";
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
import { useParams } from "react-router-dom";
import type { List } from "../utils/types";
import {
  getBoardWithAllData,
  postList,
  postTask,
} from "../services/taskListApi";

export default function TaskListBoard() {
  const [isShowFormTask, setIsShowFormTask] = useState(false);
  const [isLabelModal, setIsLabelModal] = useState(false);
  const [isLabels, setIsLabels] = useState(false);
  const [isMoveCard, setIsMoveCard] = useState(false);

  const [addingCardToList, setAddingCardToList] = useState<null | number>(null);
  const [addingNewList, setAddingNewList] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newListTitle, setNewListTitle] = useState("");
  const [editListTitle, setEditListTitle] = useState("");
  const [editingListId, setEditingListId] = useState<null | number>(null);
  const [isFilter, setIsFilter] = useState(false);
  const [showDate, setShowDate] = useState<boolean>(false);
  const [error, setError] = useState({});
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

  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const boardState = useSelector((state: RootState) => state.listSlice);
  const board = boardState.board;
  const lists: List[] = board?.lists || [];

  useEffect(() => {
    if (id) {
      dispatch(getBoardWithAllData(Number(id)));
    }
  }, [dispatch, id]);

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
      tasks: [],
    };
    dispatch(postList(newlist));
    setNewListTitle("");
    setAddingNewList(false);
  };

  return (
    <div className="h-screen !w-[100%] flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="fixed top-[48px] left-60 right-0 z-10 h-17 pt-3 border-b border-gray-200 bg-[#f1f2f4] flex items-center justify-between px-6">
        <div className="flex gap-6">
          <div className="flex items-center gap-6">
            <h2 className="text-base font-semibold text-[#172B4D]">
              {board?.title}
            </h2>
            <button className="text-gray-600 hover:bg-gray-100 p-1 rounded">
              <Star size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="!flex items-center justify-center gap-1.5 w-[85px] h-8 text-xs font-medium"
            >
              <img src={Board} alt="" />
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
              onClick={() => confirm("close")}
            >
              <SquareX size={16} />
              Close this board
            </button>
          </div>
        </div>

        <div>
          <button
            className="px-2.5 py-1 hover:bg-gray-100 text-[#172B4D] rounded text-xs flex items-center gap-1.5 font-medium"
            onClick={() => setIsFilter(true)}
          >
            <ListFilter size={16} />
            Filters
          </button>
        </div>
      </div>

      {/* Lists */}
      <div className="overflow-auto mt-20 p-4 flex flex-wrap gap-2 items-start">
        {lists.map((list: List) => (
          <div
            key={list.id}
            className="bg-gray-100 w-[272px] rounded-lg p-2 flex-shrink-0"
          >
            <div className="flex items-center justify-between mb-2 px-1">
              {editingListId === list.id ? (
                <input
                  type="text"
                  defaultValue={list.title}
                  value={editListTitle}
                  onChange={(e) => setEditListTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Escape") {
                      resetAllInputs();
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                  className="bg-white flex-1 px-2 py-1 text-sm font-semibold text-[#172B4D] border border-blue-500 rounded focus:outline-none"
                />
              ) : (
                <>
                  <h6
                    className="font-semibold text-[#172B4D] text-sm cursor-pointer hover:bg-gray-200 px-1 py-0.5 rounded"
                    onClick={() => {
                      resetAllInputs();
                      setEditingListId(list.id);
                    }}
                  >
                    {list.title}
                  </h6>
                  <button
                    className="text-gray-600 hover:bg-gray-200 p-0.5 rounded"
                    onClick={() => {
                      resetAllInputs();
                      setEditingListId(list.id);
                    }}
                  >
                    <MoreHorizontal size={14} />
                  </button>
                </>
              )}
            </div>

            {/* Tasks */}
            {list.tasks?.length > 0 &&
              list.tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded shadow-sm p-2 mb-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setIsShowFormTask(true)}
                >
                  <span className="text-sm text-gray-800">{task.title}</span>
                </div>
              ))}

            {/* Add Card */}
            {addingCardToList === list.id ? (
              <div className="w-full space-y-2">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Enter a title or paste a link"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") resetAllInputs();
                    if (e.key === "Escape") resetAllInputs();
                  }}
                  className="bg-white w-full h-[56px] mb-2 px-2 py-1.5 shadow-[inset_0_0_0_1px_#8590A2] text-sm rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex items-center gap-1">
                  <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
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
                  className="w-full text-left px-2 py-1.5 text-gray-700 hover:bg-gray-200 rounded text-sm flex items-center gap-1.5"
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
                  onClick={() => confirm("delete")}
                  className="cursor-pointer "
                />
              </div>
            )}
          </div>
        ))}

        {/* Add new list */}
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

      {/* Modals */}
      <FilterDropdown onClose={() => setIsFilter(false)} isFilter={isFilter} />
      <DatePickerModal isOpen={showDate} onClose={() => setShowDate(false)} />
      <FormTask
        isShowFormTask={isShowFormTask}
        onClose={() => setIsShowFormTask(false)}
        onShowDate={() => setShowDate(true)}
        onShowMoveCard={() => setIsMoveCard(true)}
        onShowLabel={() => setIsLabels(true)}
      />
      <MoveCard isMoveCard={isMoveCard} onClose={() => setIsMoveCard(false)} />
      <Labels
        isOpenModal={isLabels}
        onClose={() => setIsLabels(false)}
        onShowLabelModal={() => setIsLabelModal(true)}
      />
      <LabelModal
        isOpen={isLabelModal}
        onClose={() => setIsLabelModal(false)}
      />
    </div>
  );
}
