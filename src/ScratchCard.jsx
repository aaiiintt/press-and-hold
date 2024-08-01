// Import necessary modules from React
import React, { useState, useRef, useEffect, useCallback } from "react";

// Import utility function to generate file lists
import { generateFileList } from "./utils/fileUtils";

// Import CSS for the ScratchCard component
import "./ScratchCard.css";

const ScratchCard = () => {
  // Number of sketches (videos and gifs)
  const number_of_sketches = 5;

  // Generate lists for video and gif files
  const videos = generateFileList(number_of_sketches, "video", "mp4");
  const gifs = generateFileList(number_of_sketches, "gif", "gif");
  const instructionGif = "instruction.gif";  // Gif shown when user is not interacting

  // Initial state for the component
  const initialState = {
    currentIndex: 0,  // Current index of video/gif
    isMuted: true,    // Is the video muted
    cursorPosition: { x: window.innerWidth / 2, y: window.innerHeight / 2 }, // Cursor position
    isInteracting: false,  // Is user interacting (clicking/tapping)
  };

  // State management using useState hook
  const [{ currentIndex, isMuted, cursorPosition, isInteracting }, setState] = useState(initialState);

  // Refs to hold video elements
  const videoRef = useRef(null);
  const nextVideoRef = useRef(null);

  // Effect to play the video and load the next video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
    if (nextVideoRef.current) {
      nextVideoRef.current.src = videos[(currentIndex + 1) % videos.length];
      nextVideoRef.current.load();
    }
  }, [currentIndex, videos]);

  // Function to update cursor position
  const updateCursorPosition = useCallback((e) => {
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);
    if (x !== undefined && y !== undefined) {
      setState((prevState) => ({
        ...prevState,
        cursorPosition: { x, y },
      }));
    }
  }, []);

  // Function to handle start of user interaction (mousedown/touchstart)
  const handleInteractionStart = useCallback(
    (e) => {
      setState((prevState) => ({
        ...prevState,
        isMuted: false,  // Unmute the video
        isInteracting: true,  // Set interacting state to true
      }));
      updateCursorPosition(e);  // Update cursor position
    },
    [updateCursorPosition],
  );

  // Function to handle end of user interaction (mouseup/touchend)
  const handleInteractionEnd = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      isMuted: true,  // Mute the video
      isInteracting: false,  // Set interacting state to false
      currentIndex: (prevState.currentIndex + 1) % videos.length,  // Move to next video
    }));
  }, [videos.length]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        cursor: "none",
        backgroundColor: "#000",
      }}
      onMouseMove={updateCursorPosition}
      onTouchMove={updateCursorPosition}
      onMouseDown={handleInteractionStart}
      onMouseUp={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
    >
      <video
        ref={videoRef}
        src={videos[currentIndex]}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        loop
        autoPlay
        muted={isMuted}
        playsInline
      />
      <video ref={nextVideoRef} style={{ display: "none" }} preload="auto" />
      <div
        className="unselectable"
        style={{
          position: "fixed",
          left: cursorPosition.x,
          top: cursorPosition.y,
          transform: "translate(-50%, -80%)",
          pointerEvents: "none",
          width: "50vw",
          height: "50vw",
          backgroundImage: `url(${isInteracting ? gifs[currentIndex] : instructionGif})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );
};

export default ScratchCard;