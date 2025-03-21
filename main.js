let legemer = []; //liste til alle legemer
let gitterStr = 200;
let G = 1;

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
        push(); //push & pop da translate() tilføjer på sidste translate()
            //noStroke();
            fill(legeme.farve);
            translate(legeme.position.x, -20, legeme.position.y)
            sphere(20);
        pop();
        legeme.opdatere();
    }

}



class Legeme {
    // pos, startHastighed er 2D vector og farve er en liste
    constructor(pos, masse, startHastighed, farve=[255, 255, 255]){
        this.position = pos.copy();
        this.masse = masse;
        this.hastighed = startHastighed.copy()
        this.acceleration = createVector(0, 0)
        this.farve = farve;
    }

    create(){
        legemer.push(this);
    }

    opdatere(){
        let dt = 1; //tidsintervalet delta t 

        this.acceleration = createVector(0, 0);

        for (let andre of legemer){
            if (this !== andre){
                let kraftensRetning = p5.Vector.sub(andre.position, this.position);

                let afstandSq = kraftensRetning.magSq(); //afstanden i anden
                let afstand = sqrt(afstandSq);

                let kraftensStr = (G*this.masse*andre.masse)/(afstandSq); //newtowns formel for kraft

                kraftensRetning.normalize();
                
                let kraften = kraftensRetning.mult(kraftensStr); //bestem kraft vektoren ved at gange kraftensretning vec med dets str

                this.acceleration.add(p5.Vector.div(kraften, this.masse)) //F=ma, derfor a=F/m
            }
        }
        
        this.hastighed.add(p5.Vector.mult(this.acceleration, dt))
        this.position.add(p5.Vector.mult(this.hastighed, dt))
    }
}