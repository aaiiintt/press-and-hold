// src/ScratchCard.jsx
import React, { useState, useRef, useEffect } from 'react';

const videos = ['video1.mp4', 'video2.mp4', 'video3.mp4']; // Add all your video sources here
const gifs = ['gif1.gif', 'gif2.gif', 'gif3.gif']; // Add corresponding GIF sources
const instructionGif = 'instruction.gif'; // Add your instruction GIF here

const ScratchCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);
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
  }, [currentIndex]);

  const handleInteractionStart = (e) => {
    setIsMuted(false);
    setIsInteracting(true);
    updateCursorPosition(e);
  };

  const handleInteractionEnd = () => {
    setIsMuted(true);
    setIsInteracting(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const updateCursorPosition = (e) => {
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);
    if (x !== undefined && y !== undefined) {
      setCursorPosition({ x, y });
    }
  };

  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        overflow: 'hidden',
        cursor: 'none',
        backgroundColor: '#000',
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
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        loop
        autoPlay
        muted={isMuted}
        playsInline
      />
      <video
        ref={nextVideoRef}
        style={{ display: 'none' }}
        preload="auto"
      />
      <img 
        src={isInteracting ? gifs[currentIndex] : instructionGif}
        alt="Cursor"
        style={{
          position: 'fixed',
          left: cursorPosition.x,
          top: cursorPosition.y,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          width: '50%',
          height: '50%',
        }}
      />
    </div>
  );
};

export default ScratchCard;