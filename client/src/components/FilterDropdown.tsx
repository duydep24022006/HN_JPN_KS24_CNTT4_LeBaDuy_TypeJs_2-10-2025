import { X, Clock, CalendarDays, Tag } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import type { Task, Tags } from "../utils/types";

type Props = {
  onClose: () => void;
  isFilter: boolean;
  tasks: Task[] | [];
  onApplyFilter: (filteredTasks: Task[]) => void;
};

export default function FilterDropdown({
  onClose,
  isFilter,
  tasks,
  onApplyFilter,
}: Props) {
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
  const [selectedLabels, setSelectedLabels] = useState<number[]>([]);
  const [selectedLabelsContent, setSelectedLabelsContent] = useState<string>();

  const [noLabels, setNoLabels] = useState(false);

  // useMemo: Tính toán và cache kết quả, chỉ chạy lại khi tasks thay đổi
  // Mục đích: Lấy danh sách tags UNIQUE (không trùng lặp) từ tất cả tasks
  const allTags = useMemo(() => {
    // Map: Cấu trúc dữ liệu lưu key-value, đảm bảo key unique
    const tagMap = new Map<number, Tags>();

    // Duyệt qua từng task
    tasks.forEach((task) => {
      // task.tags?: Nếu task có tags thì duyệt, không có thì bỏ qua (optional chaining)
      task.tags?.forEach((tag) => {
        // Chỉ thêm tag nếu:
        // 1. tag có id
        // 2. id này chưa tồn tại trong Map (!tagMap.has(tag.id))
        if (tag.id && !tagMap.has(tag.id)) {
          tagMap.set(tag.id, tag); // Lưu tag vào Map với key = tag.id
        }
      });
    });

    // Array.from: Chuyển Map thành Array
    // tagMap.values(): Lấy tất cả values (không lấy keys)
    return Array.from(tagMap.values());
  }, [tasks]); // Dependency: chỉ chạy lại khi tasks thay đổi

  // Toggle (bật/tắt) một label trong danh sách đã chọn
  const handleLabelToggle = (labelId: number) => {
    setSelectedLabels(
      (prev) =>
        // prev.includes(labelId): Kiểm tra label đã được chọn chưa
        prev.includes(labelId)
          ? prev.filter((id) => id !== labelId) // Đã chọn -> Bỏ chọn (loại khỏi mảng)
          : [...prev, labelId] // Chưa chọn -> Thêm vào mảng
    );
  };

  // Kiểm tra task có quá hạn không
  const isOverdue = (dueDate: string | undefined) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date(); // So sánh ngày: task < hôm nay = quá hạn
  };

  // Kiểm tra task có hạn sau hôm nay không
  const isDueNextDay = (dueDate: string | undefined) => {
    if (!dueDate) return false;
    const taskDate = new Date(dueDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set thời gian cuối ngày hôm nay
    return taskDate > today; // task > hôm nay = còn hạn
  };

  // HÀM CHÍNH: Áp dụng tất cả bộ lọc
  const applyFilters = () => {
    let filtered = [...tasks]; // Copy mảng tasks (spread operator)

    // BỘ LỌC 1: Keyword (tìm kiếm theo title)
    if (keyword.trim()) {
      // trim(): Xóa khoảng trắng đầu cuối
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    // BỘ LỌC 2: Card status (complete/incomplete)
    if (cardStatus.complete || cardStatus.incomplete) {
      filtered = filtered.filter((task) => {
        // Nếu chọn cả 2 -> hiển thị tất cả
        if (cardStatus.complete && cardStatus.incomplete) return true;
        // Chỉ chọn complete -> chỉ hiển thị task.status = true
        if (cardStatus.complete) return task.status === true;
        // Chỉ chọn incomplete -> chỉ hiển thị task.status = false
        if (cardStatus.incomplete) return task.status === false;
        return true;
      });
    }

    // BỘ LỌC 3: Due date (no dates/overdue/next day)
    if (dueDate.noDates || dueDate.overdue || dueDate.nextDay) {
      filtered = filtered.filter((task) => {
        // Hiển thị task nếu thỏa MỘT trong các điều kiện (OR logic)
        if (dueDate.noDates && !task.due_date) return true; // Không có ngày
        if (dueDate.overdue && isOverdue(task.due_date)) return true; // Quá hạn
        if (dueDate.nextDay && isDueNextDay(task.due_date)) return true; // Còn hạn
        return false; // Không thỏa điều kiện nào -> loại bỏ
      });
    }

    // BỘ LỌC 4: Labels/Tags
    if (noLabels) {
      // Chọn "No labels" -> chỉ hiển thị tasks không có tags
      filtered = filtered.filter(
        (task) => !task.tags || task.tags.length === 0
      );
    } else if (selectedLabels.length > 0) {
      // Có chọn labels -> hiển thị tasks có ÍT NHẤT MỘT label được chọn
      filtered = filtered.filter((task) =>
        // some(): Trả về true nếu ít nhất 1 phần tử thỏa điều kiện
        task.tags?.some((tag) => tag.id && selectedLabels.includes(tag.id))
      );
    }

    // Gọi callback trả kết quả về component cha
    onApplyFilter(filtered);
  };

  // useEffect: Tự động chạy lại applyFilters khi các filter thay đổi
  useEffect(() => {
    applyFilters();
  }, [keyword, cardStatus, dueDate, selectedLabels, noLabels]);

  if (!isFilter) return <></>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[390px] h-[680px] overflow-hidden">
        <div className="flex items-center justify-center relative px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-800">Filter</h3>
          <button
            onClick={onClose}
            className="absolute right-3 text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-3 py-4 max-h-[600px] overflow-y-auto">
          {/* KEYWORD FILTER */}
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

          {/* CARD STATUS FILTER */}
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

          {/* DUE DATE FILTER */}
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
                checked={dueDate.nextDay}
                onChange={(e) =>
                  setDueDate({ ...dueDate, nextDay: e.target.checked })
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

          {/* LABELS FILTER */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Labels
            </label>
            <div className="space-y-2.5">
              {/* No Labels Option */}
              <div className="flex items-center">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-3">
                    <input
                      type="checkbox"
                      checked={noLabels}
                      onChange={(e) => setNoLabels(e.target.checked)}
                      className="w-4 h-4 border border-gray-400 rounded cursor-pointer accent-blue-600"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                        <Tag size={16} className="rotate-270" />
                      </div>
                      <label className="text-sm text-gray-700">No labels</label>
                    </div>
                  </div>

                  {/* Danh sách các tags hiện có */}
                  {allTags.map((tag) => (
                    <div key={tag.id} className="flex gap-3 items-center">
                      <input
                        type="checkbox"
                        checked={
                          tag.id ? selectedLabels.includes(tag.id) : false
                        }
                        onChange={() => tag.id && handleLabelToggle(tag.id)}
                        className="w-4 h-4 border border-gray-400 rounded cursor-pointer accent-blue-600"
                      />
                      <label className="cursor-pointer flex-1">
                        <div
                          className="w-[300px] h-8 rounded flex items-center px-2"
                          style={{ backgroundColor: tag.color || "#10b981" }}
                        >
                          <span className="text-sm font-medium text-white">
                            {tag.content || "Untitled"}
                          </span>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {allTags.length > 0 && (
                <div className="relative">
                  <select
                    onChange={(e) => {
                      const selected = String(e.target.value);
                      const [id, content] = selected.split(",");
                      if (id && !selectedLabels.includes(Number(id))) {
                        setSelectedLabels([...selectedLabels, Number(id)]);
                      }
                      setSelectedLabelsContent(content);
                      e.target.value = "";
                    }}
                    className="w-full px-2.5 py-2 text-sm text-gray-600 border border-gray-300 rounded appearance-none cursor-pointer focus:outline-none bg-white"
                  >
                    <option value="">
                      {selectedLabelsContent || "no select"}
                    </option>
                    {allTags.map((tag) => (
                      <option key={tag.id} value={`${tag.id},${tag.content}`}>
                        {tag.content || "Untitled"}
                      </option>
                    ))}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
