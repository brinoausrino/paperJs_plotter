const { paper,view, Color,Path,Point } = require('paper-jsdom-canvas');
var path = require('path');
var fs = require('fs');
var util = require('util');
var stream = require('stream');


var hershey = require('../paperJs_plotter/hershey');
var trueType = require('./trueType');
var hatching = require('./lineTools');
var paperTools = require('./paperTools');


function textHershey() {
    var canvas = paper.createCanvas(1200, 900);
        paper.setup(canvas);
        var style = {
            fillColor: new Color(0, 0, 0,0),
            strokeColor: new Color(0,0,0),
            strokeWidth: 1.5
        };

        var style2 = {
            fillColor: new Color(0, 0, 0),
            strokeColor: new Color(0, 0, 0),
            strokeWidth: 0
        };

  /*
        trueType.addFont("dosis","model/fonts/Dosis-Bold.ttf");
        let t= trueType.createText("Plot",{position : new Point(100,500),alignment:"left",font:"dosis",size:30});
        let t2 = trueType.createText("Calendar",{position : new Point(100,540),alignment:"left",font:"dosis",size:30});
        t2.style = style2;
        t.style = style2;

        var circle = new Path.Circle([250, 510],60);
        circle.style = style;
        var rect = new Path.Rectangle([190,506],[64,40]);
        let fin = circle.subtract(rect,{insert:true});
        rect.remove();
        circle.remove()
        hatching.hatch(fin,{angle:45,distance:25});
*/
/*
        
        var first = new Path.Circle([150, 150],100);
        first.style = style;
        hershey.createTextOnCircle("left",{position : new Point(150,150),orientation:"cw",alignment:"left",startAngle:0});
        hershey.createTextOnCircle("center",{position : new Point(150,150),orientation:"cw",alignment:"center",startAngle:0});
        hershey.createTextOnCircle("right",{position : new Point(150,150),orientation:"cw",alignment:"right",startAngle:0});
        hershey.createTextOnCircle("left",{position : new Point(150,150),orientation:"ccw",alignment:"left",startAngle:0});
        hershey.createTextOnCircle("center",{position : new Point(150,150),orientation:"ccw",alignment:"center",startAngle:0});
        hershey.createTextOnCircle("right",{position : new Point(150,150),orientation:"ccw",alignment:"right",startAngle:0});

        var second = new Path.Circle([450, 150],100);
        second.style = style;
        hershey.createTextOnCircle("0° test",{position : new Point(450,150),orientation:"cw",alignment:"center",startAngle:0});
        hershey.createTextOnCircle("120° test",{position : new Point(450,150),orientation:"cw",alignment:"center",startAngle:120});
        hershey.createTextOnCircle("240° test",{position : new Point(450,150),orientation:"cw",alignment:"center",startAngle:240});
        hershey.createTextOnCircle("0° test",{position : new Point(450,150),orientation:"ccw",alignment:"center",startAngle:0});
        hershey.createTextOnCircle("120° test",{position : new Point(450,150),orientation:"ccw",alignment:"center",startAngle:120});
        hershey.createTextOnCircle("240° test",{position : new Point(450,150),orientation:"ccw",alignment:"center",startAngle:240});
*/


        let t1 = hershey.createText("1234567890 no subdiv ",{position : new Point(150,50), size:5});

        let t11 = hershey.createText("1234567890 distance 5 ",{position : new Point(150,60), size:5});
        let t2 = hershey.createText("1234567890 distance 1 ",{position : new Point(150,70), size:5});
        let t3 = hershey.createText("1234567890 distance 0.5",{position : new Point(150,80), size:5});
        let t4 = hershey.createText("1234567890 distance 0.1",{position : new Point(150,90), size:5});
        
        hatching.subdivideItem(t11,{distance:5});
        hatching.subdivideItem(t2,{distance:1});
        hatching.subdivideItem(t3,{distance:0.5});
        hatching.subdivideItem(t4,{distance:0.1});


        


        paper.view.update();

        var svg = paper.project.exportSVG({ asString: true });

        fs.writeFile(path.resolve('./out.svg'), svg, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });

        return canvas;

}
module.exports.textHershey = textHershey;

function textTrueType() {
    var canvas = paper.createCanvas(1200, 900);
        paper.setup(canvas);
        var style = {
            fillColor: new Color(1, 1, 0, 0.5),
            strokeColor: new Color(0, 0, 0),
            strokeWidth: 1.5
        };

        trueType.addFont("dosis","model/fonts/Dosis-Bold.ttf");
  
        var first = new Path.Circle([150, 150],100);
        first.style = style;

        trueType.createText("2023",{position : new Point(100,500),alignment:"left",font:"dosis"});
        trueType.createText("2023",{position : new Point(100,530),alignment:"center",font:"dosis"});
        trueType.createText("2023",{position : new Point(100,560),alignment:"right",font:"dosis"});


        paper.view.update();

        var svg = paper.project.exportSVG({ asString: true });

        fs.writeFile(path.resolve('./out.svg'), svg, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });

        return canvas;

}

module.exports.textTrueType = textTrueType;

function hatch() {
    var canvas = paper.createCanvas(1200, 900);
        paper.setup(canvas);
        var style = {
            fillColor: new Color(1, 1, 0, 0.5),
            strokeColor: new Color(0, 0, 0),
            strokeWidth: 1.5
        };
  


        var second = new Path.Circle([400, 600],100);
        second.style = style;
        //hatching.hatch(second,{angle:45});
        //hatching.hatch(second,{angle:300});

        var from = new Point(500, 500);
            var to = new Point(750, 750);
            var p = new Path.Line(from, to);
            p.strokeColor = 'black';
        hatching.subdivideLine(p,{});

        var center = new Point(150, 150);
            var points = 12;
            var radius1 = 30;
            var radius2 = 80;

        for (let i=0; i<10;i++){
            var star = new Path.Star(new Point(150 + i%5* 200, 150 + parseInt(i/5)*200), points, radius1, radius2);
            star.style = style;
            hatching.hatch(star,{angle:i*25})
        }

        paper.view.update();

        var svg = paper.project.exportSVG({ asString: true });

        fs.writeFile(path.resolve('./out.svg'), svg, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });

        return canvas;

}

module.exports.hatch = hatch;


function layer() {
    let rawdata = fs.readFileSync('paperJs_plotter/sampleCanvas.json');
    let json = JSON.parse(rawdata);

    let canvas = paperTools.createCanvasFromJson(json,paper)

        var style = {
            fillColor: new Color(1, 1, 0, 0.5),
            strokeColor: new Color(0, 0, 0),
            strokeWidth: 1.5
        };
  


        var second = new Path.Circle([400, 600],100);
        second.style = style;

        paperTools.styleAllElements(paper.project);

        paper.view.update();

        var svg = paper.project.exportSVG({ asString: true });

        fs.writeFile(path.resolve('./out.svg'), svg, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });

        return canvas;

}

module.exports.layer = layer;

function paperSize() {
    var canvas = paper.createCanvas(700, 900);
        paper.setup(canvas);
    
        let l = new Path.Line(new Point(0,0),new Point(600,800));
            l.strokeColor = 'black';
  
        hershey.createText("TL",{position : new Point(100,100)});
        hershey.createText("BL",{position : new Point(100,800)});
        hershey.createText("TR",{position : new Point(650,100)});
        hershey.createText("BR",{position : new Point(650,800)});

        for (let i=1;i<10;i++){
            let l = new Path.Line(new Point(i*10,380),new Point(i*10,395));
            l.strokeColor = 'black';
            hershey.createText(""+i,{position : new Point(i*10,400),size:5});
            let t = new Path.Line(new Point(350,i*10),new Point(365,i*10));
            t.strokeColor = 'black';
            hershey.createText(""+i,{position : new Point(370,i*10),size:5});
            let r = new Path.Line(new Point(700-i*10,380),new Point(700-i*10,395));
            r.strokeColor = 'black';
            hershey.createText(""+i,{position : new Point(700-i*10,400),size:5});
            let b = new Path.Line(new Point(350,900-i*10),new Point(365,900-i*10));
            hershey.createText(""+i,{position : new Point(370,900-i*10),size:5});
            b.strokeColor = 'black';

            for (let c=1;c<5;c++){
                let l = new Path.Line(new Point(i*10+c*2,380),new Point(i*10+c*2,385));
                l.strokeColor = 'black';
                let t = new Path.Line(new Point(350,i*10+c*2),new Point(355,i*10+c*2));
            t.strokeColor = 'black';
            let r = new Path.Line(new Point(700-i*10+c*2,380),new Point(700-i*10+c*2,385));
            r.strokeColor = 'black';
            let b = new Path.Line(new Point(350,900-i*10+c*2),new Point(355,900-i*10+c*2));
            b.strokeColor = 'black';
            }
        }
        
      
        paperTools.generateBorderPoints(paper,new Point(0,0),new Point(700,900));

        paper.view.update();

        var svg = paper.project.exportSVG({ asString: true });

        fs.writeFile(path.resolve('./out.svg'), svg, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });

        return canvas;

}
module.exports.paperSize = paperSize;