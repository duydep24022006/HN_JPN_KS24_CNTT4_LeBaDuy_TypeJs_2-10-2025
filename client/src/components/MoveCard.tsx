import { X, ChevronDown } from "lucide-react";

type Props = {
  isMoveCard: boolean;
  onClose: () => void;
};

export default function MoveCard({ isMoveCard, onClose }: Props) {
  if (!isMoveCard) return null;

  return (
    <div className="fixed inset-0 z-50 mr-120 mb-10 flex items-center justify-center   p-4">
      <div className="bg-white rounded-lg shadow-[0px_8px_12px_0px_#091E4226] relative w-full max-w-[304px] max-h-[90vh] overflow-y-auto">
        <div className="relative  px-4 py-3">
          <p className="text-center text-base font-medium text-gray-600">
            Move card
          </p>
          <button
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="px-2 py-1">
          <p className="text-xs font-semibold text-gray-600 ">
            Select destination
          </p>

          {/* Board */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-800 mb-2">
              Board
            </label>
            <div className="relative">
              <input
                type="text"
                value="Tổ chức sự kiện Year-end party !"
                readOnly
                className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm text-gray-800 bg-gray-50 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-2">
            {/* List */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">
                List
              </label>
              <div className="relative">
                <select className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm text-gray-800 bg-white cursor-pointer appearance-none pr-8">
                  <option>In-progress</option>
                  <option>Todo</option>
                  <option>Done</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
              </div>
            </div>

            {/* Position */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">
                Position
              </label>
              <div className="relative">
                <select className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm text-gray-800 bg-white cursor-pointer appearance-none pr-8">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Move Button */}
          <button className=" py-2 px-4 mb-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition-colors">
            Move
          </button>
        </div>
      </div>
    </div>
  );
}
