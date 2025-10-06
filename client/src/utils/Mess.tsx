import { Check, CircleMinus } from "lucide-react";
import toast from "react-hot-toast";

export const showError = (mess: string[]): void => {
  toast.custom((t) => (
    <div className="w-72 bg-red-100 border border-red-200 rounded-lg shadow-md p-4 text-sm text-black">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <span className="text-red-600 text-lg mt-0.5">
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <CircleMinus size={18} className="text-white" />
            </div>
          </span>
          <div>
            <p className="flex justify-between items-center font-semibold m-0">
              Error
              <span>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="text-red-600 text-sm hover:text-red-800"
                >
                  ✕
                </button>
              </span>
            </p>
            {mess.map((item, index) => (
              <div key={index}>
                <p className="mt-1 mb-0">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ));
};

export const showSuccess = (key: string) => {
  toast.custom((t) => (
    <div className="w-72 bg-green-50 border border-green-200 rounded-lg shadow-md p-4 text-sm text-black flex items-center gap-2">
      <span className="text-green-600 text-lg">
        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
          <Check size={12} className="text-white" />
        </div>
      </span>
      <p className="m-0">{key}</p>
    </div>
  ));
};
