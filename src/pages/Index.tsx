
import { useState, useEffect } from "react";
import { Brain } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import TaskInput from "@/components/TaskInput";
import ResponseOutput from "@/components/ResponseOutput";
import HistorySection from "@/components/HistorySection";
import { ThemeProvider } from "@/context/ThemeContext";
import { mockApi, FileNode } from "@/utils/mockApi";
import { toast } from "sonner";

interface HistoryItem {
  task: string;
  output: string;
}

const Index = () => {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [response, setResponse] = useState<any>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchFiles();
  }, []);
  
  const fetchFiles = async () => {
    try {
      setLoading(true);
      const fileData = await mockApi.fetchFiles();
      setFiles(fileData);
    } catch (error) {
      toast.error("Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileClick = (path: string) => {
    const taskInput = document.querySelector("textarea");
    if (taskInput) {
      const currentText = (taskInput as HTMLTextAreaElement).value.trim();
      const newText = currentText 
        ? `${currentText}\n\nTarget file: ${path}` 
        : `Target file: ${path}`;
      (taskInput as HTMLTextAreaElement).value = newText;
      (taskInput as HTMLTextAreaElement).focus();
    }
  };
  
  const handleTaskSubmit = (resp: any) => {
    setResponse(resp);
    
    // Add to history
    if (resp.message || resp.output) {
      const output = resp.message || resp.output || JSON.stringify(resp);
      const taskInput = document.querySelector("textarea");
      const task = taskInput ? (taskInput as HTMLTextAreaElement).value : "";
      
      setHistory(prev => [
        ...prev,
        {
          task,
          output
        }
      ]);
    }
  };
  
  const handleHistoryItemClick = (item: HistoryItem) => {
    // Set the textarea value to the history item's task
    const taskInput = document.querySelector("textarea");
    if (taskInput) {
      (taskInput as HTMLTextAreaElement).value = item.task;
    }
    
    // Set the response to show the history item's output
    setResponse({
      message: item.output
    });
  };
  
  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen">
        <Header />
        
        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/5 min-w-[250px] max-w-[300px] border-r border-gray-700 hidden md:block overflow-y-auto">
            <Sidebar 
              files={files} 
              onFileClick={handleFileClick}
              refreshFiles={fetchFiles}
            />
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-6 flex items-center">
                <Brain className="mr-3" size={28} />
                AI Task
              </h1>
              
              <TaskInput onTaskSubmit={handleTaskSubmit} />
              
              <div className="mt-6">
                <ResponseOutput response={response} />
              </div>
              
              <HistorySection 
                historyItems={history}
                onHistoryItemClick={handleHistoryItemClick}
              />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
