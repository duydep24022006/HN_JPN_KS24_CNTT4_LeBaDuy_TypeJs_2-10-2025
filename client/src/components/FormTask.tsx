import { useEffect, useState } from "react";
import { Tag, Clock4, Minus, ChevronDown, Circle, Check } from "lucide-react";
import InputTask from "./InputTask";
import Swal from "sweetalert2";
import { confirmNotification } from "../utils/ConfirmNotification";
import type { List, Task } from "../utils/types";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import {
  deleteTask,
  editTask,
  getBoardWithAllData,
} from "../services/taskListApi";
import { useParams } from "react-router-dom";

type Props = {
  isShowFormTask: boolean;
  onClose: () => void;
  onShowDate: () => void;
  onShowMoveCard: () => void;
  onShowLabel: () => void;
  currentList: List | null;
  currentTask: Task | null;
  setCurrentTask: React.Dispatch<React.SetStateAction<Task | null>>;
};

export default function FormTask({
  isShowFormTask,
  onClose,
  onShowDate,
  onShowMoveCard,
  onShowLabel,
  setCurrentTask,
  currentList,
  currentTask,
}: Props) {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState<string>(
    currentTask?.title || ""
  );
  const [isCompleted, setIsCompleted] = useState(currentTask?.status);
  const [changeDescription, setDescription] = useState("");
  const [error, setError] = useState({
    title: "",
  });

  const confirm = async (key: string, taskId: number) => {
    const result = await confirmNotification(key);
    if (result) {
      dispatch(deleteTask(taskId))
        .unwrap()
        .then(() => {
          onClose();
          dispatch(getBoardWithAllData(Number(id)));
        })
        .catch((err) => console.error("Lỗi khi xóa task:", err));
      Swal.fire({
        title: key,
        text: `Your file has been deleted.${key}`,
        icon: "success",
      });
    }
  };

  const handleTitleClick = () => {
    setIsEditingTitle(true);
    setEditedTitle(currentTask?.title || "");
  };

  const handleChangeTitle = () => {
    const trimmedTitle = String(editedTitle).trim();

    if (!trimmedTitle) {
      setError((prev) => ({
        ...prev,
        title: "Không được bỏ trống",
      }));
      return;
    }

    setCurrentTask((prev: any) => ({
      ...prev,
      title: trimmedTitle,
    }));

    setError((prev) => ({
      ...prev,
      title: "",
    }));
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setEditedTitle(currentTask?.title || "");
    setError((prev) => ({
      ...prev,
      title: "",
    }));
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleChangeTitle();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleTitleCancel();
    }
  };

  const toggleStatus = () => {
    const newStatus = !isCompleted;
    setIsCompleted(newStatus);
    setCurrentTask((prev: any) => ({
      ...prev,
      status: newStatus,
    }));
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
  };

  const handleSave = () => {
    const newTask: any = {
      ...currentTask,
      description: changeDescription.trim(),
    };

    dispatch(editTask(newTask))
      .unwrap()
      .then(() => {
        onClose();
        dispatch(getBoardWithAllData(Number(id)));
      })
      .catch((err) => {
        console.error("Lỗi khi cập nhật description:", err);
      });
  };

  const handleClose = () => {
    setError({
      title: "",
    });
    setIsEditingTitle(false);
    onClose();
  };

  if (!isShowFormTask) return <></>;

  return (
    <div className="bg-gray-500/50 p-4 fixed z-30 w-full h-full flex justify-center items-center">
      <div className="bg-white rounded-lg  mb-50 mr-20 shadow-[0px_8px_12px_0px_#091E4226]">
        <div className="p-3">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 cursor-pointer">
                {currentTask?.status === true ? (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check
                      size={18}
                      className="text-white"
                      onClick={toggleStatus}
                    />
                  </div>
                ) : (
                  <Circle onClick={toggleStatus} />
                )}

                {isEditingTitle ? (
                  <div className="flex-1">
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => {
                        setEditedTitle(e.target.value);
                        if (error.title) {
                          setError((prev) => ({ ...prev, title: "" }));
                        }
                      }}
                      onKeyDown={handleKeyDown}
                      onBlur={handleChangeTitle}
                      className={`w-full text-xl font-semibold text-[#172B4D] border rounded px-2 py-1 focus:outline-none focus:ring-2 ${
                        error.title
                          ? "border-red-500 focus:ring-red-500"
                          : "border-blue-500 focus:ring-blue-500"
                      }`}
                      autoFocus
                    />
                    {error.title && (
                      <p className="text-red-500 text-xs mt-1 px-2">
                        {error.title}
                      </p>
                    )}
                  </div>
                ) : (
                  <h2
                    onClick={handleTitleClick}
                    className="text-xl font-semibold text-[#172B4D] cursor-pointer hover:bg-gray-100 px-2 py-1 rounded flex-1"
                  >
                    {currentTask?.title}
                  </h2>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-[#44546F] font-normal text-[14px] mt-1 ml-8">
                <span>in list</span>
                <div
                  onClick={onShowMoveCard}
                  className="flex justify-center items-center gap-1 p-1 text-[11px] font-bold bg-[#DCDFE4] text-[#44546F] rounded border-none outline-none cursor-pointer hover:bg-[#c1c7d0]"
                >
                  {currentList?.title || "Unknown List"}
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-end gap-1 rotate-90">
                <div className="w-0.5 h-6 bg-[#44546F] rounded-[2px]"></div>
                <div className="w-0.5 h-6 bg-[#44546F] rounded-[2px]"></div>
                <div className="w-0.5 h-6 bg-[#44546F] rounded-[2px]"></div>
                <div className="w-0.5 h-4 bg-[#44546F] rounded-[2px]"></div>
              </div>

              <h3 className="text-[16px] font-[600] text-[#172B4D]">
                Description
              </h3>
            </div>

            <div className="!w-[512px] !min-h-[275px] bg-white ml-7 ">
              <InputTask
                onChangeDescription={handleDescriptionChange}
                taskDescription={currentTask?.description}
              />
            </div>

            <div className="flex gap-2 ml-7 mt-3">
              <button
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded hover:bg-gray-100"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="ml-15">
            <button
              className="w-[168px] mb-2 h-[32px] flex items-center gap-3 px-4 py-2 text-sm text-[#172B4D] bg-gray-100 rounded hover:bg-gray-200"
              onClick={onShowLabel}
            >
              <Tag className="w-4 h-4 rotate-280" />
              <span>Labels</span>
            </button>

            <button
              className="w-[168px] mb-2 h-[32px] flex items-center gap-3 px-4 py-2 text-sm text-[#172B4D] bg-gray-100 rounded hover:bg-gray-200"
              onClick={onShowDate}
            >
              <Clock4 className="w-4 h-4" />
              <span>Dates</span>
            </button>

            <button
              className="w-[168px] mb-2 h-[32px] flex items-center gap-3 px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
              onClick={() => confirm("delete", Number(currentTask?.id))}
            >
              <Minus size={20} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
