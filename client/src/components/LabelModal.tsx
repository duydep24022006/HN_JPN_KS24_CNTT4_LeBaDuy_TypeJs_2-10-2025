import { X, ChevronLeft, Check } from "lucide-react";
import { useEffect, useState } from "react";
import type { Tags, Task } from "../utils/types";
import { confirmNotification } from "../utils/ConfirmNotification";
import Swal from "sweetalert2";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  currentTask: Task | null;
  setCurrentTask: React.Dispatch<React.SetStateAction<Task | null>>;
  editTag: Tags | null;
};

export default function LabelModal({
  isOpen,
  onClose,
  currentTask,
  setCurrentTask,
  editTag,
}: Props) {
  const [selectedColor, setSelectedColor] = useState<string>();
  const [selectedContent, setSelectedContent] = useState<string>();
  const [titleError, setTitleError] = useState("");
  useEffect(() => {
    if (!isOpen) {
      if (editTag) {
        setSelectedColor(editTag.color);
        setSelectedContent(editTag.content);
      } else {
        setSelectedColor("#A7E9E5");
        setSelectedContent("");
      }
      setTitleError("");
    }
  }, [isOpen, editTag]);
  const deleteTag = async () => {
    if (!currentTask || !currentTask.tags) return;

    const result = await confirmNotification("delete");
    if (!result) return;

    const indexTag = currentTask.tags.findIndex(
      (item) => item.id === editTag?.id
    );
    if (indexTag === -1) return;

    const updatedTags = currentTask.tags.filter(
      (_, index) => index !== indexTag
    );

    setCurrentTask({
      ...currentTask,
      tags: updatedTags,
    });

    await Swal.fire({
      title: "Deleted",
      text: "Your tag has been deleted successfully.",
      icon: "success",
    });
    onClose();
    setTitleError("");
  };

  const handleSave = async () => {
    if (!selectedContent?.trim()) {
      setTitleError("Không đc để trống");
      return;
    }
    setTitleError("");
    if (editTag?.id) {
      const newTags = currentTask?.tags?.map((item) => {
        if (item.id === editTag.id) {
          return {
            ...item,
            content: selectedContent,
            color: selectedColor,
          };
        }
        return item;
      });
      setCurrentTask((prev: any) => ({
        ...prev,
        tags: newTags,
      }));
      await Swal.fire({
        title: "Success!",
        text: "Label has been updated successfully.",
        icon: "success",
      });
    } else {
      const newTags: Tags = {
        id: Number(
          `${Date.now().toString().slice(-4)}${Math.floor(
            1000 + Math.random() * 9000
          )}`
        ),
        taskId: currentTask?.id,
        content: selectedContent,
        color: selectedColor,
      };
      setCurrentTask((prev: any) => ({
        ...prev,
        tags: [...(prev.tags || []), newTags],
      }));
    }
    onClose();
  };

  const colors = [
    ["#A7E9E5", "#F9E4A0", "#FCCCB8", "#FFC8D7", "#D8C8F5"],
    ["#4ECDC4", "#FFD93D", "#FFB084", "#FF6B9D", "#A78BFA"],
  ];

  if (!isOpen) return <></>;

  return (
    <div className="w-full h-full fixed z-50 flex items-center justify-center p-2">
      <div className="bg-white rounded-lg shadow-xl w-[304px] ">
        <div className="relative px-4 pt-3 flex items-center" onClick={onClose}>
          <button className="text-gray-600 hover:text-gray-800">
            <ChevronLeft className="w-5 h-5" strokeWidth={2} />
          </button>
          <p className="flex-1 text-center text-sm font-medium text-gray-700">
            {editTag?.id ? "Edit label" : "Create label"}
          </p>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => {
              onClose();
              setTitleError("");
            }}
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <div className="px-4 pb-4 pt-2">
          <div className="mb-2">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={selectedContent}
              onChange={(e) => {
                setSelectedContent(e.target.value);
                if (titleError) setTitleError("");
              }}
              className={`w-full px-3 py-2.5 border ${
                titleError ? "border-red-500" : "border-gray-300"
              } rounded text-sm focus:outline-none focus:ring-2 ${
                titleError ? "focus:ring-red-500" : "focus:ring-blue-500"
              } focus:border-transparent`}
              placeholder=""
            />
            {titleError && (
              <p className="mt-1 text-xs text-red-500">{titleError}</p>
            )}
          </div>

          <div className="mb-3 pb-3 border-b-1 border-gray-300">
            <label className="block text-xs font-semibold text-gray-700 mb-3">
              Select a color
            </label>
            <div className="space-y-2">
              {colors.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-2 justify-center">
                  {row.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className="w-[50px] h-8 rounded hover:opacity-80 transition-opacity relative flex items-center justify-center"
                      style={{ backgroundColor: color }}
                    >
                      {selectedColor === color && (
                        <div className="w-4 h-4 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                          <Check
                            className="w-3 h-3 text-gray-800"
                            strokeWidth={3}
                          />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div
            className={`${
              editTag?.id ? "flex justify-between items-center" : ""
            }`}
          >
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
            >
              {editTag?.id ? "Save" : "Create"}
            </button>
            {editTag?.id && (
              <button
                className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
                onClick={deleteTag}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
