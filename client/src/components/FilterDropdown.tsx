import { X, Clock, CalendarDays, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import type { Task, Tags } from "../utils/types";

type Props = {
  onClose: () => void;
  isFilter: boolean;
  tasks: Task[] | [];
  onApplyFilter: (filteredTasks: Task[]) => void;
};

export default function FilterDropdown({
  onClose,
  isFilter,
  tasks,
  onApplyFilter,
}: Props) {
  const [keyword, setKeyword] = useState("");
  const [cardStatus, setCardStatus] = useState({
    complete: false,
    incomplete: false,
  });
  const [dueDate, setDueDate] = useState({
    noDates: false,
    overdue: false,
    nextDay: false,
  });
  const [selectedLabels, setSelectedLabels] = useState<number[]>([]);
  const [noLabels, setNoLabels] = useState(false);

  const handleLabelToggle = (labelId: number) => {
    setSelectedLabels((prev) =>
      prev.includes(labelId)
        ? prev.filter((id) => id !== labelId)
        : [...prev, labelId]
    );
  };

  const isOverdue = (dueDate: string | undefined) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const isDueNextDay = (dueDate: string | undefined) => {
    if (!dueDate) return false;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);
    const taskDate = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return taskDate >= today && taskDate <= tomorrow;
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    if (keyword.trim()) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    if (cardStatus.complete || cardStatus.incomplete) {
      filtered = filtered.filter((task) => {
        if (cardStatus.complete && cardStatus.incomplete) return true;
        if (cardStatus.complete) return task.status === true;
        if (cardStatus.incomplete) return task.status === false;
        return true;
      });
    }

    if (dueDate.noDates || dueDate.overdue || dueDate.nextDay) {
      filtered = filtered.filter((task) => {
        if (dueDate.noDates && !task.due_date) return true;
        if (dueDate.overdue && isOverdue(task.due_date)) return true;
        if (dueDate.nextDay && isDueNextDay(task.due_date)) return true;
        return false;
      });
    }

    if (noLabels) {
      filtered = filtered.filter(
        (task) => !task.tags || task.tags.length === 0
      );
    } else if (selectedLabels.length > 0) {
      filtered = filtered.filter((task) =>
        task.tags?.some((tag) => selectedLabels.includes(Number(tag.id)))
      );
    }

    onApplyFilter(filtered);
  };

  const handleClearFilters = () => {
    setKeyword("");
    setCardStatus({ complete: false, incomplete: false });
    setDueDate({ noDates: false, overdue: false, nextDay: false });
    setSelectedLabels([]);
    setNoLabels(false);
    onApplyFilter(tasks);
  };

  useEffect(() => {
    applyFilters();
  }, [keyword, cardStatus, dueDate, selectedLabels, noLabels]);

  if (!isFilter) return <></>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[390px] h-[680px] overflow-hidden">
        <div className="flex items-center justify-center relative px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-800">Filter</h3>
          <button
            onClick={onClose}
            className="absolute right-3 text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-3 py-4 max-h-[600px] overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Keyword
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter a keyword..."
              className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Search cards</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Card status
            </label>
            <div className="space-y-2.5 flex flex-col">
              <div className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cardStatus.complete}
                  onChange={(e) =>
                    setCardStatus({ ...cardStatus, complete: e.target.checked })
                  }
                  className="w-4 h-4 border border-gray-400 rounded cursor-pointer accent-blue-600"
                />
                <label className="text-sm text-gray-700">
                  Marked as complete
                </label>
              </div>

              <div className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cardStatus.incomplete}
                  onChange={(e) =>
                    setCardStatus({
                      ...cardStatus,
                      incomplete: e.target.checked,
                    })
                  }
                  className="w-4 h-4 border border-gray-400 rounded cursor-pointer accent-blue-600"
                />
                <label className="text-sm text-gray-700">
                  Not marked as complete
                </label>
              </div>
            </div>
          </div>

          {/* Due date */}
          <div className="mb-2">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Due date
            </label>
            <div className="flex items-center gap-2.5 cursor-pointer h-7">
              <input
                type="checkbox"
                checked={dueDate.noDates}
                onChange={(e) =>
                  setDueDate({ ...dueDate, noDates: e.target.checked })
                }
                className="w-4 h-4 border border-gray-400 rounded cursor-pointer accent-blue-600"
              />
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                <CalendarDays size={16} className="text-gray-700" />
              </div>
              <label className="text-sm text-gray-700">No dates</label>
            </div>

            <div className="flex items-center gap-2.5 cursor-pointer h-7">
              <input
                type="checkbox"
                checked={dueDate.overdue}
                onChange={(e) =>
                  setDueDate({ ...dueDate, overdue: e.target.checked })
                }
                className="w-4 h-4 border border-gray-400 rounded cursor-pointer accent-blue-600"
              />
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <Clock size={16} className="text-white" />
              </div>
              <label className="text-sm text-gray-700">Overdue</label>
            </div>
            <div className="flex items-center gap-2.5 cursor-pointer h-7">
              <input
                type="checkbox"
                checked={dueDate.nextDay}
                onChange={(e) =>
                  setDueDate({ ...dueDate, nextDay: e.target.checked })
                }
                className="w-4 h-4 border border-gray-400 rounded cursor-pointer accent-blue-600"
              />
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <Clock size={16} className="text-white" />
              </div>
              <label className="text-sm text-gray-700">
                Due in the next day
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700  mb-2">
              Labels
            </label>
            <div className="space-y-2.5">
              <div className="flex  items-center ">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-3 ">
                    <input
                      type="checkbox"
                      className="w-4 h-4 border border-gray-400 rounded cursor-pointer accent-blue-600"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                        <Tag size={16} className="rotate-270" />
                      </div>
                      <label className="flex items-center justify-center flex-row">
                        No labels
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 border border-gray-400 rounded cursor-pointer accent-blue-600"
                    />
                    <label>
                      <div className="flex-1 w-[330px] h-8 bg-emerald-500 rounded"></div>
                    </label>
                  </div>
                  <div className="flex gap-3 items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 border border-gray-400 rounded cursor-pointer accent-blue-600"
                    />
                    <label>
                      <div className="flex-1 w-[330px]  h-8 bg-yellow-400 rounded"></div>
                    </label>
                  </div>
                  <div className="flex gap-3 items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 border border-gray-400 rounded cursor-pointer accent-blue-600"
                    />
                    <label>
                      <div className="flex-1 w-[330px]  h-8 bg-orange-400 rounded"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="relative flex justify-center items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 border border-gray-400 rounded cursor-pointer accent-blue-600"
                />
                <select className="w-full px-2.5 py-2 text-sm text-gray-600 border-0 border-blue-500 rounded appearance-none cursor-pointer focus:outline-none bg-white">
                  <option>Select labels</option>
                </select>
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                >
                  <path fill="currentColor" d="M6 8L2 4h8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
