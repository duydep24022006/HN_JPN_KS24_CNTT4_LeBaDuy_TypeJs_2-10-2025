import { X, ChevronDown } from "lucide-react";
import type { List, Task } from "../utils/types";
import { useState, useEffect } from "react";

type Props = {
  isMoveCard: boolean;
  onClose: () => void;
  lists: List[];
  currentList: List | null;
  currentTask: Task | null;
  titleBoard?: string;
  setSelectedList: React.Dispatch<React.SetStateAction<List | null>>;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
};

export default function MoveCard({
  isMoveCard,
  onClose,
  lists,
  currentList,
  currentTask,
  titleBoard,
  setSelectedList,
  setSelectedTask,
}: Props) {
  const [selectedListId, setSelectedListId] = useState<number>(
    Number(currentTask?.listId)
  );
  const [selectedPosition, setSelectedPosition] = useState<Task[]>([]);
  const [selectedPositionId, setSelectedPositionId] = useState<number>(1);

  const handleAddTask = () => {
    if (!currentTask) return;

    const taskToMove: Task = {
      ...currentTask,
      listId: selectedListId,
    };
    setSelectedTask(taskToMove);

    const newList = lists.find((l) => l.id === selectedListId);
    if (newList?.tasks) {
      const newTasks = [
        ...newList.tasks.slice(0, selectedPositionId - 1),
        taskToMove,
        ...newList.tasks.slice(selectedPositionId - 1),
      ];

      setSelectedList({
        ...newList,
        tasks: newTasks,
      });
    }
  };

  useEffect(() => {
    if (currentList && currentTask) {
      setSelectedListId(currentList.id);
      const tasks = currentList.tasks ?? [];
      setSelectedPosition(tasks);

      const currentIndex =
        tasks.findIndex((t) => t.id === currentTask.id) + 1 || 1;
      setSelectedPositionId(currentIndex);
    }
  }, [currentList, currentTask]);

  useEffect(() => {
    if (selectedListId !== null) {
      const foundList = lists.find((item) => item.id === selectedListId);
      const indexList = lists.findIndex((item) => item.id === currentTask?.id);
      const tasks = foundList?.tasks ?? [];
      setSelectedPosition(tasks);
      setSelectedPositionId(indexList);
    }
  }, [selectedListId, lists]);

  if (!isMoveCard) return null;

  return (
    <div className="fixed left-[-40%] inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-[0px_8px_12px_0px_#091E4226] w-full max-w-[304px] max-h-[90vh] overflow-y-auto">
        <div className="relative px-4 py-3 border-b border-gray-200">
          <p className="text-center text-base font-medium text-gray-700">
            Move card
          </p>
          <button
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <div className="px-4 py-3">
          <p className="text-xs font-semibold text-gray-600 mb-2">
            Select destination
          </p>

          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-800 mb-2">
              Board
            </label>
            <input
              type="text"
              value={titleBoard ?? ""}
              readOnly
              className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm text-gray-800 bg-gray-50 cursor-not-allowed"
            />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div>
              <label className="block w-40 text-xs font-bold text-gray-800 mb-2">
                List
              </label>
              <div className="relative">
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm text-gray-800 bg-white cursor-pointer appearance-none pr-8"
                  value={selectedListId}
                  onChange={(e) => setSelectedListId(Number(e.target.value))}
                >
                  {lists.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block w-20 text-xs font-bold text-gray-800 mb-2">
                Position
              </label>
              <div className="relative">
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm text-gray-800 bg-white cursor-pointer appearance-none pr-8"
                  value={selectedPositionId}
                  onChange={(e) =>
                    setSelectedPositionId(Number(e.target.value))
                  }
                >
                  {Array.from(
                    { length: (selectedPosition?.length ?? 0) + 1 },
                    (_, i) => i + 1
                  ).map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              handleAddTask();
              onClose();
            }}
            className="w-full py-2 px-4 mb-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition-colors"
          >
            Move
          </button>
        </div>
      </div>
    </div>
  );
}
