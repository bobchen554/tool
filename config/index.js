const JS2SVG = require('svgo/lib/svgo/js2svg');
const SVG2JS = require('svgo/lib/svgo/svg2js');

const pluginsDefalut = [
    {
        cleanupAttrs: true,
    },
    {
        removeDoctype: true,
    },
    {
        removeXMLProcInst: true,
    },
    {
        removeComments: true,
    },
    {
        removeMetadata: true,
    },
    {
        removeTitle: true,
    },
    {
        removeEmptyAttrs: true,
    },
    {
        removeEditorsNSData: true,
    },
    {
        removeEmptyContainers: true,
    },
    {
        removeEmptyText: true,
    },
    {
        removeUselessStrokeAndFill: true,
    },
    {
        cleanupIDs: true,
    },
    {
        removeUselessDefs: true,
    },
    {
        collapseGroups: true
    },
    {
        removeDimensions: true,
    },
    {
        removeHiddenElems: true,
    },
    {
        convertStyleToAttrs: true
    },
    {
        convertColors: true
    }
];
const compentContent = {
    react: `
    import React from 'react';

    export default function {{fileName}}({ width={{width}}, height={{height}},
        className={{className}}, title={{title}}, style={}, color={{color}}, ...props
    }) {
      return (
        {{content}}
      );
    }
    `,
    vue: `
    <template>
        {{content}}
    </template>
    <script>
        export default {
            props: {
                color: {
                    type: String,
                    default: {{color}}
                },
                width: {
                    type: String,
                    default: {{width}}
                },
                height: {
                    type: String,
                    default: {{height}}
                },
                className: {
                    type: String,
                    default: {{className}}
                },
                title: {
                    type: String,
                    default: {{title}}
                },
            }
        };
    </script>
    `,
};

const defaultAttr = {
    width: '20px',
    height: '20px',
    className: '',
    title: '',
    color: 'black',
};

const svg2jsFn = (str) => new Promise((resolve, reject) => SVG2JS(str, (svgjs) => {
    if (svgjs.error) {
        reject(svgjs);
        return;
    }
    resolve(svgjs);
}))

module.exports = {
    pluginsDefalut,
    SVG2JS,
    JS2SVG,
    compentContent,
    defaultAttr,
    svg2jsFn
};