import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { FaIdCard, FaKeyboard, FaInfoCircle, FaMousePointer, FaSync, FaArrowRight } from "react-icons/fa";
import api from "../../common/api";

const RfidScannerComponent = ({ onScanComplete }) => {
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualRfid, setManualRfid] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState(null);
  const [scanBuffer, setScanBuffer] = useState("");
  const [lastKeypressTime, setLastKeypressTime] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [currentInstruction, setCurrentInstruction] = useState(0);
  const rfidInputRef = useRef(null);
  const controls = useAnimation();
  // Buffer timeout in milliseconds - adjust if needed
  const BUFFER_TIMEOUT = 500;

  // Instructions data
  const instructions = [
    {
      title: "Click & Scan",
      description: "Simply click on the animated card icon to activate the scanner, then scan your RFID card.",
      icon: <FaMousePointer className="text-blue-500" size={24} />
    },
    {
      title: "Switch Modes & Scan",
      description: "If you're in Manual Mode, click on Scan Mode to switch back, then scan your RFID card.",
      icon: <FaArrowRight className="text-purple-500" size={24} />
    },
    {
      title: "Refresh & Scan",
      description: "After refreshing the page, the scanner is automatically ready. Just scan your RFID card.",
      icon: <FaSync className="text-green-500" size={24} />
    }
  ];

  // Animation for the card icon
  useEffect(() => {
    const pulseAnimation = async () => {
      while (true) {
        await controls.start({
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
          transition: { duration: 2, ease: "easeInOut" }
        });
      }
    };
    
    pulseAnimation();
  }, [controls]);

  // Auto-cycle through instructions
  useEffect(() => {
    if (!showInstructions) return;
    
    const interval = setInterval(() => {
      setCurrentInstruction(prev => (prev + 1) % instructions.length);
    }, 5000); // Change instruction every 5 seconds
    
    return () => clearInterval(interval);
  }, [showInstructions, instructions.length]);

  // Focus on the hidden input when component mounts
  useEffect(() => {
    if (!isManualMode && rfidInputRef.current) {
      rfidInputRef.current.focus();
    }
  }, [isManualMode]);
  
  // Add a global click event listener to refocus when in scan mode
  useEffect(() => {
    // Only add the listener when in scan mode
    if (isManualMode) return;
    
    const handleClick = () => {
      // Check if we're still in scan mode before focusing
      if (!isManualMode && rfidInputRef.current) {
        rfidInputRef.current.focus();
      }
    };
    
    // Add event listener to document
    document.addEventListener('mousedown', handleClick);
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [isManualMode]);

  // Process buffer after timeout
  useEffect(() => {
    if (!scanBuffer || scanBuffer.length === 0) return;
    
    const currentTime = new Date().getTime();
    
    // If we haven't received input for BUFFER_TIMEOUT ms, process the buffer
    if (lastKeypressTime && (currentTime - lastKeypressTime > BUFFER_TIMEOUT)) {
      if (scanBuffer.trim()) {
        handleRfidScan(scanBuffer.trim());
      }
      setScanBuffer("");
    }
    
    // Set up the timeout to check again
    const timeoutId = setTimeout(() => {
      const newCurrentTime = new Date().getTime();
      if (lastKeypressTime && (newCurrentTime - lastKeypressTime > BUFFER_TIMEOUT)) {
        if (scanBuffer.trim()) {
          handleRfidScan(scanBuffer.trim());
        }
        setScanBuffer("");
      }
    }, BUFFER_TIMEOUT + 50);
    
    return () => clearTimeout(timeoutId);
  }, [scanBuffer, lastKeypressTime]);

  // Handle RFID scan
  const handleRfidScan = async (rfid) => {
    try {
      setIsScanning(true);
      
      const response = await api.post("/api/v1/attendance/scan", { rfid });
      
      setLastScan({
        student: response.data.data.student,
        name: response.data.data.name,
        time: new Date(),
        type: response.data.data.checkOut ? "check-out" : "check-in"
      });
      
      toast.success(response.data.message);
      
      // Call the onScanComplete callback if it exists
      if (onScanComplete && typeof onScanComplete === 'function') {
        onScanComplete();
      }
    } catch (error) {
      console.error("Error processing RFID scan:", error);
      toast.error(error?.response?.data?.message || "Failed to process RFID scan");
    } finally {
      setIsScanning(false);
      setManualRfid("");
      setScanBuffer("");
      
      // Refocus on the hidden input after processing
      if (!isManualMode && rfidInputRef.current) {
        rfidInputRef.current.focus();
      }
    }
  };

  // Handle hidden input change (automatic mode)
  const handleHiddenInputChange = (e) => {
    // Don't prevent default here to allow input to work normally
    const value = e.target.value;
    
    // Update the buffer with the new input
    setScanBuffer(value);
    setLastKeypressTime(new Date().getTime());
    
    // Don't clear the input here - let the buffer processing handle it
  };

  // Handle key press for automatic mode
  const handleKeyPress = (e) => {
    // If Enter key is pressed, process immediately
    if (e.key === 'Enter' && scanBuffer.trim()) {
      handleRfidScan(scanBuffer.trim());
      setScanBuffer("");
      e.target.value = ""; // Clear the input after processing
    }
  };

  // Handle manual form submission
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualRfid.trim()) {
      handleRfidScan(manualRfid.trim());
    } else {
      toast.error("Please enter an RFID number");
    }
  };

  // Handle scan area click to focus input
  const handleScanAreaClick = (e) => {
    // Stop propagation to prevent the document click handler from firing
    e.stopPropagation();
    
    // Focus the input
    if (!isManualMode && rfidInputRef.current) {
      rfidInputRef.current.focus();
    }
  };

  // Toggle instructions visibility
  const toggleInstructions = () => {
    setShowInstructions(prev => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">RFID Attendance System</h2>
      
      {/* Help Button */}
      <button 
        onClick={toggleInstructions}
        className="absolute top-16 right-4 cursor-pointer bg-white p-2 rounded-full shadow-md hover:bg-blue-50 transition-colors"
        aria-label="Show scanning instructions"
      >
        <FaInfoCircle size={24} className="text-blue-600" /> 
      </button>
      
      {/* Animated Instructions Panel */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 mb-6 border-l-4 border-blue-500"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">How to Scan Your Card</h3>
              <button 
                onClick={toggleInstructions}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                aria-label="Close instructions"
              >
                ×
              </button>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentInstruction}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="flex items-start space-x-4"
              >
                <div className="p-3 bg-blue-50 rounded-full">
                  {instructions[currentInstruction].icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {instructions[currentInstruction].title}
                  </h4>
                  <p className="text-gray-600">
                    {instructions[currentInstruction].description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Instruction Navigation Dots */}
            <div className="flex justify-center space-x-2 mt-4">
              {instructions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentInstruction(index)}
                  className={`w-2 h-2 cursor-pointer rounded-full ${currentInstruction === index ? 'bg-blue-600' : 'bg-gray-300'}`}
                  aria-label={`View instruction ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mode Toggle */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setIsManualMode(false)}
          className={`px-4 py-2 rounded-lg flex items-center cursor-pointer ${!isManualMode 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-700'}`}
        >
          <FaIdCard className="mr-2" /> Scan Mode
        </button>
        <button
          onClick={() => setIsManualMode(true)}
          className={`px-4 py-2 rounded-lg flex items-center cursor-pointer ${isManualMode 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-700'}`}
        >
          <FaKeyboard className="mr-2" /> Manual Mode
        </button>
      </div>
      
      {/* Automatic Scan Mode */}
      {!isManualMode && (
        <div 
          className="flex flex-col items-center w-full cursor-pointer"
          onClick={handleScanAreaClick}
        >
          <motion.div
            animate={controls}
            className="w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mb-6 relative"
          >
            <FaIdCard className="text-white animate-bounce" size={80} />
            {/* Subtle hint */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="absolute -bottom-6 text-sm font-medium text-blue-700 bg-white px-3 py-1 rounded-full shadow-sm"
            >
              Click to activate
            </motion.div>
          </motion.div>
          
          <p className="text-lg text-center text-gray-700 mb-4">
            Please scan your RFID card
          </p>
          
          {/* Hidden input to capture RFID scans */}
          <input
            ref={rfidInputRef}
            type="text" 
            className="opacity-0 position-absolute h-0 w-0"
            onChange={handleHiddenInputChange}
            onKeyPress={handleKeyPress}
            autoFocus
          />
        </div>
      )}
      
      {/* Manual Entry Mode */}
      {isManualMode && (
        <form onSubmit={handleManualSubmit} className="w-full max-w-md">
          <div className="flex flex-col mb-6">
            <label className="mb-2 text-gray-700 font-medium">RFID Number</label>
            <input
              type="text"
              value={manualRfid}
              onChange={(e) => setManualRfid(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter RFID number"
              autoFocus
            />
          </div>
          
          <button
            type="submit"
            disabled={isScanning}
            className="w-full py-3 bg-gradient-to-r cursor-pointer from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
          >
            {isScanning ? "Processing..." : "Submit"}
          </button>
        </form>
      )}
      
      {/* Last Scan Information */}
      {lastScan && (
        <div className="mt-8 p-4 bg-white rounded-lg shadow-md w-full max-w-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Last Scan</h3>
          <p className="text-gray-700"><span className="font-medium">Student:</span> {lastScan?.name}</p>
          <p className="text-gray-700"><span className="font-medium">Time:</span> {lastScan.time.toLocaleTimeString()}</p>
          <p className="text-gray-700">
            <span className="font-medium">Type:</span> 
            <span className={lastScan.type === "check-in" ? "text-green-600" : "text-red-600"}>
              {lastScan.type === "check-in" ? "Check In" : "Check Out"}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default RfidScannerComponent;