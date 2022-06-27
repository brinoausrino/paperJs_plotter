const { CompoundPath, Point, Group, Path, Layer } = require('paper-jsdom-canvas');

module.exports.createCanvasFromJson = function (json, paper) {
    let canvas = paper.createCanvas(json.size[0], json.size[1]);
    paper.setup(canvas);
    for (let layer of json.layers) {
        let l = new Layer({
            name: layer.name,
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