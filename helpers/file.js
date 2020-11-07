const { resolve, sep } = require("path");
const { readdir, readFile } = require("fs").promises;
const matter = require("gray-matter");
const TrieMap = require("mnemonist/trie-map");

const trieCache = new TrieMap();

const currCWD = process.cwd().split(sep);

function relativeNodes(file) {
  const nodes = file.split(sep);
  const relativeNodes = [];

  let i = 0;
  for (; i < nodes.length; i = i + 1) {
    if (nodes[i] !== currCWD[i]) {
      break;
    }
  }

  const startIndex = i;
  for (let i = startIndex; i < nodes.length; i = i + 1) {
    relativeNodes.push(nodes[i]);
  }

  return relativeNodes;
}

async function getFiles(dir) {
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
  const location = relativeNodes(file);

  const res = trieCache.get(location);
  if (res !== undefined) {
    return res;
  }

  const fileData = await readFile(file, "utf-8");

  const { content, data } = matter(fileData);
  const matterData = { content, data };

  trieCache.set(location, matterData);
  return matterData;
}

async function getMetadata(file) {
  const { data } = await getContentData(file);
  return data;
}

module.exports = {
  getFiles,
  getContentData,
  getMetadata,
};
