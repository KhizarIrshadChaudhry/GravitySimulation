let legemer = [];
let G = 1;
let gitterStr = 250;
let gitterAfstand = 20;

let uiDiv;
let posXLabel, posYLabel, velXLabel, velYLabel, masseLabel;
let posXInput, posYInput, velXInput, velYInput, masseInput;

let visHastighedBox, visKraftBox;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // UI container 
  uiDiv = createDiv();
  uiDiv.position(20, 20);
  uiDiv.style('color', '#fff'); 

  // pos X
  posXLabel = createSpan('Position X: ');
  posXLabel.parent(uiDiv);
  posXInput = createInput('0');
  posXInput.size(50);
  posXInput.parent(uiDiv);
  createElement('br').parent(uiDiv);    

  // pos Y
  posYLabel = createSpan('Position Y: ');
  posYLabel.parent(uiDiv);
  posYInput = createInput('0');
  posYInput.size(50);
  posYInput.parent(uiDiv);
  createElement('br').parent(uiDiv);

  // hast X
  velXLabel = createSpan('Hastighed X: ');
  velXLabel.parent(uiDiv);
  velXInput = createInput('0');
  velXInput.size(50);
  velXInput.parent(uiDiv);
  createElement('br').parent(uiDiv);

  // hast Y
  velYLabel = createSpan('Hastighed Y: ');
  velYLabel.parent(uiDiv);
  velYInput = createInput('0');
  velYInput.size(50);
  velYInput.parent(uiDiv);
  createElement('br').parent(uiDiv);

  // Masse
  masseLabel = createSpan('Masse: ');
  masseLabel.parent(uiDiv);
  masseInput = createInput('100');
  masseInput.size(50);
  masseInput.parent(uiDiv);
  createElement('br').parent(uiDiv);

  

  // Knap til at oprette nyt legeme
  (createButton('Tilføj Legeme').parent(uiDiv)).mousePressed(tilføjLegeme);


  //vektorpile
  visHastighedBox = (createCheckbox('Vis hastigheds-vektor (grøn)', true).position(20, height-30)).style("color", "#00FF00");
  visKraftBox = (createCheckbox('Vis kraft-vektor (rød)', true).position(20, height-50)).style("color", "#FF0000");

  (createButton("Reset Kamera").position(width-100, height-40)).mousePressed(()=>{
    camera(0, 0, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0)
  }); //knap til at reset kamerat


  legemer.push(new Legeme(createVector(0, 0), 1000, createVector(0, 0), [255, 255, 0]));
  legemer.push(new Legeme(createVector(-300, -300), 100, createVector(1, -1), [0, 255, 0]));
  legemer.push(new Legeme(createVector(-270, -270), 1, createVector(2, -2), [255, 255, 255]));
}

function draw() {
  background(0);
  orbitControl();
  rotateX(1);

  // Opdater bevægelse for alle legemer
  for (let legeme of legemer) {
    legeme.opdatere(legemer);
  }

  // Tegn grid med deformation
  stroke(255);
  noFill();
  for (let x = -gitterStr; x < gitterStr; x += gitterAfstand) {
    beginShape();
      for (let y = -gitterStr; y < gitterStr; y += gitterAfstand) {
        let z = 0;
        for (let legeme of legemer) {
          let d = dist(x, y, legeme.position.x, legeme.position.y);
          z += -legeme.masse * 20 / (d + 10);
        }
        vertex(x, y, z);
      }
    endShape();
  }

  // Tegn gitter i den anden retning
  for (let y = -gitterStr; y < gitterStr; y += gitterAfstand) {
    beginShape();
      for (let x = -gitterStr; x < gitterStr; x += gitterAfstand) {
        let z = 0;
        for (let legeme of legemer) {
          let d = dist(x, y, legeme.position.x, legeme.position.y);
          z += -legeme.masse * 20 / (d + 10);
        }
        vertex(x, y, z);
      }
    endShape();
  }

  // Tegn legemer
  noStroke();
  for (let legeme of legemer) {
    push();
    fill(legeme.farve);
    translate(legeme.position.x, legeme.position.y, 0);
    sphere(10);

    
    
    strokeWeight(3);
    //linje for at vise hastighed og kraft retning
    if (visHastighedBox.checked()) {
      stroke(0, 255, 0);
      
      line(0, 0, 0, legeme.hastighed.x * 20, legeme.hastighed.y * 20, 0);
    }

    if (visKraftBox.checked()) {
      stroke(255, 0, 0);
      line(0, 0, 0, legeme.acceleration.x * 400, legeme.acceleration.y * 400, 0);
    }
    pop();

    
  }
}


function tilføjLegeme() {
  let x = parseFloat(posXInput.value());
  let y = parseFloat(posYInput.value());
  let vx = parseFloat(velXInput.value());
  let vy = parseFloat(velYInput.value());
  let masse = parseFloat(masseInput.value());

  legemer.push(new Legeme(createVector(x, y), masse, createVector(vx, vy)));
}

// Klassen Legeme
class Legeme {
  constructor(pos, masse, startHastighed, farve = [255, 0, 0]) {
    this.position = pos.copy();
    this.hastighed = startHastighed.copy();
    this.acceleration = createVector(0, 0);
    this.masse = masse;
    this.farve = farve;
  }

  opdatere(alleLegemer) {
    let dt = 0.5;
    this.acceleration.set(0, 0);

    for (let andre of alleLegemer) {
      if (andre !== this) {
        let kraftRetning = p5.Vector.sub(andre.position, this.position);
        let afstandSq = kraftRetning.magSq();
        let kraftStr = (G * this.masse * andre.masse) / (afstandSq + 100);
        kraftRetning.normalize();
        let kraft = p5.Vector.mult(kraftRetning, kraftStr);
        this.acceleration.add(p5.Vector.div(kraft, this.masse));
      }
    }

    this.hastighed.add(p5.Vector.mult(this.acceleration, dt));
    this.position.add(p5.Vector.mult(this.hastighed, dt));
  }
}
