const { CompoundPath, Point, Group, Path, Layer } = require('paper-jsdom-canvas');

module.exports.createCanvasFromJson = function (json, paper) {
    let canvas = paper.createCanvas(json.size[0], json.size[0]);
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