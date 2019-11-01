const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { defaultAttr, svg2jsFn, JS2SVG, compentContent } = require('../config');

const readFile = (pathName) =>  new Promise((reslove, reject) => {
    fs.readFile(pathName, (err, data) => {
        if (err) throw err;
        reslove(data.toString());
    })
});

const saveSvg = async (data, filename, extname) => {
    const buildPath = path.resolve(process.cwd(), './build');
    const buildExsit = fs.existsSync(buildPath);
    if (!buildExsit) fs.mkdirSync(buildPath);
    fs.writeFile(path.resolve(buildPath, `${filename}.${extname}`), data, (err) => {
        if (err) throw err;
        console.log(chalk.green(`${filename}已经保存`));
    });
}

const getSvgAttr = (svgTree, attrs) => {
    if (svgTree.elem === 'svg') {
        svgTree.attrs.className && (attrs.className = svgTree.attrs.className.value);
        svgTree.attrs.width && (attrs.width = svgTree.attrs.width.value);
        svgTree.attrs.height && (attrs.height = svgTree.attrs.height.value);
    } else if (svgTree.elem === 'title') {
        const title = JS2SVG(svgTree);
        attrs.title = title.data;
    }
};

const forEachSvgTree = (svgTree, callback, arrts) => {
    callback(svgTree, arrts);
    svgTree.content && svgTree.content.forEach(item => forEachSvgTree(item, callback, arrts));
};

const getSvgDefault = async (path, arrts) => {

    const svgStr = await readFile(path);
    const svgTree = await svg2jsFn(svgStr);
    forEachSvgTree(svgTree, getSvgAttr, arrts);
};

const getTem = async (path, isReact, filename) => {
    const arrts = { ...defaultAttr };
    await getSvgDefault(path, arrts);
    let tem;
    if (isReact) {
        tem = compentContent.react;
    } else {
        tem = compentContent.vue;
    }
    return tem.replace(/{{fileName}}/, filename).replace(/{{width}}/, `'${arrts.width}'`)
    .replace(/{{className}}/, `'${arrts.className}'`).replace(/{{title}}/, `'${arrts.title}'`)
    .replace(/{{color}}/, `'${arrts.color}'`).replace(/{{height}}/, `'${arrts.height}'`);
};

module.exports = {
    readFile,
    saveSvg,
    getTem
};