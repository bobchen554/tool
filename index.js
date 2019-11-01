const program = require('commander');
const package = require('./package.json');
const { svgToCompent, svgCompress } = require('./src');

program
.version(package.version, '-v, --version')
.command('svgo <path> <filename>')
.description('to compent')
.option('-E, --vue', 'svg to vue')
.option('-R, --react', 'svg to react')
.action((path, filename, cmd) => {
    svgToCompent(path, filename, cmd);
});

program.command('svgc <path> <filename>')
.description('to compress')
.action((path, filename, cmd) => {
    svgCompress(path, filename, cmd);
});

program.parse(process.argv);

