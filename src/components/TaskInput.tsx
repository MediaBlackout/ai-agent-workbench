
import { useState, useRef, useEffect } from "react";
import { Paperclip, Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { mockApi } from "@/utils/mockApi";
import { useTheme } from "@/context/ThemeContext";

interface TaskInputProps {
  onTaskSubmit: (response: any) => void;
}

const TaskInput = ({ onTaskSubmit }: TaskInputProps) => {
  const { theme } = useTheme();
  const [task, setTask] = useState("");
  const [model, setModel] = useState("gpt-4-turbo-preview");
  const [enableFunctionCalling, setEnableFunctionCalling] = useState(true);
  const [enableTracing, setEnableTracing] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [enableWebAccess, setEnableWebAccess] = useState(true);
  const [tokenCount, setTokenCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Simple token estimation (word count)
    const words = task.trim().split(/\s+/);
    setTokenCount(task.trim() === "" ? 0 : words.length);
  }, [task]);
  
  const handleTaskChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTask(e.target.value);
  };
  
  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      try {
        toast.loading(`Uploading ${file.name}...`);
        const result = await mockApi.uploadFile(file);
        toast.success(result.message);
        setTask(prev => {
          const currentText = prev.trim();
          const addition = `\n\nUploaded file: ${result.path}`;
          return currentText ? `${currentText}${addition}` : addition;
        });
      } catch (error) {
        toast.error("Failed to upload file");
      }
      
      // Reset the file input
      e.target.value = "";
    }
  };
  
  const handleToggleMic = () => {
    toast.info("Microphone functionality not yet implemented");
  };
  
  const handleSubmit = async () => {
    if (!task.trim()) {
      toast.error("Please enter a task");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await mockApi.sendTask({
        task,
        model,
        enable_function_calling: enableFunctionCalling,
        enable_tracing: enableTracing,
        batch_mode: batchMode,
        enable_web_access: enableWebAccess
      });
      
      onTaskSubmit(response);
    } catch (error) {
      toast.error("Failed to send task");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={`rounded-lg border ${theme === "dark" ? "bg-agent-terminal border-gray-700" : "bg-white border-gray-300"} p-4`}>
      <div className="space-y-4">
        <div className="relative">
          <Textarea
            value={task}
            onChange={handleTaskChange}
            placeholder="Write your task here or drop a file/audio..."
            className={`min-h-32 resize-y ${theme === "dark" ? "bg-[#222] text-white border-gray-700" : "bg-white text-gray-900"}`}
          />
          <div className="absolute right-3 bottom-3 text-sm text-orange-500 font-mono">
            🧮 Tokens: {tokenCount}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="toggle-function" 
              checked={enableFunctionCalling}
              onCheckedChange={(checked) => setEnableFunctionCalling(!!checked)} 
            />
            <Label htmlFor="toggle-function">Enable Function Calling</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="toggle-tracing" 
              checked={enableTracing}
              onCheckedChange={(checked) => setEnableTracing(!!checked)}
            />
            <Label htmlFor="toggle-tracing">Enable Tracing</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="toggle-batch" 
              checked={batchMode}
              onCheckedChange={(checked) => setBatchMode(!!checked)}
            />
            <Label htmlFor="toggle-batch">Batch Mode</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="toggle-web" 
              checked={enableWebAccess}
              onCheckedChange={(checked) => setEnableWebAccess(!!checked)}
            />
            <Label htmlFor="toggle-web">Web Access</Label>
          </div>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4">gpt-4</SelectItem>
              <SelectItem value="gpt-4-turbo-preview">gpt-4-turbo-preview</SelectItem>
              <SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleFileUpload}
            >
              <Paperclip className="mr-2" size={16} />
              Upload File
            </Button>
            
            <Button 
              variant="outline"
              className="flex-1"
              onClick={handleToggleMic}
            >
              <Mic className="mr-2" size={16} />
              Start/Stop Mic
            </Button>
            
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
          
          <Button 
            className="sm:col-span-2" 
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            <Send className="mr-2" size={16} />
            Send Task
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskInput;
