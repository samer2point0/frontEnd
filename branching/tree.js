'use strict';
const canvas= document.getElementById('canvas')
const ctx= canvas.getContext('2d');
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
const Config={
  maxConc: 200,
  branchProb: 0.0, //depends on dx
  minBAngle:10,
  maxBAngle:30,
  AngleInc:0,
  minWander:0,
  maxWander:1,
  minShrink:0.95,//0.9-->1
  maxShrink:1,
  bShrink:0.8,
  shrinkLimit:1.5,
  dx:10,
  minWidth:1,
  startWidth:30,
};

  let tree=new Array;
  let branch=new Branch(Config.startWidth, 0, [Math.round(canvas.width/2),canvas.height],0);
  tree.unshift(branch);
  window.requestAnimationFrame(grow);


function Branch(wid, gen, loc, angle) {
  this.sign=(Math.random()>0.5 ? 1 : -1);
  this.generation=gen||1;
  this.location=loc;
  this.startWidth=wid;
  this.width=wid*Config.bShrink;
  this.angle=angle+random(Config.minBAngle, Config.maxBAngle)*this.sign;
  this.branchTime= function(){
    if((this.startWidth/this.width)>=Config.shrinkLimit || (Math.random()<Config.branchProb)) return true;
    else return false;
  }
  this.endOfBranch= function(){
    if((this.width<=Config.minWidth) || outside(this.location))
      return true;
    else return false;
  }
  this.drawBranch= function(){
    //debugger;
    //console.log(this.location);
    ctx.lineWidth=Math.round(this.width);
    ctx.beginPath();
    ctx.moveTo(Math.round(this.location[0]),Math.round(this.location[1]));
    this.location=angular(this.location,this.angle);
    //console.log(this.location);
    //debugger;
    ctx.lineTo(Math.round(this.location[0]),Math.round(this.location[1]));
    ctx.stroke();
  }
  this.updateBranch= function(){
    this.width*=random(Config.minShrink,Config.maxShrink);
    this.angle=this.angle+(random(Config.minWander,Config.maxWander)+this.generation*Config.AngleInc)*(Math.random()<0.5 ? 1: -1);
    console.log(this.location, this.width, this.generation,this.angle);
  }
}

function grow(){
  let poppedBranch=tree.pop();
  let branch;
  if(!poppedBranch) return null;
  //debugger;
  if(!poppedBranch.endOfBranch()){
    poppedBranch.drawBranch();
    poppedBranch.updateBranch();
    if(poppedBranch.branchTime() && tree.length<Config.maxConc){
      let gen=poppedBranch.generation+1;
      branch=new Branch(poppedBranch.width, gen, poppedBranch.location,poppedBranch.angle);
      tree.unshift(branch);
      branch=new Branch(poppedBranch.width, gen, poppedBranch.location,poppedBranch.angle);
      tree.unshift(branch);
    }
    else {
      tree.unshift(poppedBranch);
    }
  }
  window.requestAnimationFrame(grow);
}

function outside(loc){
  return loc[0]>canvas.width || loc[1]>canvas.height || loc[0]<0 || loc[1]<0;
}

function angular(loc, angle){
  let x=loc[0];
  let y=loc[1];
  let angleRad=angle*Math.PI/180;
  let newx=x+Config.dx*Math.sin(angleRad);
  let newy=y-Config.dx*Math.cos(angleRad);
  return [newx,newy];
}

function random(start, end ){
  return Math.random()*(end-start)+start;
}
