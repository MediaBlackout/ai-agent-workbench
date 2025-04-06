
import { History } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface HistoryItem {
  task: string;
  output: string;
}

interface HistorySectionProps {
  historyItems: HistoryItem[];
  onHistoryItemClick: (item: HistoryItem) => void;
}

const HistorySection = ({ historyItems, onHistoryItemClick }: HistorySectionProps) => {
  const { theme } = useTheme();
  
  if (historyItems.length === 0) {
    return null;
  }
  
  const backgroundColorClass = theme === "dark" ? "bg-agent-terminal" : "bg-gray-100";
  const borderColorClass = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const textColorClass = theme === "dark" ? "text-agent-muted" : "text-gray-600";
  
  return (
    <div className="mt-8">
      <h3 className="font-bold text-lg mb-2 flex items-center">
        <History className="mr-2" size={18} />
        History
      </h3>
      
      <div className={`p-4 rounded-lg border ${backgroundColorClass} ${borderColorClass}`}>
        {historyItems.slice().reverse().map((item, index) => (
          <div 
            key={index}
            className={`py-2 cursor-pointer hover:opacity-80 ${textColorClass} border-b last:border-b-0 border-dashed ${borderColorClass}`}
            onClick={() => onHistoryItemClick(item)}
          >
            #{historyItems.length - index} — {item.task.substring(0, 50)}{item.task.length > 50 ? '...' : ''}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorySection;
