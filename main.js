
function setup(){
    createCanvas(windowWidth, windowHeight, WEBGL);
    background(200);

}

function draw(){
    background(200);
    orbitControl()

    new Legeme(createVector(0, 0), 20, createVector(0, 0), [255, 0, 0]).create();

}

class Legeme {
    // pos, startHastighed er 2D vector og farve er en liste
    constructor(pos, masse, startHastighed, farve=[255, 255, 255]){
        this.position = pos.copy();
        this.masse = masse;
        this.startHastighed = startHastighed.copy()
        this.farve = farve;
    }

    create(){
        fill(this.farve);
        sphere(this.masse);
    }
}