
import { Globe, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className={`p-4 flex justify-between items-center ${theme === "dark" ? "bg-[#222] text-white" : "bg-gray-100 text-black"}`}>
      <a 
        href="https://mediablackout.ai" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center hover:underline"
      >
        <Globe className="mr-2" size={18} />
        View Mediablackout.ai
      </a>
      
      <Button 
        variant="outline"
        size="sm"
        onClick={toggleTheme}
        className={theme === "dark" ? "bg-transparent text-white border-gray-700" : ""}
      >
        {theme === "dark" ? <Moon className="mr-2" size={16} /> : <Sun className="mr-2" size={16} />}
        Toggle Mode
      </Button>
    </header>
  );
};

export default Header;
