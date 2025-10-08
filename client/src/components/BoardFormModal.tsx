import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import Button from "react-bootstrap/esm/Button";
import type { Board } from "../utils/types";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { editBoard, postBoard } from "../services/boardApi";

type Props = {
  offChangeToggle?: (key: boolean) => void;
  isModal: boolean;
  selectedBoard: Board | null;
};

export default function CreateBoardModal({
  offChangeToggle,
  isModal,
  selectedBoard,
}: Props) {
  const backgrounds = [
    "https://res.cloudinary.com/dytn1lbpl/image/upload/v1759734739/image_6_vvfo8r.jpg",
    "https://res.cloudinary.com/dytn1lbpl/image/upload/v1759734758/image_7_rmat4n.jpg",
    "https://res.cloudinary.com/dytn1lbpl/image/upload/v1759734763/image_8_aouypf.jpg",
    "https://res.cloudinary.com/dytn1lbpl/image/upload/v1759734794/image_9_f9nmwq.jpg",
  ];

  const colors = [
    "linear-gradient(135deg,#FFB100, #FA0C00)",
    "linear-gradient(135deg, #2609FF, #D20CFF)",
    "linear-gradient(135deg, #00FF2F, #00FFC8)",
    "linear-gradient(135deg, #00FFE5, #004BFA)",
    "linear-gradient(135deg, #FFA200,#EDFA00)",
    "linear-gradient(135deg, #FF00EA, #FA0C00)",
  ];

  const [selectedBg, setSelectedBg] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [showError, setShowError] = useState(false);
  const currentUserId = Number(localStorage.getItem("currentUserId"));
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (selectedBoard) {
      setShowError(false);
      setTitle(selectedBoard.title);

      if (selectedBoard.backdrop.includes("linear-gradient")) {
        const index = colors.findIndex(
          (item) => item === selectedBoard.backdrop
        );
        if (index !== -1) {
          setSelectedColor(index);
          setSelectedBg(null);
        }
      } else {
        const index = backgrounds.findIndex(
          (item) => item === selectedBoard.backdrop
        );
        if (index !== -1) {
          setSelectedBg(index);
          setSelectedColor(null);
        }
      }
    } else {
      setSelectedBg(0);
      setSelectedColor(null);
      setTitle("");
    }
  }, [selectedBoard]);

  const handleBgSelect = (idx: number) => {
    setSelectedBg(idx);
    setSelectedColor(null);
  };

  const handleColorSelect = (idx: number) => {
    setSelectedColor(idx);
    setSelectedBg(null);
  };

  const handleCreate = () => {
    if (title.trim() === "") {
      setShowError(true);
      return;
    }

    const backdrop =
      selectedBg !== null
        ? backgrounds[selectedBg]
        : selectedColor !== null
        ? colors[selectedColor]
        : backgrounds[0];

    if (selectedBoard !== null) {
      const newBoard: Board = {
        id: selectedBoard.id,
        title,
        backdrop,
        type: selectedBg !== null ? "image" : "color",
      };
      console.log(newBoard);
      dispatch(editBoard(newBoard));

      setShowError(false);
      offChangeToggle?.(false);
      setTitle("");
      setSelectedBg(0);
      setSelectedColor(null);
    } else {
      const newBoard: Board = {
        id: Number(
          `${Date.now().toString().slice(-4)}${Math.floor(
            1000 + Math.random() * 9000
          )}`
        ),
        title,
        backdrop,
        userId: currentUserId,
        type: selectedBg !== null ? "image" : "color",
        is_starred: false,
        is_close: false,
        description: "",
        created_at: new Date().toISOString(),
      };
      console.log(newBoard);
      dispatch(postBoard(newBoard));
      setShowError(false);
      offChangeToggle?.(false);
      setTitle("");
      setSelectedBg(0);
      setSelectedColor(null);
    }
  };

  if (!isModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-500/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-[498px]">
        <div className="flex items-center justify-between px-4 h-[63px] border-b border-gray-300">
          <h4 className="text-base font-medium text-gray-900">
            {selectedBoard !== null ? "Update board" : "Create board"}
          </h4>
          <button
            className="text-gray-500 hover:text-gray-700 p-1"
            onClick={() => offChangeToggle?.(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 py-4 pb-0">
          <div className="mb-4 pb-4 border-b border-gray-300">
            <h4 className="text-sm font-semibold mb-3 text-gray-900">
              Background
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {backgrounds.map((bg, idx) => (
                <button
                  key={idx}
                  onClick={() => handleBgSelect(idx)}
                  className="relative aspect-video rounded-lg overflow-hidden group"
                >
                  <img
                    src={bg}
                    alt=""
                    className="w-full h-full object-cover border-0 rounded-[5px]"
                  />
                  {selectedBg === idx && (
                    <div className="absolute inset-0 flex items-center justify-center">
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

          {/* Color Section */}
          <div className="mb-4 pb-4 border-b border-gray-300">
            <h4 className="text-sm font-semibold mb-3 text-gray-900">Color</h4>
            <div className="grid grid-cols-6 gap-2">
              {colors.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => handleColorSelect(idx)}
                  className="aspect-video relative flex items-center justify-center w-[69px] h-[44px]"
                >
                  <div
                    className="w-full h-full rounded-md"
                    style={{ background: color }}
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

          <div className="pb-4 border-b border-gray-300">
            <label className="text-sm font-semibold mb-2 block text-gray-900">
              Board title <span className="text-red-500">*</span>
            </label>
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
              <p className="text-sm text-red-500 flex items-start gap-1">
                <span>👋</span>
                <span>Please provide a valid board title.</span>
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 p-4">
          <Button
            variant="outline-danger"
            onClick={() => offChangeToggle?.(false)}
          >
            Close
          </Button>
          <Button variant="outline-primary" onClick={handleCreate}>
            {selectedBoard !== null ? "Save" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
