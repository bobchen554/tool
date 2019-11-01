const fs = require('fs');
const path = require('path');
const svgoFn = require('svgo');


const { pluginsDefalut, defaultAttr, svg2jsFn, JS2SVG } = require('../config');
const { readFile, saveSvg, getTem } = require('../utils/svgTool');

// compress svg
const initSvgData = async (path) => {
    let plugins = pluginsDefalut;
    // if (type) plugins = [...pluginsDefalut, {removeXMLProcInst: true}, {removeXMLNS: true}];


    const svgoObj = new svgoFn({
        plugins,
    });
    
    const svgStr = await readFile(path);
    return await svgoObj.optimize(svgStr, { path });
};


const svgc = async (path, filename, cmd) => {
    const svgData = await initSvgData(path);
    saveSvg(svgData.data, filename, 'svg');
};









const toVue = async (svgTree, tem, filename) => {
    // hande placehold
    const placeholdSvg = JS2SVG(svgTree).data.replace(/"{{color}}"/, '"color"').replace(/"{{width}}"/, '"width"')
    .replace(/"{{height}}"/, '"height"').replace(/"{{className}}"/, '"className" v-bind="$attrs"')
    
    // handle hump key
    let finallySvg = placeholdSvg;
    // const humpArr = placeholdSvg.match(/[a-zA-Z]+[:][a-zA-Z]+/ig);
    // humpArr.map(item => {
    //     const arr = item.split(/[:]/);
    //     return `${arr[0]}${arr[1][0].toUpperCase()}${arr[1].slice(1)}`;
    // }).forEach((item, index) => {
    //     finallySvg = finallySvg.replace(new RegExp(`${humpArr[index]}`), item);
    // });

    const vueCompent = tem.replace(/{{content}}/, finallySvg);
    saveSvg(vueCompent, filename, 'vue');

};

const toReact = (svgTree, tem, filename) => {
    // hande placehold
    const placeholdSvg = JS2SVG(svgTree).data.replace(/"{{color}}"/, '{color}').replace(/"{{width}}"/, '{width}')
    .replace(/"{{height}}"/, '{height}').replace(/"{{className}}"/, '{className} {...props}')
    
    // handle hump key
    let finallySvg = placeholdSvg;
    const humpArr = placeholdSvg.match(/[a-zA-Z]+[-:][a-zA-Z]+/ig);
    humpArr.map(item => {
        const arr = item.split(/[-:]/);
        return `${arr[0]}${arr[1][0].toUpperCase()}${arr[1].slice(1)}`;
    }).forEach((item, index) => {
        finallySvg = finallySvg.replace(new RegExp(`${humpArr[index]}`), item);
    });

    const reactCompent = tem.replace(/{{content}}/, finallySvg);
    saveSvg(reactCompent, filename, 'js');
};



const svgo = async (path, filename, cmd) => {

    // get defalut attrs and tem
    const tem = await getTem(path, cmd.react, filename);

    // compress svg
    const svgData = await initSvgData(path);

    // init svg content
    const svgTree = await svg2jsFn(svgData.data);

    const titleTree = await svg2jsFn(`<title>${cmd.react ? '{title}' : '{{title}}'}</title>`);
    const titleItem = titleTree.content[0];
    const svgObj = svgTree.content[0];
    const attrsReact = ['width', 'height', 'className', 'color'];
    const attrsVue = [':width', ':height', ':className', ':color'];
    if (cmd.react) {
        attrsReact.forEach(item => {
            svgObj.attrs[item] = {
                local: item,
                name: item,
                prefix: '',
                value: `{{${item}}}`
            };
        });
    } else {
        attrsVue.forEach((item, index) => {
            svgObj.attrs[item] = {
                local: item,
                name: item,
                prefix: '',
                value: `{{${attrsReact[index]}}}`
            };
        });
    }
    titleItem.parentNode = svgObj;
    svgTree.content[0].content.unshift(titleItem);



    if (cmd.react) return toReact(svgTree, tem, filename);
    toVue(svgTree, tem, filename);
};

module.exports = {
    svgo,
    svgc
};