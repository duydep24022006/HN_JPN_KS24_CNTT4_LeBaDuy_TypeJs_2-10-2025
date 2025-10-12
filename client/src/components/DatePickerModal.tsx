import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Task } from "../utils/types";

type DatePickerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentTask: Task | null;
  setCurrentTask: React.Dispatch<React.SetStateAction<Task | null>>;
};

type DayInfo = {
  day: number;
  isCurrentMonth: boolean;
  date: Date;
};

type SelectingDate = "start" | "due";

export function DatePickerModal({
  isOpen,
  onClose,
  currentTask,
  setCurrentTask,
}: DatePickerModalProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [selectingDate, setSelectingDate] = useState<SelectingDate>("start");

  useEffect(() => {
    if (isOpen && currentTask) {
      // Chỉ set initial value khi mở modal lần đầu
      if (currentTask.created_at) {
        const date = new Date(currentTask.created_at);
        setStartDate(date);
      } else {
        setStartDate(new Date()); // Mặc định là hôm nay nếu chưa có
      }

      if (currentTask.due_date) {
        const date = new Date(currentTask.due_date);
        setDueDate(date);
      } else {
        setDueDate(new Date());
      }

      setSelectingDate("due"); // Mặc định chọn due date
    }
  }, [isOpen]); // Chỉ depend vào isOpen, không depend vào currentTask

  const monthNames: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek: string[] = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const getDaysInMonth = (date: Date): DayInfo[] => {
    const year: number = date.getFullYear();
    const month: number = date.getMonth();
    const firstDay: number = new Date(year, month, 1).getDay();
    const daysInMonth: number = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth: number = new Date(year, month, 0).getDate();

    const days: DayInfo[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, daysInPrevMonth - i),
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
      });
    }

    const remainingDays: number = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }

    return days;
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const isSelectedDate = (date: Date): boolean => {
    if (selectingDate === "start" && startDate) {
      return startDate.toDateString() === date.toDateString();
    }
    if (selectingDate === "due" && dueDate) {
      return dueDate.toDateString() === date.toDateString();
    }
    return false;
  };

  const handlePrevMonth = (): void => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = (): void => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleDateClick = (date: Date): void => {
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return;
    }

    if (selectingDate === "start") {
      setStartDate(date);
      if (dueDate) {
        const compareDueDate = new Date(dueDate);
        compareDueDate.setHours(0, 0, 0, 0);
        if (compareDueDate < selectedDate) {
          setDueDate(null);
        }
      }
    } else {
      if (startDate) {
        const compareStartDate = new Date(startDate);
        compareStartDate.setHours(0, 0, 0, 0);

        if (selectedDate >= compareStartDate) {
          setDueDate(date);
        } else {
        }
      } else {
        setDueDate(date);
      }
    }
  };

  const handleSave = (): void => {
    const formattedStartDate = startDate ? startDate.toISOString() : null;
    const formattedDueDate = dueDate ? dueDate.toISOString() : null;

    setCurrentTask((prev: any) => ({
      ...prev,
      due_date: formattedDueDate,
    }));

    onClose();
  };

  const handleRemove = (): void => {
    setDueDate(null);
  };

  if (!isOpen) return null;

  const days: DayInfo[] = getDaysInMonth(currentMonth);

  return (
    <div className="fixed inset-0  ml-130 mt-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-[304px] h-[600px]  shadow-[0px_8px_12px_0px_#091E4226] flex flex-col">
        <div className="flex items-center justify-between px-3 py-2 ">
          <p className="text-[16px] font-semibold text-[#44546F] ml-30 mt-2">
            Dates
          </p>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-0.5 hover:bg-gray-100 rounded"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 px-3 py-2 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft size={16} />
            </button>
            <h4 className="text-xs font-semibold text-gray-800">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h4>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {daysOfWeek.map((day: string) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-600 py-1"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5 mb-3">
            {days.map((dayInfo: DayInfo, index: number) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              const currentDate = new Date(dayInfo.date);
              currentDate.setHours(0, 0, 0, 0);

              const isBeforeToday = currentDate < today;

              let isBeforeStartDate = false;
              if (selectingDate === "due" && startDate) {
                const compareStartDate = new Date(startDate);
                compareStartDate.setHours(0, 0, 0, 0);
                isBeforeStartDate = currentDate < compareStartDate;
              }

              const isDisabled =
                !dayInfo.isCurrentMonth || isBeforeToday || isBeforeStartDate;

              return (
                <button
                  key={index}
                  onClick={() => !isDisabled && handleDateClick(dayInfo.date)}
                  disabled={isDisabled}
                  className={`
                    h-7 flex items-center justify-center text-xs rounded
                    ${
                      !dayInfo.isCurrentMonth ||
                      isBeforeToday ||
                      isBeforeStartDate
                        ? "text-gray-300"
                        : "text-gray-700"
                    }
                    ${
                      isSelectedDate(dayInfo.date)
                        ? "bg-blue-600 text-white font-semibold"
                        : !isDisabled
                        ? "hover:bg-gray-100"
                        : ""
                    }
                    ${!isDisabled ? "cursor-pointer" : "cursor-not-allowed"}
                  `}
                >
                  {dayInfo.day}
                </button>
              );
            })}
          </div>

          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Start date
            </label>
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={true}
                disabled
                className="w-3 h-3 text-blue-600 rounded opacity-50 cursor-not-allowed"
              />
              <input
                type="text"
                value={formatDate(startDate)}
                readOnly
                placeholder="M/D/YYYY"
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs bg-gray-50 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Due date
            </label>
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={dueDate !== null}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.checked) {
                    const newDate =
                      startDate && new Date(startDate) > new Date()
                        ? new Date(startDate)
                        : new Date();
                    setDueDate(newDate);
                    setSelectingDate("due");
                  } else {
                    setDueDate(null);
                  }
                }}
                className="w-3 h-3 text-blue-600 rounded"
              />
              <input
                type="text"
                value={formatDate(dueDate)}
                readOnly
                onClick={() => {
                  if (!dueDate) {
                    const newDate =
                      startDate && new Date(startDate) > new Date()
                        ? new Date(startDate)
                        : new Date();
                    setDueDate(newDate);
                  }
                  setSelectingDate("due");
                }}
                placeholder="M/D/YYYY"
                className={`flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-1 text-xs cursor-pointer ${
                  selectingDate === "due"
                    ? "border-blue-500 ring-1 ring-blue-500"
                    : "border-gray-300"
                }`}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <button
              onClick={handleSave}
              className="w-full py-2 mb-2 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleRemove}
              className="w-full py-2 bg-white text-gray-700 border border-gray-300 rounded text-xs font-medium hover:bg-gray-50 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
