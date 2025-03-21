let legemer = []; // liste til alle legemer
let G = 1; // Gravitationens konstant
let gitterStr = 400;
let gitterAfstand = 20;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);


  //legemer.push(new Legeme(createVector(0, 0), 200, createVector(0, 0)))

  //legemer.push(new Legeme(createVector(200, 0), 20, createVector(0, 0)))

  legemer.push(
    new Legeme(createVector(0, 0), 1000, createVector(0, 0), [255, 255, 0])
  );
  legemer.push(
    new Legeme(createVector(-300, -300), 100, createVector(1, -1), [0, 255, 0])
  );
  legemer.push(
    new Legeme(
      createVector(-270, -270),
      1,
      createVector(2, -2),
      [255, 255, 255]
    )
  );
}

function draw() {

  push();
    (createButton("Reset Kamera").position(width-100, height-40)).mousePressed(()=>{
    camera(0, 0, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0)
    });
  pop();
  
  background(0);
  orbitControl();

  rotateX(1);

  //opdatere hvert legeme
  for (let legeme of legemer) {
    legeme.opdatere(legemer);
  }

  stroke(255);
  noFill();
  for (let x = -gitterStr; x < gitterStr; x += gitterAfstand) {
    //for-løkke til itterere x-positioner
    beginShape(); //start af vertexes
    for (let y = -gitterStr; y < gitterStr; y += gitterAfstand) {
      //for-løkke til y-pos
      let z = 0; //
      for (let legeme of legemer) {
        let d = dist(x, y, legeme.position.x, legeme.position.y);
        z += (-legeme.masse * 20) / (d + 10);
      }
      vertex(x, y, z);
    }
    endShape();
  }

  // samme concept i den anden vej
  for (let y = -gitterStr; y < gitterStr; y += gitterAfstand) {
    beginShape();
    for (let x = -gitterStr; x < gitterStr; x += gitterAfstand) {
      let z = 0;
      for (let legeme of legemer) {
        let d = dist(x, y, legeme.position.x, legeme.position.y);
        z += (-legeme.masse * 20) / (d + 10);
      }
      vertex(x, y, z);
    }
    endShape();
  }

  // tegb legemerne
  noStroke();
  for (let m of legemer) {
    push();
    fill(m.farve);
    translate(m.position.x, m.position.y, 0);
    sphere(10);
    pop();
  }
}

class Legeme {
  // position og startHastighed er 2D-vektorer, og farve er en liste
  constructor(pos, masse, startHastighed, farve = [255, 0, 0]) {
    this.position = pos.copy();
    this.hastighed = startHastighed.copy();
    this.acceleration = createVector(0, 0);
    this.masse = masse;
    this.farve = farve;
  }

  opdatere(alleLegemer) {
    let dt = 0.5; // tidsintervallet delta t
    this.acceleration = createVector(0, 0);

    for (let andre of alleLegemer) {
      if (this !== andre) {
        let kraftRetning = p5.Vector.sub(andre.position, this.position);
        let afstandSq = kraftRetning.magSq(); // afstanden i anden

        let kraftStr = (G * this.masse * andre.masse) / (afstandSq + 100);

        kraftRetning.normalize();
        let kraft = p5.Vector.mult(kraftRetning, kraftStr);
        // Ifølge F = m * a  =>  a = F/m
        this.acceleration.add(p5.Vector.div(kraft, this.masse));
      }
    }

    // Opdater  hastiguhen og position
    this.hastighed.add(p5.Vector.mult(this.acceleration, dt));
    this.position.add(p5.Vector.mult(this.hastighed, dt));
  }
}
