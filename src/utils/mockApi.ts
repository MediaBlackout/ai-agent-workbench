
interface TaskRequest {
  task: string;
  model: string;
  enable_function_calling: boolean;
  enable_tracing: boolean;
  batch_mode: boolean;
  enable_web_access: boolean;
}

interface EditConfirmation {
  script: string;
  content: string;
}

interface TaskResponse {
  message?: string;
  output?: string;
  tokens?: number;
  openai_raw?: any;
  status?: string;
  script?: string;
  content?: string;
}

// Mock file structure
export interface FileNode {
  name: string;
  type: "file" | "folder";
  path?: string;
  children?: FileNode[];
}

const mockFiles: FileNode[] = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "components",
        type: "folder",
        children: [
          { name: "Header.tsx", type: "file", path: "src/components/Header.tsx" },
          { name: "Sidebar.tsx", type: "file", path: "src/components/Sidebar.tsx" },
          { name: "TaskInput.tsx", type: "file", path: "src/components/TaskInput.tsx" }
        ]
      },
      {
        name: "pages",
        type: "folder",
        children: [
          { name: "Index.tsx", type: "file", path: "src/pages/Index.tsx" },
          { name: "About.tsx", type: "file", path: "src/pages/About.tsx" }
        ]
      },
      { name: "App.tsx", type: "file", path: "src/App.tsx" },
      { name: "main.tsx", type: "file", path: "src/main.tsx" }
    ]
  },
  {
    name: "public",
    type: "folder",
    children: [
      { name: "favicon.ico", type: "file", path: "public/favicon.ico" },
      { name: "robots.txt", type: "file", path: "public/robots.txt" }
    ]
  },
  { name: "package.json", type: "file", path: "package.json" },
  { name: "tsconfig.json", type: "file", path: "tsconfig.json" }
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API endpoints
export const mockApi = {
  async sendTask(taskData: TaskRequest): Promise<TaskResponse> {
    await delay(1500); // Simulate API call delay
    
    // Simulate different types of responses
    if (taskData.task.toLowerCase().includes("error")) {
      throw new Error("An error occurred while processing your task");
    }
    
    if (taskData.task.toLowerCase().includes("edit")) {
      return {
        message: "Here's a preview of the requested edit:\n```js\nconst newCode = () => {\n  console.log('Hello world');\n};\n```\nPlease confirm this edit.",
        tokens: 142,
        status: "preview",
        script: "src/components/example.js",
        content: "const newCode = () => {\n  console.log('Hello world');\n};"
      };
    }
    
    const randomTokens = Math.floor(Math.random() * 1000) + 100;
    
    return {
      message: `AI response to: "${taskData.task}"\n\nI've analyzed your request using ${taskData.model}. ${taskData.enable_function_calling ? "Function calling is enabled." : "Function calling is disabled."} ${taskData.enable_web_access ? "I have access to web resources." : "Web access is disabled."}`,
      tokens: randomTokens,
      openai_raw: {
        id: "chatcmpl-mock-" + Date.now(),
        model: taskData.model,
        usage: {
          prompt_tokens: Math.floor(randomTokens / 2),
          completion_tokens: Math.floor(randomTokens / 2),
          total_tokens: randomTokens
        }
      }
    };
  },
  
  async confirmEdit(data: EditConfirmation): Promise<{ success: boolean; message: string }> {
    await delay(800);
    
    return {
      success: true,
      message: "Edit confirmed and saved successfully."
    };
  },
  
  async fetchFiles(): Promise<FileNode[]> {
    await delay(600);
    return mockFiles;
  },
  
  async uploadFile(file: File): Promise<{ success: boolean; message: string; path: string }> {
    await delay(1200);
    
    return {
      success: true,
      message: `File "${file.name}" uploaded successfully.`,
      path: `/uploads/${file.name}`
    };
  },
  
  async githubSync(): Promise<{ success: boolean; message: string }> {
    await delay(2000);
    
    return {
      success: true,
      message: "GitHub sync completed. All files are up to date."
    };
  },
  
  async selfReflect(): Promise<{ success: boolean; message: string }> {
    await delay(1500);
    
    return {
      success: true,
      message: "Self-reflection complete. System is operating at optimal parameters."
    };
  }
};
