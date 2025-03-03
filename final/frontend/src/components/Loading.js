import React, { useEffect, useState } from "react";

const Loading = ({ message = "Loading..." }) => {
  const tasks = [
    "Sending data...",
    "Building adjacency matrix...",
    "Running quantum walk simulation...",
    "Assessing risk factors...",
    "Fetching optimized weights...",
  ];

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  useEffect(() => {
    if (currentTaskIndex < tasks.length - 1) {
      const timer = setTimeout(() => {
        setCurrentTaskIndex((prevIndex) => prevIndex + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentTaskIndex]);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen p-10">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
      >
        <source
          src="https://videos.ctfassets.net/ilblxxee70tt/7H333U0Uq4p2gqka4ZSJ7k/914c77c35c549dc180f144e7bf70fea1/Dotcom_NewGeneration_Animation_WEB.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      {/* <div className="loader mb-4"></div> */}
      <p className="text-2xl font-semibold text-[#fefffe]">{message}</p>
      <div className="flex items-center text-[#fefffe] text-lg mt-4">
        <span>{tasks[currentTaskIndex]}</span>
      </div>
      <style jsx>{`
        .loader {
          border: 8px solid rgba(255, 255, 255, 0.2);
          border-left-color: #2ea583;
          border-radius: 50%;
          width: 80px;
          height: 80px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
