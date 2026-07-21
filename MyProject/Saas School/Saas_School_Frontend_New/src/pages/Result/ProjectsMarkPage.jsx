import React from 'react';
import { useTheme } from "@/context/ThemeContext";
import { Sparkles, Clock, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProjectsMarkPage = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "light"; // Consistent with other components

  return (
    <div className={`min-h-screen pb-16 ${isDarkMode ? "bg-[#0c1425] text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className={`text-xl sm:text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          Projects Mark System
        </h1>
        
        {/* Coming Soon Message */}
        <div className={`relative overflow-hidden rounded-xl border shadow-md p-8 mb-8 ${
          isDarkMode 
            ? "bg-gradient-to-br from-[#162241] to-[#111c38] border-[#1e2a4a]" 
            : "bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100"
        }`}>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-purple-500 opacity-10 animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-indigo-500 opacity-10 animate-pulse" style={{animationDelay: "1s"}}></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-blue-500 opacity-10 animate-pulse" style={{animationDelay: "1.5s"}}></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className={`p-4 rounded-full mb-6 ${
              isDarkMode ? "bg-[#1a2747] text-purple-400" : "bg-purple-100 text-purple-600"
            }`}>
              <Construction className="h-10 w-10" />
            </div>
            
            <h2 className={`text-2xl sm:text-3xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-purple-900"
            }`}>
              Projects Mark System Coming Soon!
            </h2>
            
            <p className={`text-lg max-w-2xl mx-auto mb-8 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}>
              We're building a comprehensive project marking system to help teachers evaluate student projects more effectively. This feature will allow for detailed assessment of project work with customizable rubrics.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isDarkMode ? "bg-[#1a2747] text-blue-300" : "bg-blue-100 text-blue-700"
              }`}>
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Customizable Rubrics</span>
              </div>
              
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isDarkMode ? "bg-[#1a2747] text-green-300" : "bg-green-100 text-green-700"
              }`}>
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Detailed Feedback</span>
              </div>
              
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isDarkMode ? "bg-[#1a2747] text-amber-300" : "bg-amber-100 text-amber-700"
              }`}>
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Progress Tracking</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm font-medium">
              <Clock className={`h-4 w-4 ${
                isDarkMode ? "text-purple-400" : "text-purple-500"
              }`} />
              <span className={
                isDarkMode ? "text-purple-400" : "text-purple-500"
              }>
                Launching Soon
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button
            className={`${isDarkMode ? "bg-[#452B90] hover:bg-[#5a3ab8]" : "bg-purple-600 hover:bg-purple-700"} px-6`}
            onClick={() => window.history.back()}
          >
            Return to Previous Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsMarkPage;