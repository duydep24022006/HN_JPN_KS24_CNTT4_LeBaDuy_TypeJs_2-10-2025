import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type DatePickerModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type DayInfo = {
  day: number;
  isCurrentMonth: boolean;
  date: Date;
};

type SelectingDate = "start" | "due";

export function DatePickerModal({ isOpen, onClose }: DatePickerModalProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 2));
  const [startDate, setStartDate] = useState<Date | null>(new Date(2025, 2, 1));
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [selectingDate, setSelectingDate] = useState<SelectingDate>("start");

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
    return selectingDate === "start"
      ? startDate?.toDateString() === date.toDateString()
      : dueDate?.toDateString() === date.toDateString();
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
    if (selectingDate === "start") {
      setStartDate(date);
    } else {
      setDueDate(date);
    }
  };

  const handleSave = (): void => {
    // onSave?.(startDate, dueDate);
    // onClose();
  };

  const handleRemove = (): void => {
    setStartDate(null);
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

          {/* Days of Week */}
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

          {/* Days */}
          <div className="grid grid-cols-7 gap-0.5 mb-3">
            {days.map((dayInfo: DayInfo, index: number) => (
              <button
                key={index}
                onClick={() =>
                  dayInfo.isCurrentMonth && handleDateClick(dayInfo.date)
                }
                disabled={!dayInfo.isCurrentMonth}
                className={`
                  h-7 flex items-center justify-center text-xs rounded
                  ${!dayInfo.isCurrentMonth ? "text-gray-300" : "text-gray-700"}
                  ${
                    isSelectedDate(dayInfo.date)
                      ? "bg-blue-600 text-white font-semibold"
                      : "hover:bg-gray-100"
                  }
                  ${
                    dayInfo.isCurrentMonth ? "cursor-pointer" : "cursor-default"
                  }
                `}
              >
                {dayInfo.day}
              </button>
            ))}
          </div>

          {/* Start Date */}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Start date
            </label>
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={startDate !== null}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (!e.target.checked) {
                    setStartDate(null);
                  } else {
                    setStartDate(new Date());
                  }
                }}
                className="w-3 h-3 text-blue-600 rounded"
              />
              <input
                type="text"
                value={formatDate(startDate)}
                readOnly
                onClick={() => setSelectingDate("start")}
                placeholder="M/D/YYYY"
                className={`flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-1 text-xs cursor-pointer ${
                  selectingDate === "start"
                    ? "border-blue-500 ring-1 ring-blue-500"
                    : "border-gray-300"
                }`}
              />
            </div>
          </div>

          {/* Due Date */}
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
                    setDueDate(new Date());
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
                  if (!dueDate) setDueDate(new Date());
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

          {/* Buttons */}
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
