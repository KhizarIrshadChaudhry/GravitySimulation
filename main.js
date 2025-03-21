
function setup(){
    createCanvas(windowWidth, windowHeight, WEBGL);
    background(200);

}

function draw(){
    background(200);
    orbitControl()
    sphere(100, 10, 20)
}