import { X, Clock, CalendarDays, Tag } from "lucide-react";
import { useState } from "react";

type Props = {
  onClose: () => void;
  isFilter: boolean;
};

export default function FilterDropdown({ onClose, isFilter }: Props) {
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

  if (!isFilter) return <></>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[390px] h-[680px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-center relative px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-800">Filter</h3>
          <button
            onClick={onClose}
            className="absolute right-3 text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-3 py-4 max-h-[600px] overflow-y-auto">
          {/* Keyword */}
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

          {/* Card status */}
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
                checked={dueDate.overdue}
                onChange={(e) =>
                  setDueDate({ ...dueDate, overdue: e.target.checked })
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

          {/* Labels */}
          <div>
            <label className="block text-xs font-medium text-gray-700  mb-2">
              Labels
            </label>
            <div className="space-y-2.5">
              {/* No labels row */}
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
