const { resolve } = require("path");
const { readdir, readFile } = require("fs").promises;
const matter = require("gray-matter");

const cache = {};

async function getFiles(dir, ext = null) {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    })
  );
  return Array.prototype.concat(...files);
}

async function getContentData(file) {
  if (file in cache) {
    return cache[file];
  }

  const fileData = await readFile(file, "utf-8");

  const { content, data } = matter(fileData);
  const matterData = { content, data };
  cache[file] = matterData;
  return matterData;
}

async function getMetadata(file) {
  const { data } = await getContentData(file);
  return data;
}

module.exports = { getFiles, getContentData, getMetadata };
