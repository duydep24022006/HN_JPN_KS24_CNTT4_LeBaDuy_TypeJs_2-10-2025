import { X, Pencil } from "lucide-react";
type Props = {
  isOpen: boolean;
  onClose: () => void;
  onShowLabelModal: () => void;
};
export default function Labels({ isOpen, onClose, onShowLabelModal }: Props) {
  const labels = [
    { id: 1, name: "done", color: "bg-green-400" },
    { id: 2, name: "urgent", color: "bg-orange-400" },
    { id: 3, name: "todo", color: "bg-red-400" },
    { id: 4, name: "in-progress", color: "bg-purple-400" },
  ];
  if (!isOpen) return <></>;
  return (
    <div className=" w-full h-full fixed z-50  flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl" style={{ width: "304px" }}>
        {/* Header */}
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

        {/* Content */}
        <div className="px-3 pb-3">
          <p className="text-xs font-semibold text-gray-600 mb-2 px-1">
            Labels
          </p>

          {/* Labels List */}
          <div className="space-y-1">
            {labels.map((label) => (
              <div key={label.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                />
                <div
                  className={`flex-1 px-3 py-2 ${label.color} rounded text-sm font-medium text-gray-800`}
                >
                  {label.name}
                </div>
                <button className="p-1.5 hover:bg-gray-100 rounded">
                  <Pencil className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            ))}
          </div>

          {/* Create New Label Button */}
          <button
            className="w-full mt-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            onClick={onShowLabelModal}
          >
            Create a new label
          </button>
        </div>
      </div>
    </div>
  );
}
