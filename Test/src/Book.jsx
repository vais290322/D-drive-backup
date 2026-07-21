import React, { useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";

const Book = () => {
  const bookRef = useRef();
  const totalPages = 100;
  const [currentPage, setCurrentPage] = useState(0);

  // General Knowledge Content for each page
  const pages = [
    "🌍 General Knowledge Book\n\nWelcome! Flip through to learn amazing facts about the world.  अ आ ऐ इ ई उ ऊ ए ओ औ \nक ख ग घ च छ ज झ ट ठ ड ढ त थ द ध न प फ ब भ म य र ल व श ष स ह",
    "🗼 The Eiffel Tower in Paris can be 15 cm taller during hot days due to expansion of iron.",
    "🌌 Venus is the hottest planet in our solar system, not Mercury, even though Mercury is closer to the Sun.",
    "🦒 A giraffe’s tongue can be up to 50 cm long and is dark purple to avoid sunburn.",
    "📚 The Library of Alexandria in Egypt was one of the largest and most significant libraries of the ancient world.",
    "⚡ Lightning is five times hotter than the surface of the Sun.",
    "🌊 The Pacific Ocean is larger than all of Earth’s land area combined.",
    "🐘 Elephants are the only animals that cannot jump.",
    "🍫 Chocolate was once used as currency by the ancient Aztecs.",
    "🏁 You’ve reached the end!\n\nKeep learning and exploring every day.",
    "🏁 You’ve reached the end!\n\nKeep learning and exploring every day.",
    "🏁 You’ve reached the end!\n\nKeep learning and exploring every day.",
    "🏁 You’ve reached the end!\n\nKeep learning and exploring every day.",
    "🏁 You’ve reached the end!\n\nKeep learning and exploring every day.",
    "🏁 You’ve reached the end!\n\nKeep learning and exploring every day.",
    "🏁 You’ve reached the end!\n\nKeep learning and exploring every day.",
    "🏁 You’ve reached the end!\n\nKeep learning and exploring every day.",
    "🏁 You’ve reached the end!\n\nKeep learning and exploring every day.",
    "🏁 You’ve reached the end!\n\nKeep learning and exploring every day.",
    "🏁 You’ve reached the end!\n\nKeep learning and exploring every day.",
    "🏁 You’ve reached the end!\n\nKeep learning and exploring every day.",
    "🏁 You’ve reached the end!\n\nKeep learning and exploring every day.",
  ];

  const handleNext = () => {
    if (bookRef.current.pageFlip().getCurrentPageIndex() < totalPages - 1) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const handlePrev = () => {
    if (bookRef.current.pageFlip().getCurrentPageIndex() > 0) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-4 bg-sky-200 ">
      {/* Book */}
      <HTMLFlipBook
        width={400}
        height={300}
        size="stretch"
        minWidth={315}
        maxWidth={1000}
        minHeight={300}
        maxHeight={1536}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        className="shadow-xl"
        ref={bookRef}
        onFlip={(e) => setCurrentPage(e.data)}
      >
        {pages.map((content, i) => (
          <div
            key={i}
            className="flex relative flex-col justify-between w-full h-full bg-white border border-gray-300 text-lg font-medium p-6 whitespace-pre-line"
          >
            {/* Page Content */}
            <div className="flex-1 flex items-center justify-center text-center">
              {content}
            </div>

            {/* Page Number */}
            <div className="text-center text-sm text-gray-500 mt-2 absolute bottom-2 w-full">
              {i + 1}
            </div>
          </div>
        ))}
      </HTMLFlipBook>

      {/* Controls */}
      <div className="flex space-x-4">
        <button
          onClick={handlePrev}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
        >
          ◀ Prev
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Next ▶
        </button>
      </div>

      {/* Progress bar + Page number */}
      <div className="w-full max-w-md mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
          />
        </div>
        <p className="text-center mt-2 text-sm text-gray-600">
          Page {currentPage + 1} of {totalPages}
        </p>
      </div>
    </div>
  );
};

export default Book;
