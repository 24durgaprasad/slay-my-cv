import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Particles from "../assets/Particles/Particles";
import { marked } from "marked"; // <-- Import marked

const Response = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  
  // Get the roastData or the error from the navigation state
  const roastData = location.state?.roastData;
  const error = location.state?.error;

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Safely parse the Markdown to HTML with better formatting
  const getHTML = (markdown) => {
    if (!markdown) return;
    
    // Configure marked for better parsing
    marked.setOptions({
      breaks: true, // Convert \n to <br>
      gfm: true, // GitHub flavored markdown
    });
    
    // Pre-process the markdown to break up long paragraphs
    let processedMarkdown = markdown
      // Break up long sentences into separate lines
      .replace(/\. ([A-Z])/g, '.\n\n$1')
      // Add line breaks after question marks and exclamations
      .replace(/[!?] ([A-Z])/g, '$&\n\n')
      // Add spacing before numbered sections
      .replace(/(\d+\.)\s+([A-Z][^:]*:)/g, '\n\n$1 $2\n\n')
      // Break up sentences that are too long (after commas in long sentences)
      .replace(/([^.!?]{60,}),\s+([A-Z])/g, '$1,\n\n$2')
      // Add line breaks around parenthetical content
      .replace(/\(([^)]{20,})\)/g, '\n\n($1)\n\n')
      // Fix spacing around tips
      .replace(/\(Tip:/g, '\n\nTip:')
      // Add breaks before "Instead of"
      .replace(/Instead of/g, '\n\nInstead of')
      // Add breaks before common transition words
      .replace(/(Remember|Think about|Focus on)/g, '\n\n$1')
      // Add line breaks before "In conclusion"
      .replace(/In conclusion/g, '\n\nIn conclusion')
      // Ensure proper spacing around bullet points
      .replace(/\n-\s/g, '\n\n- ')
      // Break up very long lines
      .replace(/([^.\n]{100,})\s+/g, '$1\n\n');
    
    return { __html: marked.parse(processedMarkdown) };
  };

  return (
    <div className="w-full min-h-screen relative bg-black text-white p-4 md:p-8">
      {/* Particles Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Particles /* Your Particle props */ />
      </div>

      {/* Content */}
      <div className={`relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Enhanced Header */}
        <div className="w-full text-center mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
            <Link to="/" className="group flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 md:px-6 py-2 md:py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg text-sm md:text-base">
              <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-semibold">Roast Another CV</span>
            </Link>
            
            <div className="flex items-center space-x-2 text-xl md:text-2xl">
              <span>🔥</span>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                CV ROASTED!
              </h2>
              <span>⚔️</span>
            </div>
            
            <div className="hidden md:block w-32"></div> {/* Spacer for balance - hidden on mobile */}
          </div>
        </div>

        {/* Enhanced Result Display */}
        <div className="w-full roast-response rounded-3xl p-8 md:p-12 border border-gray-600 shadow-2xl">
          {error ? (
            // Enhanced error display
            <div className="text-center fade-in-up">
              <div className="mb-6">
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-red-400 mb-6">Oops! Something went wrong.</h1>
              <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded-2xl p-6">
                <p className="text-xl text-red-200">{error}</p>
              </div>
            </div>
          ) : roastData ? (
            // Enhanced roast display
            <div className="fade-in-up">
              {/* Reading progress indicator */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                  <span className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span>CV Analysis Complete</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Reading time: ~3 min</span>
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <div className="bg-gradient-to-r from-green-400 to-blue-500 h-1 rounded-full" style={{width: '100%'}}></div>
                </div>
              </div>

              {/* Beautiful content wrapper */}
              <div className="roast-content-wrapper">
                <div className="roast-content max-w-none prose prose-invert"
                     dangerouslySetInnerHTML={getHTML(roastData)}
                />
              </div>
              
              {/* Enhanced Action buttons */}
              <div className="flex justify-center space-x-4 mt-12 pt-8 border-t border-gray-600">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(roastData);
                    // Show toast notification
                    const toast = document.createElement('div');
                    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
                    toast.textContent = 'Roast copied to clipboard!';
                    document.body.appendChild(toast);
                    setTimeout(() => document.body.removeChild(toast), 3000);
                  }}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy Roast</span>
                </button>
                
                <button 
                  onClick={() => window.print()}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>Print</span>
                </button>

                <button 
                  onClick={() => {
                    const shareData = {
                      title: 'My CV Roast Results',
                      text: 'Check out my CV roast from Slay My CV!',
                      url: window.location.href
                    };
                    if (navigator.share) {
                      navigator.share(shareData);
                    } else {
                      // Fallback for browsers that don't support Web Share API
                      navigator.clipboard.writeText(window.location.href);
                      const toast = document.createElement('div');
                      toast.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
                      toast.textContent = 'Link copied to clipboard!';
                      document.body.appendChild(toast);
                      setTimeout(() => document.body.removeChild(toast), 3000);
                    }
                  }}
                  className="flex items-center space-x-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          ) : (
            // Enhanced fallback
            <div className="text-center fade-in-up">
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">No roast data found</h2>
              <p className="text-gray-300">Please go back and submit a resume to get roasted!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Response;