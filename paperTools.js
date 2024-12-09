const { CompoundPath, Point, Group, Path, Layer } = require('paper-jsdom-canvas');
var fs = require('fs');
const { console } = require('inspector');

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

module.exports.mergeLayers = function (json,paper) {
    let layerNames = [];

    for (const [layerName, layerSettings] of Object.entries(json.layers)) {
        let lName = layerSettings.strokeColor + "_" + layerSettings.lineWidth;
        const found = paper.project.layers.find(layer => layer.name === lName);
        if( typeof(found) == "undefined" ){
            let l = new Layer({
                name: lName,
                strokeColor: layerSettings.strokeColor,
                lineWidth: layerSettings.lineWidth,
                fillColor:null
            });
        }
        layerNames.push({
            old:layerName,
            new:lName
        })
    }
    for(l of layerNames){
        let oldlayer = paper.project.layers.find(layer => layer.name === l.old);
        let masterLayer = paper.project.layers.find(layer => layer.name === l.new);
        masterLayer.addChildren(oldlayer.getChildren());
        oldlayer.remove();
    }
}

module.exports.translateAllElements = function (position,project) {
    for (let layer of project.layers) {
        for (let child of layer.children) {
            child.position.x += position.x;
            child.position.y += position.y;
        }
    }
}

module.exports.generateBorderPoints = function (paper,topLeft,bottomRight, innerBorders=false) {
    for (let layer of paper.project.layers) { 
            layer.activate();
            let tl = new Path.Line(topLeft, new Point(topLeft.x+0.1,topLeft.y));
            let br = new Path.Line(bottomRight, new Point(bottomRight.x-0.1,bottomRight.y));

            if(innerBorders){
                let tli = new Path.Line(topLeft, new Point(topLeft.x+1.5,topLeft.y+1.5));
                let bri = new Path.Line(bottomRight, new Point(bottomRight.x-1.5,bottomRight.y-1.5));
            }
            
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