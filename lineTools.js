const { CompoundPath, Point, Group, Path } = require('paper-jsdom-canvas');


function subdividePath(line, options) {
    readSubdivideOptions(options);

    for(let i=line.length; i> options.distance;i-=options.distance){
        let p= line.getPointAt(i);
        line.divideAt(i);
    }
    
}
module.exports.subdividePath = subdividePath;

function subdivideItem(item, options) {
    for (let c of item.getChildren()){
        if (c.className == 'Path'){
            subdividePath(c,options);
        }else{
            subdivideItem(c,options);
        }
    }
}
module.exports.subdivideItem = subdivideItem;

module.exports.hatch = function (path, options) {
    readHatchOptions(options);

    // get bounding box of object
    let bounds = path.bounds;

    // get hatch vector
    let alpha = (options.angle%180) *Math.PI/180;
    let v = new Point(Math.cos(alpha),Math.sin(alpha));

    // solve cross with bounding box 
    // solve to p1.x if v.x < v.y
    // solve to p1.y if v.x >= v.y
    // p0 +v*a = p1
    //
    // p0------ 
    // | /v   |
    // p1------ 

    let pStart; 
    let pEnd;

    if (v.x < v.y){
        let p0 = new Point(bounds.x,bounds.y+bounds.height);
        let p1 = new Point(bounds.x,bounds.y);
    
        let pStart = p1;
        let pEnd = new Point(bounds.x+bounds.width,bounds.y);

            let a = (p1.y-p0.y)/v.y;
            let pxNew = p0.x+v.x*a;
            pStart.x = Math.min(pStart.x,pxNew); 
            pEnd.x = Math.max(pEnd.x,pEnd.x + (pxNew-p1.x));
        
            // calculate start distance to achieve correct distance between lines
            let v0 = new Point(v.x,v.y);
            let v1 = new Point(-v.y*options.distance,-v.x*options.distance);
            
            let b = v1.y/v0.y;
            let dx = Math.abs(v0.x*b + v1.x);
            

            for (let i=pStart.x ;i<pEnd.x; i+=dx){
                drawHatchLine(path, new Point(i,pStart.y),v,options);
            }
    }else{
        let p0 = new Point(bounds.x + bounds.width,bounds.y);
        let p1 = new Point(bounds.x,bounds.y);
    
        let pStart = p1;
        let pEnd = new Point(bounds.x,bounds.y+bounds.height);

            let a = (p1.x-p0.x)/v.x;
            let pyNew = p0.y+v.y*a;
            pStart.y = Math.min(pStart.y,pyNew); 
            pEnd.y = Math.max(pEnd.y,pEnd.y + (pyNew-p1.y));
        
            // calculate start distance to achieve correct distance between lines
            let v0 = new Point(v.x,v.y);
            let v1 = new Point(-v.y*options.distance,-v.x*options.distance);

            let b = v1.x/v0.x;
            let dy = Math.abs(v0.y*b + v1.y);

            for (let i=pStart.y ;i<pEnd.y; i+=dy){
                drawHatchLine(path, new Point(pStart.x,i),v,options);
            }
    }

    



}

function drawHatchLine(object, pStart, v,options){

    // get intersections with test line
    let end = new Point(pStart.x,pStart.y);
    end.x +=v.x*100000;
    end.y += v.y*100000;
    let testLine = new Path.Line(pStart, end);
    let intersections = testLine.getIntersections(object);
    testLine.remove();

    let intersectionGroup = new Group();

    // draw hat line parts
    for (let i = 1; i < intersections.length; i++) {
        let p0 = intersections[i-1].point;
        let p1 = intersections[i].point;
        let pm = new Point(p0.x + 0.5*(p1.x-p0.x),p0.y + 0.5*(p1.y-p0.y));

        if(object.contains(pm)){

            let intersectionPath = new Path.Line(
                p0,p1
            );
            if (options.subdivide != -1){
                subdividePath(intersectionPath,options);
            }
            intersectionPath.parent = intersectionGroup;
            intersectionPath.strokeColor = options.strokeColor;
        }    
    }
}


function readHatchOptions(options) {
    // set hatch options
    options = options ? options : {};
    options.style = options.style ? options.style : 'line';
    options.distance = options.distance ? options.distance : 10;
    options.angle = options.angle ? options.angle : 0;
    options.strokeColor = options.strokeColor ? options.strokeColor : 'black';
    options.subdivide = options.subdivide ? options.subdivide : -1;
    return options;
}

function readSubdivideOptions(options) {
    // set subdivide options
    options = options ? options : {};
    options.distance = options.distance ? options.distance : 10;
    return options;
}

