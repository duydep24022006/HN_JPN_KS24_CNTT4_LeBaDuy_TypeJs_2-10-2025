import { useState } from "react";
import {
  Star,
  MoreHorizontal,
  Plus,
  CircleX,
  ListFilter,
  X,
  TableProperties,
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
import LabelModal from "../components/labelModal";

export default function TaskListBoard() {
  const [lists, setLists] = useState([
    {
      id: 1,
      title: "Todo",
      cards: [
        { id: 1, title: "Thuê DJ", completed: true },
        { id: 2, title: "Lên kịch bản chương trình", completed: true },
        { id: 3, title: "Chuẩn bị kịch", completed: false },
        { id: 4, title: "Kịch bản", completed: true },
        { id: 5, title: "Thuê MC", completed: false },
      ],
    },

    {
      id: 2,
      title: "In-progress",
      cards: [{ id: 1, title: "Thuê DJ", completed: true }],
    },
  ]);
  const [isShowFormTask, setIsShowFormTask] = useState(false);
  const [isLabelModal, setIsLabelModal] = useState(false);
  const [isLabels, setIsLabels] = useState(Boolean);
  const [isMoveCard, setIsMoveCard] = useState(false);
  const [addingCardToList, setAddingCardToList] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [addingNewList, setAddingNewList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [editingListId, setEditingListId] = useState(null);
  // const [editListTitle, setEditListTitle] = useState("");
  const [isFilter, setIsFilter] = useState(false);
  const [showDate, setShowDate] = useState<boolean>(false);
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

  const onChangeFilter = (key: boolean) => {
    setIsFilter(key);
  };
  const onChangeFormTask = (key: boolean) => {
    console.log(1111);
    setIsShowFormTask(key);
  };
  return (
    <div className="h-screen !w-[100%] flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="fixed  top-[48px] left-60 right-0 z-10  h-17 pt-3 border-b border-gray-200 bg-[#f1f2f4] flex items-center justify-between px-6">
        <div className="flex gap-6">
          <div className="flex items-center gap-6">
            <h2 className="text-base font-semibold text-[#172B4D]">
              Tổ chức sự kiện Year-end party !
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

            <button className="px-2.5 py-1  hover:bg-gray-100 text-[#172B4D] rounded text-xs flex items-center gap-1.5 font-medium">
              <TableProperties
                size={16}
                style={{ transform: "rotate(180deg)" }}
              />
              Table
            </button>

            <button
              className="px-2.5 py-1  hover:bg-gray-100 text-[#172B4D] rounded text-xs flex items-center gap-1.5 font-medium"
              onClick={() => confirm("close")}
            >
              <CircleX size={16} />
              Close this board
            </button>
          </div>
        </div>

        <div>
          <button
            className="px-2.5 py-1  hover:bg-gray-100 text-[#172B4D] rounded text-xs flex items-center gap-1.5 font-medium"
            onClick={() => onChangeFilter(true)}
          >
            <ListFilter size={16} />
            Filters
          </button>
        </div>
      </div>
      {/* Lists */}
      <div className="flex-1 overflow-auto mt-20 p-4 flex gap-2 items-start">
        {lists.map((list) => (
          <div
            key={list.id}
            className="bg-gray-100 rounded-lg p-2 w-64 flex-shrink-0"
          >
            <div className="flex items-center justify-between mb-2 px-1">
              {editingListId === list.id ? (
                <input
                  type="text"
                  defaultValue={list.title}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setEditingListId(null);
                  }}
                  onBlur={() => setEditingListId(null)}
                  className="bg-white flex-1 px-2 py-1 text-sm font-semibold text-[#172B4D] border border-blue-500 rounded focus:outline-none"
                  autoFocus
                />
              ) : (
                <>
                  <h6
                    className="font-semibold text-[#172B4D] text-sm cursor-pointer hover:bg-gray-200 px-1 py-0.5 rounded"
                    onClick={() => setEditingListId(list.id)}
                  >
                    {list.title}
                  </h6>
                  <button
                    className="text-gray-600 hover:bg-gray-200 p-0.5 rounded"
                    onClick={() => setEditingListId(list.id)}
                  >
                    <MoreHorizontal size={14} />
                  </button>
                </>
              )}
            </div>

            {/* Cards */}
            {list.cards.length > 0 && (
              <div className="space-y-1.5 mb-2">
                {list.cards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white rounded shadow-sm p-2 mb-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setIsShowFormTask(true)}
                  >
                    <div className="flex items-start gap-2">
                      {card.completed ? (
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            card.completed
                              ? "bg-green-500"
                              : "bg-white border-2 border-gray-400"
                          }`}
                        >
                          {card.completed && (
                            <svg
                              className="w-2.5 h-2.5 text-white"
                              fill="none"
                              strokeWidth="3"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      ) : (
                        <></>
                      )}

                      <span className="text-sm text-gray-800">
                        {card.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Card */}
            <div className="flex justify-between items-center">
              {addingCardToList === list.id ? (
                <div className="w-full space-y-2">
                  <input
                    type="text"
                    value={newCardTitle}
                    onChange={(e) => setNewCardTitle(e.target.value)}
                    placeholder="Enter a title or paste a link"
                    className="bg-white w-full mb-2 px-2 py-1.5 shadow-[inset_0_0_0_1px_#8590A2] placeholder:font-semibold text-[14px] leading-[20px] tracking-[0%] align-middle  text-sm  rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <div className="flex items-center gap-1">
                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                      Add card
                    </button>
                    <button
                      onClick={() => {
                        setAddingCardToList(null);
                        setNewCardTitle("");
                      }}
                      className="p-1.5 hover:bg-gray-200 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setAddingCardToList(list.id)}
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
                </>
              )}
            </div>
          </div>
        ))}

        <div className="bg-gray-100 rounded-lg p-2 w-64 flex-shrink-0">
          {addingNewList ? (
            <div className="space-y-2">
              <input
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="Enter list name..."
                className="bg-white w-full px-2 mb-2 py-1.5 shadow-[inset_0_0_0_1px_#8590A2] placeholder:font-semibold text-[14px] leading-[20px] tracking-[0%] align-middle text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <div className="flex items-center gap-1">
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                  Add list
                </button>
                <button
                  onClick={() => {
                    setAddingNewList(false);
                    setNewListTitle("");
                  }}
                  className="p-1.5 hover:bg-gray-200 rounded"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingNewList(true)}
              className="w-full text-left px-2 py-1.5 text-[#172B4D] hover:bg-gray-200 rounded text-sm flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span className="font-medium text-[14px] leading-[20px] tracking-[0px] text-center">
                Add another list
              </span>
            </button>
          )}
        </div>
      </div>
      <FilterDropdown
        onClose={() => onChangeFilter(false)}
        isFilter={isFilter}
      />
      <DatePickerModal isOpen={showDate} onClose={() => setShowDate(false)} />
      <FormTask
        isShowFormTask={isShowFormTask}
        onClose={() => onChangeFormTask(false)}
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
