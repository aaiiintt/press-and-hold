// src/utils/fileUtils.js
export const generateFileList = (count, type, extension) => {
  const files = [];
  for (let i = count; i > 0; i--) {
    files.push(`${type}${i}.${extension}`);
  }
  return files;
};
