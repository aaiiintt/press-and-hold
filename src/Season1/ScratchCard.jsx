// src/Season1/ScratchCard.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import "../ScratchCard.css";

const ScratchCard = () => {
  const instructionGif = "instruction.gif";

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
      nextVideoRef.current.src = `/Season1/videos/video${(currentIndex + 2) % 6}.mp4`; // Hardcoded example path
      nextVideoRef.current.load();
    }
  }, [currentIndex]);

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
      currentIndex: (prevState.currentIndex + 1) % 6,
    }));
  }, []);

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
        src={`/Season1/videos/video${currentIndex + 1}.mp4`} // Hardcoded example path
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
          backgroundImage: `url(${isInteracting ? `/Season1/gifs/gif${currentIndex + 1}.gif` : instructionGif})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );
};

export default ScratchCard;
