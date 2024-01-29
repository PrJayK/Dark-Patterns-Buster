const { existsSync, mkdirSync } =require('node:fs');

const createDirIfNotExist = (dir) => {
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
};

module.exports= { createDirIfNotExist };
