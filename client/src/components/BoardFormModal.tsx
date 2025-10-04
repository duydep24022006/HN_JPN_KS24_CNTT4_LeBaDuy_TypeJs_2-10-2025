import { useState } from "react";
import { X, Check } from "lucide-react";
import Button from "react-bootstrap/esm/Button";

type Props = {
  onChangeToggle: (key: boolean) => void;
  isModal: boolean;
};
export default function CreateBoardModal({ onChangeToggle, isModal }: Props) {
  const [selectedBg, setSelectedBg] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [title, setTitle] = useState("");
  const [showError, setShowError] = useState(false);

  const backgrounds = [
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=400&h=300&fit=crop",
  ];

  const colors = [
    "#FF5722",
    "#9C27B0",
    "#00E676",
    "#2196F3",
    "#FFEB3B",
    "#E91E63",
  ];

  const handleCreate = () => {
    if (title.trim() === "") {
      setShowError(true);
    } else {
      setShowError(false);
      alert(`Board "${title}" created!`);
      setTitle("");
    }
  };
  if (!isModal) return null;
  return (
    <div className="h-[calc(100vh-48px)] bg-gray-500/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-[498px] ">
        <div className="flex items-center justify-between w-[498px] h-[63px] px-4 border-b-1 border-gray-300">
          <h4 className="text-base font-medium text-gray-900">Create board</h4>
          <button
            className="text-gray-500 hover:text-gray-700 p-1"
            onClick={() => {
              onChangeToggle(false);
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 py-4 pb-0">
          <div className="mb-4 border-b-1 border-gray-300">
            <h4 className="text-sm font-semibold mb-3 text-gray-900">
              Background
            </h4>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {backgrounds.map((bg, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedBg(idx)}
                  className="relative aspect-video rounded-lg overflow-hidden group "
                >
                  <img
                    src={bg}
                    alt=""
                    className="w-full h-full object-cover border-0 rounded-[5px]"
                  />
                  {selectedBg === idx && (
                    <div className="absolute inset-0 bg-opacity-20 flex items-center justify-center">
                      <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <Check
                          size={12}
                          className="text-gray-900"
                          strokeWidth={3}
                        />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4 border-b-1 border-gray-300">
            <h4 className="text-sm font-semibold mb-3 text-gray-900">Color</h4>
            <div className="grid grid-cols-6 gap-2  mb-4">
              {colors.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(idx)}
                  className="aspect-video relative flex items-center justify-center  p-[2px] w-[69px] h-[44px]"
                >
                  <div
                    className="w-full h-full rounded-md"
                    style={{ backgroundColor: color }}
                  ></div>

                  {selectedColor === idx && (
                    <div className="absolute w-5 h-5 bg-white rounded-full flex items-center justify-center">
                      <Check
                        size={12}
                        className="text-gray-900"
                        strokeWidth={3}
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Board Title Section */}
          <div className="  border-b-1 border-gray-300 mb-4">
            <h4 className="text-sm font-semibold mb-2 block text-gray-900">
              Board title <span className="text-red-500">*</span>
            </h4>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setShowError(false);
              }}
              placeholder="E.g. Shopping list for birthday..."
              className="w-full mb-2 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {showError && (
              <p className="text-smflex items-start gap-1 ">
                <span>👋</span>
                <span>Please provide a valid board title.</span>
              </p>
            )}
          </div>

          {/* Buttons */}
        </div>
        <div className="flex justify-end gap-2 p-[16.5px]">
          <Button
            variant="outline-danger"
            onClick={() => {
              onChangeToggle(false);
            }}
          >
            {" "}
            Close
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => {
              handleCreate();
              onChangeToggle(false);
            }}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}
