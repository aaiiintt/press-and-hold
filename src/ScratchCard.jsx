// src/Season1/ScratchCard.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { generateFileList } from "../utils/fileUtils";
import "../ScratchCard.css";

const ScratchCard = () => {
  const number_of_sketches = 6;

  const videos = generateFileList(number_of_sketches, "/Season1/videos", "mp4");
  const gifs = generateFileList(number_of_sketches, "/Season1/gifs", "gif");
  const instructionGif = "/Season1/instruction.gif";

  const initialState = {
    currentIndex: 0,
    isMuted: true,
    cursorPosition: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    isInteracting: false,
  };

  const [{ currentIndex, isMuted, cursorPosition, isInteracting }, setState] =
    useState(initialState);

  const videoRef = useRef(null);
  const nextVideoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
    if (nextVideoRef.current) {
      nextVideoRef.current.src = videos[(currentIndex + 1) % videos.length];
      nextVideoRef.current.load();
    }
  }, [currentIndex, videos]);

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

  const handleInteractionStart = useCallback(
    (e) => {
      setState((prevState) => ({
        ...prevState,
        isMuted: false,
        isInteracting: true,
      }));
      updateCursorPosition(e);
    },
    [updateCursorPosition],
  );

  const handleInteractionEnd = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      isMuted: true,
      isInteracting: false,
      currentIndex: (prevState.currentIndex + 1) % videos.length,
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
