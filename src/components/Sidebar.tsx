
import { useState } from "react";
import { Folder, File, RotateCw, Brain } from "lucide-react";
import { mockApi, FileNode } from "@/utils/mockApi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTheme } from "@/context/ThemeContext";

interface SidebarProps {
  files: FileNode[];
  onFileClick: (path: string) => void;
  refreshFiles: () => void;
}

const Sidebar = ({ files, onFileClick, refreshFiles }: SidebarProps) => {
  const { theme } = useTheme();
  
  const handleGithubSync = async () => {
    try {
      toast.loading("Syncing with GitHub...");
      const result = await mockApi.githubSync();
      toast.success(result.message);
      refreshFiles();
    } catch (error) {
      toast.error("Failed to sync with GitHub");
    }
  };
  
  const handleSelfReflect = async () => {
    try {
      toast.loading("Running self-reflection...");
      const result = await mockApi.selfReflect();
      toast.success(result.message);
    } catch (error) {
      toast.error("Self-reflection failed");
    }
  };
  
  const renderFileTree = (nodes: FileNode[]) => {
    return (
      <ul className="list-none pl-4">
        {nodes.map((node, index) => (
          <FileTreeNode 
            key={index} 
            node={node} 
            onFileClick={onFileClick} 
          />
        ))}
      </ul>
    );
  };
  
  return (
    <div className={`w-full h-full overflow-auto p-4 ${theme === "dark" ? "bg-agent-dark" : "bg-agent-light border-r"}`}>
      <h2 className="font-bold text-lg mb-4 flex items-center">
        <Folder className="mr-2" size={20} />
        Project Files
      </h2>
      
      <div className="mb-4 max-h-[calc(100vh-250px)] overflow-auto">
        {renderFileTree(files)}
      </div>
      
      <div className="flex flex-col gap-2 mt-4">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center" 
          onClick={handleGithubSync}
        >
          <RotateCw className="mr-2" size={16} />
          GitHub Sync
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center" 
          onClick={handleSelfReflect}
        >
          <Brain className="mr-2" size={16} />
          Self-Reflect
        </Button>
      </div>
    </div>
  );
};

interface FileTreeNodeProps {
  node: FileNode;
  onFileClick: (path: string) => void;
}

const FileTreeNode = ({ node, onFileClick }: FileTreeNodeProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpanded = () => {
    if (node.type === 'folder') {
      setExpanded(!expanded);
    }
  };
  
  const handleClick = () => {
    if (node.type === 'file' && node.path) {
      onFileClick(node.path);
    } else if (node.type === 'folder') {
      toggleExpanded();
    }
  };
  
  return (
    <li className="py-1">
      <div 
        className={`flex items-center ${node.type === 'file' ? 'cursor-pointer hover:text-blue-400' : 'cursor-pointer font-medium'}`}
        onClick={handleClick}
      >
        {node.type === 'folder' ? (
          <>
            <Folder size={16} className="mr-2 text-yellow-500" />
            <span>{node.name}</span>
          </>
        ) : (
          <>
            <File size={16} className="mr-2 text-agent-muted" />
            <span className="text-agent-muted">{node.name}</span>
          </>
        )}
      </div>
      
      {node.type === 'folder' && expanded && node.children && (
        <ul className="list-none pl-4 mt-1">
          {node.children.map((childNode, index) => (
            <FileTreeNode 
              key={index} 
              node={childNode} 
              onFileClick={onFileClick} 
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default Sidebar;
