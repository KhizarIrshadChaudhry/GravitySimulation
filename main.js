let legemer = []; //liste til alle legemer
let gitterStr = 200;

function setup(){
    createCanvas(windowWidth, windowHeight, WEBGL);
    background(200);

    new Legeme(createVector(0, 0), 20, createVector(0, 0), [255, 0, 0]).create();

    new Legeme(createVector(200, 100), 20, createVector(0, 0), [0, 255, 0]).create();
    

}

function draw(){
    background(200);
    orbitControl();

    
    for (let z = -gitterStr; z<gitterStr; z+=20){
        beginShape();
            vertex(-200, 0, z);
            vertex(200, 0, z);
        endShape();
    }

    for (let x = -gitterStr; x<gitterStr; x+=20){
        beginShape();
            vertex(x, 0, -200);
            vertex(x, 0, 200);
        endShape();
    }

    
    for (let legeme of legemer){
        fill(legeme.farve);
        translate(legeme.position.x, -20, legeme.position.y)
        sphere(20);
    }

}

class Legeme {
    // pos, startHastighed er 2D vector og farve er en liste
    constructor(pos, masse, startHastighed, farve=[255, 255, 255]){
        this.position = pos.copy();
        this.masse = masse;
        this.startHastighed = startHastighed.copy()
        this.acceleration = createVector(0, 0)
        this.farve = farve;
    }

    create(){
        legemer.push(this);
    }
}