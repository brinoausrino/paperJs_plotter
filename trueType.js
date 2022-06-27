const TextToSVG = require('text-to-svg');

const { CompoundPath, Point, Group, Rectangle } = require('paper-jsdom-canvas');


let fonts = {}
fonts['default'] = TextToSVG.loadSync();

module.exports.listFonts = function () {
    console.log('All fonts available: ');
    for (const [key, value] of Object.entries(fonts)) {
        console.log(`${key}`);
      }
}

module.exports.addFont = function (name, path) {
    fonts[name] = TextToSVG.loadSync(path);
}

module.exports.createText = function (text, options) {
    readOptions(options);

    let x = fonts[options.font].getD("X");
    let px = createTextPath(x, options, 1);
    let scale = options.size/px.bounds.height;
    px.remove();

    let textProps = fonts[options.font].getD(text);

    let p = createTextPath(textProps, options, scale);
    p.translate(options.position);
    return p;
}

function readOptions(options) {
    // set text options
    options = options ? options : {};
    options.font = options.font ? options.font : 'default';
    options.size = options.size ? options.size : 10;
    options.position = options.position ? options.position : new Point(0, 0);
    options.strokeColor = options.strokeColor ? options.strokeColor : 'black';
    options.alignment = options.alignment ? options.alignment :"left";
    return options;
}

function createTextPath(d, options, scale) {
    var p = new CompoundPath(d);
    p.fillColor = null;
    p.strokeColor = options.strokeColor;
    p.scale(scale, scale, new Point(0, 0));
    
    if(options.alignment =="center"){
        p.translate(-p.bounds.width*0.5,0);
    }else if(options.alignment =="right"){
        p.translate(-p.bounds.width,0);
    }

    return p;
}