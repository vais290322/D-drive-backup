// import React, { useState } from "react";

// const ChatWithSupport = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       sender: "support",
//       text: "Hey! How can we help you? 😊\n\nUntil one of our developers responds, please check out our Helpdesk (https://vaisacademy.com/) for more information.\n\nWe are a team based in India, so it can take up to 24 hours for a response depending on your timezone.\n\nCheers!",
//     },
//   ]);
//   const [input, setInput] = useState("");

//   const handleSendMessage = () => {
//     if (input.trim() !== "") {
//       setMessages([...messages, { sender: "user", text: input }]);
//       setInput("");
//     }
//   };

//   return (
//     <div className="fixed bottom-20 right-8">
//       {/* Floating Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="bg-purple-500 text-white p-3 rounded-full shadow-lg hover:bg-purple-600 focus:outline-none"
//       >
//         💬
//       </button>

//       {/* Chatbox */}
//       {isOpen && (
//         <div className="w-96 h-[500px] bg-white rounded-lg shadow-lg overflow-hidden flex flex-col mt-2 border border-gray-200">
//           {/* Header */}
//           <div className="bg-purple-500 text-white p-4 flex items-center justify-between">
//             <div>
//               <h2 className="text-lg font-bold">Chat with Support</h2>
//               <p className="text-sm">Last active 5 hours ago</p>
//             </div>
//             <div className="flex space-x-2">
              
//               <button className="w-8 h-8 bg-white text-purple-500 rounded-full flex items-center justify-center shadow">
//                 ▶
//               </button>
//             </div>
//           </div>

//           {/* Messages Area */}
//           <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`flex ${
//                   msg.sender === "user" ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`px-4 py-2 rounded-lg text-sm whitespace-pre-wrap ${
//                     msg.sender === "user"
//                       ? "bg-blue-500 text-white"
//                       : "bg-gray-200 text-black"
//                   }`}
//                 >
//                   {msg.text}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Input Area */}
//           <div className="p-4 bg-gray-100 flex items-center gap-2">
//             <input
//               type="text"
//               className="flex-grow border rounded-lg px-4 py-2 focus:outline-none"
//               placeholder="Compose your message..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//             />
//             <button
//               className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
//               onClick={handleSendMessage}
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatWithSupport;


// 2nd version 

// import React, { useState } from "react";
// import axios from "axios";

// const ChatWithSupport = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       sender: "support",
//       text: "Hey! How can we help you? 😊\n\nUntil one of our developers responds, please check out our Helpdesk (https://vaisacademy.com/) for more information.\n\nWe are a team based in India, so it can take up to 24 hours for a response depending on your timezone.\n\nCheers!",
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSendMessage = async () => {
//     if (input.trim() === "") return;

//     // Add the user's message to the chat
//     const newMessages = [...messages, { sender: "user", text: input }];
//     setMessages(newMessages);
//     setInput("");
//     setLoading(true);

//     try {
//       // Send the message to the API
//       const response = await axios.post("http://192.168.0.141:5000/chat", {
//         message: input,
//       });
//     //   console.log("Response:", response);
//       // Add the bot's reply to the chat
//       setMessages([
//         ...newMessages,
//         { sender: "support", text: response.data.reply },
//       ]);
//     } catch (error) {
//       console.error("Error sending message:", error);
//       // Handle errors (e.g., show an error message in the chat)
//       setMessages([
//         ...newMessages,
//         {
//           sender: "support",
//           text: "Oops! Something went wrong. Please try again later.",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed bottom-20 right-8">
//       {/* Floating Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="bg-purple-500 text-white p-3 rounded-full shadow-lg hover:bg-purple-600 focus:outline-none"
//       >
//         💬
//       </button>

//       {/* Chatbox */}
//       {isOpen && (
//         <div className="w-96 h-[500px] bg-white rounded-lg shadow-lg overflow-hidden flex flex-col mt-2 border border-gray-200">
//           {/* Header */}
//           <div className="bg-purple-500 text-white p-4 flex items-center justify-between">
//             <div>
//               <h2 className="text-lg font-bold">Chat with Support</h2>
//               <div className="flex gap-2">
//                 <div className="w-4 h-4 bg-green-500 rounded-full"></div>
//                 <div className="w-4 h-4 bg-red-500 rounded-full"></div>
//                 <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
//                 <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
//                 <div className="w-4 h-4 bg-sky-500 rounded-full"></div>
//                 <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
//                 <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
//               </div>
//             </div>
//             <div className="flex space-x-2">
//               <button className="w-8 h-8 bg-white text-purple-500 rounded-full flex items-center justify-center shadow">
//                 ▶
//               </button>
//             </div>
//           </div>

//           {/* Messages Area */}
//           <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`flex ${
//                   msg.sender === "user" ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`px-4 py-2 rounded-lg text-sm whitespace-pre-wrap ${
//                     msg.sender === "user"
//                       ? "bg-blue-500 text-white"
//                       : "bg-gray-200 text-black"
//                   }`}
//                 >
//                   {msg.text}
//                 </div>
//               </div>
//             ))}
//             {loading && (
//               <div className="flex justify-start">
//                 <div className="px-4 py-2 rounded-lg text-sm bg-gray-200 text-black">
//                   Typing...
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Input Area */}
//           <div className="p-4 bg-gray-100 flex items-center gap-2">
//             <form onSubmit={(e) => {e.preventDefault(), handleSendMessage()}} className="w-full flex items-center gap-2"> 
//             <input
//               type="text"
//               className="flex-grow border rounded-lg px-4 py-2 focus:outline-none"
//               placeholder="Compose your message..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//             />
//             <button
//               className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
//               type="submit"
//               disabled={loading}
//             >
//               {loading ? "Sending..." : "Send"}
//             </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatWithSupport;

// 3rd veersion 

// import React, { useState } from "react";
// import axios from "axios";
// import { GoTriangleRight } from "react-icons/go";

// const ChatWithSupport = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       sender: "support",
//       text: "Hey! How can we help you? 😊\n\nUntil one of our developers responds, please check out our Helpdesk (https://vaisacademy.com/) for more information.\n\nWe are a team based in India, so it can take up to 24 hours for a response depending on your timezone.\n\nCheers!",
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [themeColor, setThemeColor] = useState("purple"); // Default theme color

//   const handleSendMessage = async () => {
//     if (input.trim() === "") return;

//     const newMessages = [...messages, { sender: "user", text: input }];
//     setMessages(newMessages);
//     setInput("");
//     setLoading(true);

//     try {
//       const response = await axios.post("http://192.168.0.141:5000/chat", {
//         message: input,
//       });
//       setMessages([
//         ...newMessages,
//         { sender: "support", text: response.data.reply },
//       ]);
//     } catch (error) {
//       console.error("Error sending message:", error);
//       setMessages([
//         ...newMessages,
//         {
//           sender: "support",
//           text: "Oops! Something went wrong. Please try again later.",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const colorOptions = [
//     "green",
//     "red",
//     "yellow",
//     "blue",
//     "sky",
//     "indigo",
//     "amber",
//     "purple",
//   ];

//   return (
//     <div className="fixed bottom-20 right-8">
//       {/* Floating Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className={`bg-${themeColor}-500 text-white p-3 rounded-full shadow-lg hover:bg-${themeColor}-600 focus:outline-none`}
//       >
//         💬
//       </button>

//       {/* Chatbox */}
//       {isOpen && (
//         <div className="w-96 h-[500px] bg-white rounded-lg shadow-lg overflow-hidden flex flex-col mt-2 border border-gray-200">
//           {/* Header */}
//           <div
//             className={`bg-${themeColor}-500 text-white p-4 flex items-center justify-between`}
//           >
//             <div>
//               <h2 className="text-lg font-bold">Chat with Support</h2>
//               <div className="flex gap-2 mt-2">
//                 {colorOptions.map((color) => (
//                   <div
//                     key={color}
//                     className={`w-4 h-4 bg-${color}-500 rounded-full cursor-pointer`}
//                     onClick={() => setThemeColor(color)}
//                     title={`Set theme to ${color}`}
//                   ></div>
//                 ))}
//               </div>
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 className={`w-8 h-8 bg-white text-${themeColor}-500 rounded-full flex items-center justify-center shadow`}
//               >
//                 <GoTriangleRight className="w-8 h-8"/>
//               </button>
//             </div>
//           </div>

//           {/* Messages Area */}
//           <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`flex ${
//                   msg.sender === "user" ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`px-4 py-2 rounded-lg text-sm whitespace-pre-wrap ${
//                     msg.sender === "user"
//                       ? `bg-${themeColor}-500 text-white`
//                       : "bg-gradient-to-r from-[#84fab0] to-[#8fd3f4] text-black"
//                   }`}
//                 >
//                   {msg.text}
//                 </div>
//               </div>
//             ))}
//             {loading && (
//               <div className="flex justify-start">
//                 <div className="px-4 py-2 rounded-lg text-sm bg-gray-200 text-black">
//                   Typing...
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Input Area */}
//           <div className="p-4 bg-gray-100 flex items-center gap-2">
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleSendMessage();
//               }}
//               className="w-full flex items-center gap-2"
//             >
//               <input
//                 type="text"
//                 className="flex-grow border rounded-lg px-4 py-2 focus:outline-none"
//                 placeholder="Compose your message..."
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//               />
//               <button
//                 className={`bg-${themeColor}-500 text-white px-4 py-2 rounded-lg hover:bg-${themeColor}-600`}
//                 type="submit"
//                 disabled={loading}
//               >
//                 {loading ? "Sending..." : "Send"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatWithSupport;


// 4th version 

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { GoTriangleRight } from "react-icons/go";
import Lottie from "lottie-react";
import chatbot from "../../assets/chatbot.json";
import chatbot1 from "../../assets/chatbot1.json";
import chatbot2 from "../../assets/chatbot2.json";
import cross from "../../assets/cross.json";
import cross2 from "../../assets/cross2.json";

const ChatWithSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "support",
      text: "Hey! How can we help you? 😊\n\nUntil one of our developers responds, please check out our Helpdesk (https://vais.co.in) for more information.\n\nCheers!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [themeColor, setThemeColor] = useState("purple"); // Default theme color

  const messagesEndRef = useRef(null); // Ref to scroll into view

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://147.93.116.69:5000/chat", {
        message: input,
      });
      setMessages([
        ...newMessages,
        { sender: "support", text: response.data.reply },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([
        ...newMessages,
        {
          sender: "support",
          text: "Oops! Something went wrong. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll to the bottom whenever messages change

  const colorOptions = [
    "green",
    "red",
    "yellow",
    "blue",
    "sky",
    "indigo",
    "amber",
    "purple",
  ];

  return (
    <div className="fixed bottom-20 right-0">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        // className={`bg-${themeColor}-500 text-white p-3 rounded-full shadow-lg hover:bg-${themeColor}-600 focus:outline-none`}
      >
  
        {/* <Lottie animationData={isOpen ? cross : chatbot1} className='w-40 h-40 ' /> */}
        {/* <Lottie animationData={cross} className='w-36 h-36 ' /> */}

        {isOpen ? (
          <Lottie animationData={cross2} className="w-96 h-20" />
        ) : (
          <Lottie animationData={chatbot1} className="w-40 h-40" />
        )}



      </button>

      {/* Chatbox */}
      {isOpen && (
        <div className="w-72 sm:w-96 h-[70vh] bg-white rounded-lg shadow-lg overflow-hidden flex flex-col mt-2 border  border-[#ac24f4] ">
          {/* Header */}
          <div
            className={`bg-${themeColor}-500 text-white p-4 flex items-center justify-between`}
          >
            <div>
              <h2 className="text-lg font-bold">Chat with Support</h2>
              <div className="flex gap-2 mt-2">
                {colorOptions.map((color) => (
                  <div
                    key={color}
                    className={`w-4 h-4 bg-${color}-500 rounded-full cursor-pointer`}
                    onClick={() => setThemeColor(color)}
                    title={`Set theme to ${color}`}
                  ></div>
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                className={`w-8 h-8 bg-white text-${themeColor}-500 rounded-full flex items-center justify-center shadow`}
              >
                <GoTriangleRight className="w-8 h-8" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? `bg-${themeColor}-500 text-white`
                      : "bg-gradient-to-r from-[#84fab0] to-[#8fd3f4] text-black"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-lg text-sm bg-gray-200 text-black">
                  Typing...
                </div>
              </div>
            )}
            {/* Reference for scrolling */}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-gray-100 flex items-center gap-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="w-full flex-col sm:flex-row flex items-center gap-2"
            >
              <input
                type="text"
                className="flex-grow  border rounded-lg px-4 py-2 focus:outline-none w-60"
                placeholder="Compose your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                className={`bg-${themeColor}-500 text-white px-4 py-2 rounded-lg hover:bg-${themeColor}-600`}
                type="submit"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWithSupport;




