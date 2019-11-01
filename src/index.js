const checkPathAndFileName = require('../utils/check');
const chalk = require('chalk');
const path = require('path');
const { svgo, svgc } = require('./svg');

const svgToCompent = (pathName, filename, cmd) => {
   

    try {
        const svgPath = path.resolve(process.cwd(), pathName);
        checkPathAndFileName(svgPath, filename);
        svgo(svgPath, filename, cmd);

    } catch (e) {
        console.log(chalk.red('--------------------------------'))
        console.log(chalk.red(e.message));
        console.log(chalk.red('--------------------------------'))
    }

};

const svgCompress = (pathName, filename, cmd) => {
   

    try {
        const svgPath = path.resolve(process.cwd(), pathName);
        checkPathAndFileName(svgPath, filename);
        svgc(svgPath, filename, cmd);

    } catch (e) {
        console.log(chalk.red('--------------------------------'))
        console.log(chalk.red(e.message));
        console.log(chalk.red('--------------------------------'))
    }

};

module.exports = {
    svgToCompent,
    svgCompress
};