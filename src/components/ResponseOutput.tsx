
import { useState, useEffect } from "react";
import { Check, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { mockApi } from "@/utils/mockApi";
import { useTheme } from "@/context/ThemeContext";

interface ResponseOutputProps {
  response: {
    message?: string;
    output?: string;
    tokens?: number;
    openai_raw?: any;
    status?: string;
    script?: string;
    content?: string;
  } | null;
}

const ResponseOutput = ({ response }: ResponseOutputProps) => {
  const { theme } = useTheme();
  const [showRawJson, setShowRawJson] = useState(false);
  const [isConfirmingEdit, setIsConfirmingEdit] = useState(false);
  
  const handleConfirmEdit = async () => {
    if (!response || !response.script || !response.content) return;
    
    setIsConfirmingEdit(true);
    try {
      await mockApi.confirmEdit({
        script: response.script,
        content: response.content
      });
      toast.success("Edit confirmed and saved");
    } catch (error) {
      toast.error("Failed to confirm edit");
    } finally {
      setIsConfirmingEdit(false);
    }
  };
  
  const toggleRawJson = () => {
    setShowRawJson(!showRawJson);
  };
  
  const getResponseContent = () => {
    if (!response) return "Awaiting AI task...";
    return response.message || response.output || JSON.stringify(response, null, 2);
  };
  
  const tokenInfo = response?.tokens 
    ? `🧮 Tokens used: ${response.tokens}`
    : "";
  
  const backgroundColorClass = theme === "dark" ? "bg-agent-terminal" : "bg-gray-100";
  const textColorClass = theme === "dark" ? "text-agent-highlight" : "text-green-600";
  const borderColorClass = theme === "dark" ? "border-gray-700" : "border-gray-300";
  
  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg border whitespace-pre-wrap font-mono text-sm ${backgroundColorClass} ${borderColorClass} ${textColorClass}`}>
        {getResponseContent()}
      </div>
      
      {tokenInfo && (
        <div className={`p-4 rounded-lg border font-mono text-sm ${backgroundColorClass} ${borderColorClass}`}>
          {tokenInfo}
        </div>
      )}
      
      {response?.openai_raw && (
        <>
          <div 
            className="flex items-center gap-2 cursor-pointer text-sm text-blue-500 hover:text-blue-400"
            onClick={toggleRawJson}
          >
            <Search size={16} />
            {showRawJson ? "Hide" : "Show"} Raw OpenAI Output
          </div>
          
          {showRawJson && (
            <div className={`p-4 rounded-lg border whitespace-pre-wrap font-mono text-xs overflow-auto max-h-96 ${backgroundColorClass} ${borderColorClass}`}>
              {JSON.stringify(response.openai_raw, null, 2)}
            </div>
          )}
        </>
      )}
      
      {response?.status === "preview" && (
        <Button 
          className={`animate-pulse w-full ${theme === "dark" ? "bg-green-700 hover:bg-green-600" : ""}`} 
          onClick={handleConfirmEdit}
          disabled={isConfirmingEdit}
        >
          <Check className="mr-2" size={16} />
          {isConfirmingEdit ? "Confirming..." : "Confirm Edit"}
        </Button>
      )}
    </div>
  );
};

export default ResponseOutput;
