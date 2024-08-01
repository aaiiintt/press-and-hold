// src/utils/getFiles.js

const number_of_sketches = 5; // Set this to the number of sketches you have

// Helper function to generate file lists
const generateFileList = (count, type) => {
  const files = [];
  for (let i = count; i > 0; i--) {
    files.push(`${type}${i}.mp4`);
  }
  return files;
};

export const getVideos = () => generateFileList(number_of_sketches, "video");

export const getGifs = () => generateFileList(number_of_sketches, "gif");
