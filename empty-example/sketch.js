// let gravity = -9.81;
const NORMAL_GRAVITY = -9.81;
let gravity = 9.81;
let gravity_was_flipped = false;

function seconds() {
  return millis() * 0.001;
}

class PhysicsObject {
  constructor(posX, posY, lastPosX, lastPosY) {
    this.posX = posX;
    this.posY = posY;
    this.lastPosX = lastPosX;
    this.lastPosY = lastPosY;
    this.deltaPosX;
    this.deltaPosY;
    this.blueValue = random(255);

    this.attractorPosX = 0;
    this.attractorPosY = 0;
    this.attractorStrength = 0;
  }

  UpdateMovement() {
    // calculate velocity based on last position
    this.deltaPosX = this.posX - this.lastPosX;
    this.deltaPosY = this.posY - this.lastPosY;

    // apply gravity
    this.deltaPosY += -gravity * (deltaTime*0.01) * (deltaTime*0.01);
    
    this.ApplyAttractionForce();
    
    // this.deltaPosX += 10*cos(seconds());
    // this.deltaPosY += 10*sin(seconds());
    
    // apply friction (slows object down)
    this.deltaPosY *= 0.996;
    this.deltaPosX *= 0.996;
    
    this.lastPosX = this.posX;
    this.lastPosY = this.posY;
    
    this.posX = this.lastPosX + this.deltaPosX;
    this.posY = this.lastPosY + this.deltaPosY;
    
    this.CollideWithWalls();
  }

  
  ApplyAttractionForce() {
    this.deltaPosX += (this.attractorPosX - this.posX) * this.attractorStrength;
    this.deltaPosY += (this.attractorPosY - this.posY) * this.attractorStrength;
  }

  SetAttractor(strength, xPos, yPos) {
    this.attractorStrength = strength;
    this.attractorPosX = xPos;
    this.attractorPosY = yPos;
  }


  CollideWithWalls(){
    // collides with right wall
    if(this.posX > width) {
      this.posX = width;
      this.lastPosX = this.posX + this.deltaPosX;
    }
    
    // collides with left wall
    else if (this.posX < 0) {
      this.posX = 0;
      this.lastPosX = this.posX + this.deltaPosX;
    }

    // collides with ground
    if(this.posY > height){
      this.posY = height;
      this.lastPosY = this.posY + this.deltaPosY;
    }
    
    // collides with ceiling
    if(this.posY < 0){
      this.posY = 0;
      this.lastPosY = this.posY + this.deltaPosY;
    }
    
  }
  
  
  GetAverageVelocity(){
    return (abs(this.deltaPosX)+abs(this.deltaPosY))*0.5;
  }

  
  Display() {
    let velocity = this.GetAverageVelocity()*4;
    noStroke();
    fill(
      (this.posX / width) * 255 * velocity * 0.05 ,
      (this.posY / height) * 255 * velocity * 0.05,
      this.blueValue * velocity * 0.05);
    
    strokeWeight((sin(seconds()*20 + this.blueValue)+1)*20 + 10);

    stroke(
      (this.posX / width) * 255 * velocity * 0.05 ,
      (this.posY / height) * 255 * velocity * 0.05,
      this.blueValue * velocity * 0.05
    );

    line(this.posX, this.posY, this.lastPosX, this.lastPosY);
    // ellipse(this.posX, this.posY, 30, 30);
    stroke(255, 0, 255);

    // draw line to attractor
   // line(this.posX, this.posY, this.attractorPosX, this.attractorPosY);
  }
}



const BALL_AMOUNT = 4;
const GRAVITY_SWITCHING_FREQ = 5;

function setup() {
  createCanvas(1000, 800);
  strokeCap(SQUARE);
  rectMode(CENTER);
  ellipseMode(CENTER);
  balls = [];
  for(i = 0; i<BALL_AMOUNT; i++ ){
    let newPosX = random(width);
    let newPosY = random(height)
    ball = new PhysicsObject(newPosX, newPosY, newPosX + random(-20,20), newPosY+random(-20,20));
    balls.push(ball);
  }


}

// function mousePressed() {
//   gravity = 0;
// }

// function mouseReleased() {
//   gravity = NORMAL_GRAVITY;
// }

function mousePressed() {
  for(i = 0; i<balls.length; i++){
    balls[i].SetAttractor(.002, mouseX, mouseY);
  }
}

function mouseDragged() {
  for(i = 0; i<balls.length; i++){
    balls[i].SetAttractor(.002, mouseX, mouseY);
  }
}

function mouseReleased() {
  for(i = 0; i<balls.length; i++){
    balls[i].SetAttractor(0, mouseX, mouseY);
  }
}

function draw() {
  //background(125);
  fill(0, 2);
  noStroke();
  rect(width/2, height/2, width, height);
  for(i = 0; i<balls.length; i++){
    balls[i].UpdateMovement();
    balls[i].Display();
  }

  

  let time_passed_in_seconds = millis() * 0.001;
  
  // if (Math.floor(time_passed_in_seconds) % GRAVITY_SWITCHING_FREQ != 0) {
  //   gravity_was_flipped = false;
  // }

  // if (Math.floor(time_passed_in_seconds) % GRAVITY_SWITCHING_FREQ == 0 && gravity_was_flipped == false) {
  //   background(255, 0, 0);
  //   gravity = -gravity;
  //   gravity_was_flipped = true;
  // }

}