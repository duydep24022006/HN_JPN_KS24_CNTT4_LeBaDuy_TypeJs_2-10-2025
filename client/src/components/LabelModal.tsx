import { X, ChevronLeft } from "lucide-react";
import { useState } from "react";
type Props = {
  isOpen: boolean;
  onClose: () => void;
};
export default function LabelModal({ isOpen, onClose }: Props) {
  const [selectedColor, setSelectedColor] = useState("");

  const colors = [
    ["#A7E9E5", "#F9E4A0", "#FCCCB8", "#FFC8D7", "#D8C8F5"],
    ["#4ECDC4", "#FFD93D", "#FFB084", "#FF6B9D", "#A78BFA"],
  ];
  if (!isOpen) return <></>;

  return (
    <div className="w-full h-full fixed z-50 flex items-center justify-center p-2">
      <div className="bg-white rounded-lg shadow-xl w-[304px] ">
        {/* Header */}
        <div className="relative px-4 pt-3 flex items-center" onClick={onClose}>
          <button className="text-gray-600 hover:text-gray-800">
            <ChevronLeft className="w-5 h-5" strokeWidth={2} />
          </button>
          <p className="flex-1 text-center text-sm font-medium text-gray-700">
            Create label
          </p>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 pb-4 pt-2">
          {/* Title Input */}
          <div className="mb-2">
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder=""
            />
          </div>

          {/* Color Selection */}
          <div className="mb-3 pb-3 border-b-1 border-gray-300">
            <label className="block text-xs font-semibold text-gray-700 mb-3">
              Select a color
            </label>
            <div className="space-y-2">
              {colors.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-2">
                  {row.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className="w-[50px] h-8 rounded hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Create Button */}
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors">
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
