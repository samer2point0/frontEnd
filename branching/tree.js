'use strict';
const Canvas= document.getElementById('canvas').getContext('2d');
const StartLength=150;
//const minLength= 30;
const StartWidth=30;
const MinWidth=2;
const StartAngle=0;
const Branchfactor=2;
const StartReductionFactor=0.7;
const StabilityFactor=1.1;
const widthAngleFactor=140;
const dx=5;
const ReductionLimit=1.5;
const StartLocation = [Math.round(window.innerWidth/2),window.innerHeight];

let queue=new Array;
let branch=new Branch(StartWidth, StartLocation,1);
queue.unshift(branch);
branch=new Branch(StartWidth, StartLocation,-1);
queue.unshift(branch);
window.requestAnimationFrame(grow);

function Branch(startwidth, loc, sign) {
  this.location=loc;
  this.startWidth=startwidth;
  this.width=startwidth;
  this.angle=startwidth*widthAngleFactor*sign;
  this.reductionFactor=(startwidth/StartWidth)*StabilityFactor*StartReductionFactor;
  this.branchTime=function(){
    if((this.startWidth/this.width)>=ReductionLimit) return true;
    else return false;
  }
  this.endOfBranch=function(){
    if((this.width<=MinWidth) || outside(this.location))
      return true;
    else return false;
  }
  this.drawBranch=function(){
    Canvas.beginPath();
    Canvas.moveTo(this.location[0],this.location[1]);
    this.location=angular(this.location,this.angle);
    Canvas.lineTo(this.location[0],this.location[1]);
    Canvas.stroke();
    Canvas.closePath();
  }
  this.updateBranch=function(){
    this.width=Math.round(this.width*this.reductionFactor);
    this.angle=(1/this.width)*widthAngleFactor;
    this.endOfBranch();
  }
}

function grow(){
  let poppedBranch=queue.pop();
  let branch;
  if(!poppedBranch.endOfBranch()){
    poppedBranch.drawBranch();
    poppedBranch.updateBranch();
    if(poppedBranch.branchTime()){
      branch=new Branch(poppedBranch.width, poppedBranch.location,1);
      queue.unshift(branch);
      branch=new Branch(poppedBranch.width, poppedBranch.location,-1);
      queue.unshift(branch);
    }
    else {
      queue.unshift(poppedBranch);
    }
  }
  if(queue[0]) window.requestAnimationFrame(grow);
}


function outside(loc){
  return loc[0]>window.innerWidth || loc[1]>window.innerHeight;
}
function angular(loc, angle){
  let x=loc[0];
  let y=loc[1];
  let angleRad=angle*Math.PI/360;
  let newx=loc[0]+Math.round(dx*Math.cos(angleRad));
  let newy=loc[0]+Math.round(dx*Math.sin(angleRad));
  debugger;
  return [newx,newy];
}
