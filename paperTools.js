const { CompoundPath, Point, Group, Path, Layer } = require('paper-jsdom-canvas');
var fs = require('fs');

module.exports.createCanvasFromJson = function (json, paper) {
    let canvas = paper.createCanvas(json.size[0], json.size[1]);
    paper.setup(canvas);
    for (const [layerName, layer] of Object.entries(json.layers)) {
        let l = new Layer({
            name: layerName,
            strokeColor: layer.strokeColor,
            lineWidth: layer.lineWidth,
            fillColor:null
        });
    }
    return canvas;
}

module.exports.generateBorderPoints = function (paper,topLeft,bottomRight) {
    for (let layer of paper.project.layers) { 
        layer.activate();
        let tl = new Path.Line(topLeft, new Point(topLeft.x+0.1,topLeft.y));
        let br = new Path.Line(bottomRight, new Point(bottomRight.x-0.1,bottomRight.y));
    }
}

module.exports.setActiveLayer = function (layerName, paper) {
    for (let layer of paper.project.layers) {
        if(layer.name == layerName){
            layer.activate();
        }
    }
}

module.exports.styleAllElements = function (project) {
    for (let layer of project.layers) {
        for (let child of layer.children) {
            styleChildren(child, layer.style);
        }
    }
}

function styleChildren(elem, style) {
    elem.style = style;
    if( typeof(elem.children) != 'undefined'){
        for (let child of elem.children) {
            styleChildren(child, style);
        }
    } 
}

async function saveCanvasToPNGFile(filename, canvas)
{

    // Saving the canvas to a file.
    let ready = false 
    out = fs.createWriteStream(filename);
    stream = canvas.pngStream();


    stream.on('data', function(chunk) {
        out.write(chunk);
    });

    stream.on('end', function() {
        console.log('saved png '+filename);
        ready = true;
    });
    
    while(!ready){
        await delay(20);
    }
    return{filename:filename};
}
module.exports.saveCanvasToPNGFile = saveCanvasToPNGFile;

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  } 

async function saveCanvasToJPGFile(filename,canvas)
{
    var fullpath = filename;

    // Saving the canvas to a file.
    out = fs.createWriteStream(fullpath);
    stream = canvas.jpegStream({quality: 80});

    stream.on('data', function(chunk) {
        out.write(chunk);
    });

    stream.on('end', function() {
        console.log('saved jpeg '+filename);
        return{filename:filename};
    });
    
}
module.exports.saveCanvasToJPGFile = saveCanvasToJPGFile;