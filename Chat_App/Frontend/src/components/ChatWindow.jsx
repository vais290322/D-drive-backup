import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { getSocket } from "../services/socketService";
import EmojiPicker from "emoji-picker-react";
import { encryptMessage, decryptMessage } from "../utils/encryption";

const DecryptedAttachment = ({ message }) => {
  const [decryptedUrl, setDecryptedUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!message.fileUrl) return;

    if (message.fileUrl.endsWith('.enc')) {
      const fetchAndDecrypt = async () => {
        setLoading(true);
        try {
          const response = await axios.get(message.fileUrl, { responseType: 'text' });
          const ciphertext = response.data;
          const originalDataUrl = decryptMessage(ciphertext, message.sender, message.recipient);
          
          if (originalDataUrl && originalDataUrl.startsWith('data:')) {
            setDecryptedUrl(originalDataUrl);
          } else {
            console.warn("Decryption yielded invalid DataURL, falling back.");
            setDecryptedUrl(message.fileUrl);
          }
        } catch (err) {
          console.error("Failed to decrypt attachment", err);
          setDecryptedUrl(message.fileUrl);
        } finally {
          setLoading(false);
        }
      };
      fetchAndDecrypt();
    } else {
      setDecryptedUrl(message.fileUrl);
    }
  }, [message]);

  const fileName = message.fileName || "attachment";
  const fileType = message.fileType || "";

  if (loading) {
    return (
      <div className="mt-2 flex items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-green-500 mr-3"></div>
        <span className="text-xs text-gray-500 dark:text-gray-400">Decrypting attachment...</span>
      </div>
    );
  }

  if (!decryptedUrl) return null;

  if (fileType.startsWith("image/")) {
    return (
      <div className="mt-2">
        <img
          src={decryptedUrl}
          alt={fileName}
          className="max-w-full rounded-lg max-h-60 object-contain cursor-pointer"
          onClick={() => window.open(decryptedUrl, "_blank")}
        />
        <p className="text-xs text-gray-500 mt-1">{fileName}</p>
      </div>
    );
  } else if (fileType.startsWith("video/")) {
    return (
      <div className="mt-2">
        <video controls className="max-w-full rounded-lg max-h-60">
          <source src={decryptedUrl} type={fileType} />
          Your browser does not support the video tag.
        </video>
        <p className="text-xs text-gray-500 mt-1">{fileName}</p>
      </div>
    );
  } else {
    // For other file types
    let icon = "📄";
    if (fileType.includes("pdf")) icon = "📕";
    else if (
      fileType.includes("excel") ||
      fileType.includes("spreadsheet") ||
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".xls")
    )
      icon = "📊";
    else if (fileType.includes("word") || fileType.includes("document"))
      icon = "📝";
    else if (fileType.includes("zip") || fileType.includes("compressed"))
      icon = "🗜️";

    const handleDownload = () => {
      const link = document.createElement("a");
      link.href = decryptedUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <div className="mt-2">
        <div
          className="flex items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
          onClick={handleDownload}
        >
          <span className="text-2xl mr-2">{icon}</span>
          <div className="overflow-hidden">
            <p className="text-sm truncate dark:text-gray-200">{fileName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Click to save (Decrypted)</p>
          </div>
        </div>
      </div>
    );
  }
};

const ChatWindow = ({ selectedUser, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const reactionPickerRef = useRef(null);

  // Add the missing handleEmojiClick function
  const handleEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "x-auth-token": token,
        },
      };

      const response = await axios.get(
        `http://localhost:5000/api/messages/${selectedUser._id}`,
        config
      );
      
      const decryptedMessages = response.data.map(msg => ({
        ...msg,
        content: msg.content ? decryptMessage(msg.content, msg.sender, msg.recipient) : ''
      }));
      setMessages(decryptedMessages);
      setLoading(false);

      // Mark messages as read
      markMessageAsRead(selectedUser._id);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoading(false);
    }
  };

  const markMessageAsRead = async (senderId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "x-auth-token": token,
        },
      };

      await axios.post(
        `http://localhost:5000/api/messages/read/${senderId}`,
        {},
        config
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  // Add these new state variables at the top with your other state declarations
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Add this function to handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      // For non-image files, just show the file name
      setFilePreview(null);
    }
  };

  // Add this function to clear selected file
  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setFileUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Update the sendMessage function to handle file uploads
  const sendMessage = async (e) => {
    e.preventDefault();

    if ((!newMessage.trim() && !selectedFile) || !selectedUser) return;

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "x-auth-token": token,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setFileUploadProgress(percentCompleted);
        },
      };

      const formData = new FormData();
      let encryptedContent = "";
      if (newMessage.trim()) {
        encryptedContent = encryptMessage(newMessage, (currentUser.id || currentUser._id), selectedUser._id);
        formData.append("content", encryptedContent);
      }

      if (selectedFile) {
        // Read the file entirely, encrypt it as a Base64 cipher, and upload a scrambled blob
        const encryptFile = async (file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const dataUrl = e.target.result;
              const encrypted = encryptMessage(dataUrl, (currentUser.id || currentUser._id), selectedUser._id);
              const blob = new Blob([encrypted], { type: "text/plain" });
              resolve(blob);
            };
            reader.readAsDataURL(file);
          });
        };

        const encryptedFileBlob = await encryptFile(selectedFile);
        formData.append("file", encryptedFileBlob, "encrypted_media.enc");
        
        formData.append("fileType", selectedFile.type);
        formData.append("fileName", selectedFile.name);
      }

      formData.append("recipientId", selectedUser._id);

      const response = await axios.post(
        "http://localhost:5000/api/messages",
        formData,
        config
      );

      // Add the message to the state only for the sender
      const sentMessageToAdd = {
        ...response.data,
        content: newMessage.trim() ? newMessage : ""
      };
      setMessages(prevMessages => [...prevMessages, sentMessageToAdd]);
      setNewMessage("");
      clearSelectedFile();
      
      // Send message via socket
      const socket = getSocket();
      socket.emit("private-message", {
        to: selectedUser._id,
        from: (currentUser.id || currentUser._id),
        message: encryptedContent,
        hasAttachment: !!selectedFile,
        messageId: response.data._id,
        fileUrl: response.data.fileUrl,
        fileName: response.data.fileName,
        fileType: response.data.fileType
      });
      
      // Stop typing indicator
      emitTypingStatus(false);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };



  const handleTyping = () => {
    // Emit typing event
    emitTypingStatus(true);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      emitTypingStatus(false);
    }, 3000);
  };

  const emitTypingStatus = (isTyping) => {
    const socket = getSocket();
    socket.emit("typing", {
      to: selectedUser._id,
      from: (currentUser.id || currentUser._id),
      isTyping,
    });
  };

  // Make sure this function is defined in your component
  const handleReaction = async (messageId, emoji) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "x-auth-token": token,
        },
      };

      await axios.post(
        `http://localhost:5000/api/messages/react/${messageId}`,
        {
          reaction: emoji,
        },
        config
      );

      // Update local message state with the reaction
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, reaction: emoji } : msg
        )
      );

      // Close reaction picker
      setShowReactionPicker(null);

      // Notify the other user about the reaction via socket
      const socket = getSocket();
      socket.emit("message-reaction", {
        to: selectedUser._id,
        from: (currentUser.id || currentUser._id),
        messageId,
        reaction: emoji,
      });
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  // Add this function to handle file downloads
  const downloadFile = async (fileUrl, fileName) => {
    try {
      const response = await axios({
        url: fileUrl,
        method: "GET",
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        reactionPickerRef.current &&
        !reactionPickerRef.current.contains(event.target)
      ) {
        setShowReactionPicker(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update the socket.on("private-message") handler in your useEffect
  useEffect(() => {
    if (selectedUser) {
      fetchMessages();

      // Listen for new messages
      const socket = getSocket();
      socket.on("private-message", (message) => {
        if (message.from === selectedUser._id) {
          // Check if the message already exists in the state to prevent duplicates
          setMessages(prevMessages => {
            const messageExists = prevMessages.some(m => 
              m._id === message.messageId || 
              (m.sender === message.from && m.content === message.message && 
               new Date(m.createdAt).getTime() > Date.now() - 5000)
            );
            
            if (messageExists) {
              return prevMessages;
            }
            
            // Create a more complete message object that includes file information
            const newMessage = {
              sender: message.from,
              recipient: (currentUser.id || currentUser._id),
              content: message.message ? decryptMessage(message.message, message.from, (currentUser.id || currentUser._id)) : '',
              createdAt: message.timestamp,
              // Add these fields for file attachments
              fileUrl: message.fileUrl,
              fileName: message.fileName,
              fileType: message.fileType,
              _id: message.messageId
            };
            
            return [...prevMessages, newMessage];
          });
          
          // Mark message as read
          markMessageAsRead(selectedUser._id);
        }
      });

      // Listen for typing indicators
      socket.on("typing", ({ from, isTyping }) => {
        if (from === selectedUser._id) {
          setIsTyping(isTyping);
        }
      });

      // Listen for message reactions
      socket.on("message-reaction", ({ messageId, reaction }) => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === messageId ? { ...msg, reaction } : msg
          )
        );
      });

      return () => {
        socket.off("private-message");
        socket.off("typing");
        socket.off("message-reaction");
      };
    }
  }, [selectedUser, currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800 h-full">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-gray-500 dark:text-gray-400 text-xl">
            Select a user to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900">
      <div className="p-3 bg-green-600 dark:bg-green-800 text-white flex items-center shadow-md">
        <button
          onClick={onBack}
          className="md:hidden mr-2 p-1 rounded-full hover:bg-green-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 uppercase font-semibold">
              {selectedUser.username.charAt(0)}
            </div>
            <span
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 ${
                selectedUser.isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            ></span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {selectedUser.username}
            </h2>
            <p className="text-xs text-green-100">
              {isTyping ? (
                <span className="animate-pulse">typing...</span>
              ) : selectedUser.isOnline ? (
                "Online"
              ) : (
                "Offline"
              )}
            </p>
          </div>
        </div>
      </div>

      <div
        className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900"
        style={{
          backgroundImage:
            'url("https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png")',
        }}
      >
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === (currentUser.id || currentUser._id)
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div className="relative group">
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow ${
                      message.sender === (currentUser.id || currentUser._id)
                        ? "bg-green-100 dark:bg-green-700 text-gray-800 dark:text-white rounded-tr-none"
                        : "bg-blue-100 dark:bg-blue-700 text-gray-900 dark:text-white rounded-tl-none"
                    }`}
                  >
                    {message.content && <p>{message.content}</p>}
                    {message.fileUrl && <DecryptedAttachment message={message} />}
                    <p
                      className={`text-xs mt-1 text-right ${
                        message.sender === (currentUser.id || currentUser._id)
                          ? "text-gray-500 dark:text-gray-300"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {formatTime(message.createdAt)}
                      {message.sender === (currentUser.id || currentUser._id) && (
                        <span className="ml-1">
                          {message.read ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 inline text-blue-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 inline text-gray-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </span>
                      )}
                    </p>

                    {/* Display reaction if exists */}
                    {message.reaction && (
                      <div className="absolute -bottom-3 right-2 bg-white dark:bg-gray-800 rounded-full px-1 py-0.5 shadow-md text-sm">
                        {message.reaction}
                      </div>
                    )}
                  </div>
                  {/* Reaction button */}
                  <button
                    onClick={() => setShowReactionPicker(message._id)}
                    className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white dark:bg-gray-700 rounded-full shadow-md -mt-2 -mr-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-500 dark:text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                  {/* Reaction picker */}
                  {showReactionPicker === message._id && (
                    <div
                      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                      ref={reactionPickerRef}
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1">
                        <EmojiPicker
                          onEmojiClick={(emojiData) =>
                            handleReaction(message._id, emojiData.emoji)
                          }
                          width={280}
                          height={350}
                          previewConfig={{ showPreview: false }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />

           
          </div>
        )}
      </div>
      <form
              onSubmit={sendMessage}
              className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
            >
              {selectedFile && (
                <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    {filePreview ? (
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="h-10 w-10 object-cover rounded mr-2"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center mr-2">
                        <span className="text-lg">📎</span>
                      </div>
                    )}
                    <span className="text-sm truncate max-w-xs">
                      {selectedFile.name}
                    </span>
                  </div>
                  {fileUploadProgress > 0 && fileUploadProgress < 100 ? (
                    <div className="w-16 bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${fileUploadProgress}%` }}
                      ></div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={clearSelectedFile}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}

              <div className="flex space-x-2 relative">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>

                {/* Add file upload button here */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </button>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {showEmojiPicker && (
                  <div
                    className="absolute bottom-14 left-0 z-10"
                    ref={emojiPickerRef}
                  >
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}

                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleTyping}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() && !selectedFile}
                  className="p-2 bg-green-600 text-white rounded-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </form>
    </div>
  );
};

export default ChatWindow;
