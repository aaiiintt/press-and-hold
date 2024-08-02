// src/utils/fileUtils.js
export const generateFileList = (number, path, extension) => {
  const fileList = [];
  for (let i = 1; i <= number; i++) {
    fileList.push(`${path}/video${i}.${extension}`);
  }
  return fileList;
};
