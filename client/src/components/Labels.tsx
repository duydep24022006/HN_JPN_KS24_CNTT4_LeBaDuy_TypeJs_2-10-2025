import { X, Pencil } from "lucide-react";
import type { Tags, Task } from "../utils/types";

type Props = {
  isOpenModal: boolean;
  onClose: () => void;
  onShowLabelModal: () => void;
  setCurrentTask: React.Dispatch<React.SetStateAction<Task | null>>;
  currentTask: Task | null;
  setEditTag: React.Dispatch<React.SetStateAction<Tags | null>>;
};

export default function Labels({
  isOpenModal,
  onClose,
  onShowLabelModal,
  setCurrentTask,
  currentTask,
  setEditTag,
}: Props) {
  const labels = [...(currentTask?.tags || [])];

  if (!isOpenModal) return <></>;
  return (
    <div className="w-full h-full fixed z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl" style={{ width: "304px" }}>
        <div className="relative px-4 pt-3">
          <p className="text-center text-sm font-medium text-gray-700">
            Labels
          </p>
          <button
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        <div className="px-3 pb-3">
          <p className="text-xs font-semibold text-gray-600 mb-2 px-1">
            Labels
          </p>

          <div className="max-h-[200px] overflow-y-auto space-y-1">
            {labels.map((label) => (
              <div key={label.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                />
                <div
                  style={{ backgroundColor: label.color }}
                  className="flex-1 px-3 py-2 rounded text-sm font-medium text-gray-800"
                >
                  {label.content}
                </div>
                <button
                  className="p-1.5 hover:bg-gray-100 rounded"
                  onClick={() => {
                    setEditTag(label);
                    requestAnimationFrame(() => {
                      onShowLabelModal();
                    });
                  }}
                >
                  <Pencil className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            ))}
          </div>

          <button
            className="w-full mt-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            onClick={() => {
              onShowLabelModal();
              setEditTag(null);
            }}
          >
            Create a new label
          </button>
        </div>
      </div>
    </div>
  );
}
