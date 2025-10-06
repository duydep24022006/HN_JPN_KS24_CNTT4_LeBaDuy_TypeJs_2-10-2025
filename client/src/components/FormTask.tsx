import { useState } from "react";
import { Tag, Clock4, Minus } from "lucide-react";
import InputTask from "./InputTask";
import Swal from "sweetalert2";
import { confirmNotification } from "../utils/ConfirmNotification";
type Props = {
  isShowFormTask: boolean;
  onClose: () => void;
  onShowDate: () => void;
  onShowMoveCard: () => void;
  onShowLabel: () => void;
};
export default function FormTask({
  isShowFormTask,
  onClose,
  onShowDate,
  onShowMoveCard,
  onShowLabel,
}: Props) {
  const [status, setStatus] = useState("IN-PROGRESS");
  const confirm = async (key: string) => {
    const result = await confirmNotification(key);
    if (result) {
      Swal.fire({
        title: key,
        text: `Your file has been deleted.${key}`,
        icon: "success",
      });
    }
  };
  if (!isShowFormTask) return <></>;
  return (
    <div className="  bg-gray-500/50  p-4 fixed z-30 w-full h-full flex justify-center items-center">
      <div className="  bg-white rounded-lg shadow-sm mb-50 mr-20 shadow-[0px_8px_12px_0px_#091E4226]">
        <div className="p-3 ">
          <div className="flex items-start gap-3">
            <input type="radio" checked readOnly className="mt-2 w-6 h-6" />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-[#172B4D] ">
                Kịch bản
              </h2>
              <div className="flex items-center gap-2 text-sm text-[#44546F] font-normal text-[14px]">
                <span>in list</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  onClick={onShowMoveCard}
                  className="  p-1  text-[11px] font-bold bg-[#DCDFE4] text-[#44546F] rounded border-none outline-none cursor-pointer"
                >
                  <option value="IN-PROGRESS">IN-PROGRESS</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-end gap-1 rotate-90">
                <div className="w-0.5 h-6 bg-[#44546F] rounded-[2px]"></div>
                <div className="w-0.5 h-6 bg-[#44546F] rounded-[2px]"></div>
                <div className="w-0.5 h-6 bg-[#44546F] rounded-[2px]"></div>
                <div className="w-0.5 h-4 bg-[#44546F] rounded-[2px]"></div>
              </div>

              <h3 className="text-[16px] font-[600] text-[#172B4D]">
                Description
              </h3>
            </div>

            <div className="!w-[512px] !min-h-[275px] bg-white ml-7">
              <InputTask />
            </div>

            <div className="flex gap-2 mt-[-25px] ml-7">
              <button
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
                onClick={onClose}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded hover:bg-gray-100"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>

          <div className=" ml-15" onClick={onShowLabel}>
            <button className="w-[168px] mb-2 h-[32px] flex items-center gap-3 px-4 py-2 text-sm text-[#172B4D] bg-gray-100 rounded hover:bg-gray-200">
              <Tag className="w-4 h-4 rotate-280" />
              <span>Labels</span>
            </button>

            <button
              className="w-[168px] mb-2 h-[32px] flex items-center gap-3 px-4 py-2 text-sm text-[#172B4D] bg-gray-100 rounded hover:bg-gray-200"
              onClick={onShowDate}
            >
              <Clock4 className="w-4 h-4" />
              <span>Dates</span>
            </button>

            <button
              className="w-[168px] mb-2 h-[32px] flex items-center gap-3 px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
              onClick={() => confirm("delete")}
            >
              <Minus size={20} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
