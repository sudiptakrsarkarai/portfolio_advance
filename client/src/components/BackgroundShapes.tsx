
import React from "react";

const BackgroundShapes: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Yellow crescent */}
      <div className="shape animate-float" style={{ top: "10%", left: "15%", transform: "rotate(45deg)" }}>
        <div className="w-16 h-16 bg-portfolio-yellow shape-circle"></div>
      </div>
      
      {/* Red triangle */}
      <div className="shape animate-float" style={{ top: "30%", left: "25%", animationDelay: "1s" }}>
        <div className="w-12 h-12 bg-portfolio-red shape-triangle"></div>
      </div>
      
      {/* Purple line */}
      <div className="shape animate-float" style={{ top: "15%", right: "30%", animationDelay: "1.5s" }}>
        <div className="w-24 h-1 rounded-full bg-portfolio-purple rotate-45"></div>
      </div>
      
      {/* Yellow triangle */}
      <div className="shape animate-float" style={{ top: "35%", right: "15%", animationDelay: "2s" }}>
        <div className="w-8 h-8 bg-portfolio-yellow shape-triangle"></div>
      </div>
      
      {/* Teal curved line */}
      <div className="shape animate-float" style={{ bottom: "20%", left: "25%", animationDelay: "0.5s" }}>
        <div className="w-16 h-16 border-4 border-portfolio-teal rounded-full border-l-0 rotate-45"></div>
      </div>
      
      {/* Blue curved line */}
      <div className="shape animate-float" style={{ bottom: "30%", right: "20%", animationDelay: "2.5s" }}>
        <div className="w-20 h-20 border-4 border-portfolio-blue rounded-full border-r-0"></div>
      </div>
    </div>
  );
};

export default BackgroundShapes;
