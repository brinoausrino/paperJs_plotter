const hershey = require('hersheytext');

const { CompoundPath, Point, Group } = require('paper-jsdom-canvas');

module.exports.listFonts = function () {
    console.log('All fonts available', hershey.getFonts());

    return hershey.getFonts();
}



module.exports.createText = function (text, options) {
    readOptions(options);
    let textProps = prepareText(text,options);
    var group = new Group();

    textProps.textArray.forEach(element => {
        let p = createTextPath(element['d'], options, textProps.scale);
        p.translate(new Point(textProps.dx, 0));
        textProps.dx += (element['width'] * textProps.scale);
        group.addChild(p);
    });
    group.translate(options.position);
    group.scale(1, -1);

}

module.exports.createTextOnCircle = function (text, options) {
    readOptions(options);
    options.radius = options.radius ? options.radius : 100;
    options.startAngle = options.startAngle ? options.startAngle : 0; // in degrees
    options.orientation = options.orientation ? options.orientation : "cw"; // cw - clockwise , ccw - counter clockwise
    
    let textProps = prepareText(text,options);
    if (options.orientation == "cw") {
        textProps.dx *=-1;
    }
    
    var group = new Group();

    let circ = 2 * Math.PI * options.radius;
    let alphaStart = (360-options.startAngle)/180*Math.PI;
    let maxAlpha = alphaStart + (textProps.textLength+textProps.dx) / circ * 2 * Math.PI;

    textProps.textArray.forEach(element => {
        let p = createTextPath(element['d'], options, textProps.scale);

        // angle of text on circle
        let alpha = alphaStart + textProps.dx / circ * 2 * Math.PI;
        // move char to 0° on circleborder
        p.translate(new Point(options.radius, 0));

        if (options.orientation == "cw") {
            // rotate cw, local direction
            p.rotate(270, new Point(options.radius, 0));
        } else {
            // rotate ccw, local direction
            p.rotate(90, new Point(options.radius, 0));
        }

        // rotate on cicle border
        p.rotate(alpha * 180 / Math.PI, new Point(0, 0));

        if (options.orientation == "cw") {
            // weird bug : move text bottom ards on specific lengths
            /*if (textProps.textLength < circ * 0.5) {
                p.translate(new Point(0, options.radius));
            } else if (textProps.textLength < circ * 0.75) {
                p.translate(new Point(0, 0.5 * options.radius));
            }*/
            textProps.dx -= (element['width'] * textProps.scale);
        } else {
            // weird bug : move text upwards if its smaller the 0.5*circ
            /*
            if (maxAlpha < Math.PI) {
                p.translate(new Point(0, -options.radius));
            } else if (textProps.textLength < circ * 0.75) {
                p.translate(new Point(0, 0.5 * -options.radius));
            }*/
            textProps.dx += (element['width'] * textProps.scale);
        }
        group.addChild(p);
    });
    group.translate(options.position);
    group.scale(1, -1,options.position);

}

function readOptions(options) {
    // set text options
    options = options ? options : {};
    options.font = options.font ? options.font : 'hershey_sans_1';
    options.size = options.size ? options.size : 10;
    options.position = options.position ? options.position : new Point(0, 0);
    options.strokeColor = options.strokeColor ? options.strokeColor : 'black';
    options.alignment = options.alignment ? options.alignment :"left";
    return options;
}

function calculateScale(options) {
    const x = hershey.renderTextArray('X', { font: options.font });
    var xp = new CompoundPath(x[0]['d']);
    let scale = options.size / xp.bounds.height;
    xp.remove();
    return scale;
}

function createTextPath(d, options, scale) {
    var p = new CompoundPath(d);
    p.fillColor = null;
    p.strokeColor = options.strokeColor;
    p.scale(scale, scale, new Point(0, 0));
    return p;
}

function prepareText(text, options){

    let ret = {
        textLength : 0,
        dx : 0,
        textArray : hershey.renderTextArray(text, { font: options.font }),
        scale : calculateScale(options)
    }

    ret.textArray.forEach(element => { ret.textLength += element['width'] });
    ret.textLength *= ret.scale;

    if(options.alignment == "center"){
        ret.dx = - ret.textLength*0.5; 
    }else if(options.alignment == "right"){
        ret.dx = - ret.textLength; 
    }

    return ret;
}