const path = require('path');
const fs = require('fs');


const checkfileName = (filename) => {
    if (!filename) return true;
};

const checkSvgPathExist = (pathName) => {
    console.log(pathName)
    // try {
    //     return !fs.statSync(svgPath).isDirectory();
    // } catch (e) {
    //     throw new Error('please check path and fileName');
    // }
};

module.exports = (pathName, filename) => {
    if (checkSvgPathExist(pathName) || checkfileName(filename))
    throw new Error('please check path and fileName');
};
