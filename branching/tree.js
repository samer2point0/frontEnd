'use strict';
const canvas= document.getElementById('canvas')
const ctx= canvas.getContext('2d');
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
const Cwidth=canvas.width, Cheight=canvas.height;
const presets={
  regularOldTree:{
    maxConc: 500,
    dx:10,
    branchProb: 0.04,
    minBAngle:15,
    maxBAngle:25,
    minWander:-1,
    maxWander:2,
    minShrink:0.92,
    maxShrink:1,
    bProbInc:1.15,
    bShrink:.99,
    wanderAngleInc:1.1,
    shrinkLimit:1.5,
    minWidth:1,
    startWidth:30,
    startColorWidth:1.75,
    leavesColor:'#0f4e0f',
    primaryColor:'#000'
  }
}

let Config=Configurate(presets.regularOldTree);
let tree=null;

canvas.onclick=function(e){
  if(!!tree){
    tree.doneFlag=true;
    window.cancelAnimationFrame(tree.animID);
  }
  Config=Configurate();
  tree=new Tree([e.clientX,e.clientY]);
  tree.grow();
}



function Tree(startLocation=[Math.round(Cwidth/2),Cheight]){
  this.root=new Branch(Config.startWidth, 1, startLocation,0);
  this.branches=[this.root];
  this.animID=null;
  this.doneFlag=false;
  let self=this;
  this.grow = function(){
    self.doneFlag=false;
    let enterTime=Date.now();
    let endBranch=self.branches[0];
    while(true){
      let poppedBranch=self.branches.pop();
      if (poppedBranch==endBranch) self.doneFlag=true;
      let branch;
      if(!poppedBranch) return null;
      if(!poppedBranch.endOfBranch()){
        poppedBranch.drawBranch();
        poppedBranch.updateBranch();
        if(poppedBranch.branchTime() && self.branches.length<Config.maxConc){
          let gen=poppedBranch.generation+1;
          branch=new Branch(poppedBranch.width, gen, poppedBranch.location,poppedBranch.angle);
          self.branches.unshift(branch);
          branch=new Branch(poppedBranch.width, gen, poppedBranch.location,poppedBranch.angle);
          self.branches.unshift(branch);
        }
        else {
          self.branches.unshift(poppedBranch);
        }
      }
      if(Date.now-enterTime>=6 || self.doneFlag==true) break;
    }

    self.animID=window.requestAnimationFrame(self.grow);
  }
}


function Branch(wid, gen, loc, angle) {
  this.sign=(Math.random()>0.5 ? 1 : -1);
  this.generation=gen;
  this.location=loc;
  this.startWidth=wid;
  this.width=wid*Math.pow(Config.bShrink,this.generation);
  this.angle=angle+(this.generation==1 ? 0 : random(Config.minBAngle, Config.maxBAngle)*this.sign);
  this.branchProb=Config.branchProb*Math.pow(Config.bProbInc,this.generation);
  this.branchTime= function(){
    if((this.startWidth/this.width)>=Config.shrinkLimit || (Math.random()<this.branchProb)) return true;
    else return false;
  }
  this.endOfBranch= function(){
    if((this.width<=Config.minWidth) || outside(this.location))
      return true;
    else return false;
  }
  this.drawBranch= function(){
    let newLocation=findLoc(this.location,this.angle);
    drawSegment(this.location, newLocation, this.width);
  }
  this.updateBranch= function(){
    this.width*=random(Config.minShrink,Config.maxShrink);
    let angleInc=random(Config.minWander,Config.maxWander)*Math.pow(Config.wanderAngleInc,this.generation);
    this.angle+=angleInc*this.sign;
    this.location=findLoc(this.location,this.angle);
    console.log(this.width, this.location, this.angle);
  }
}


function drawSegment(startLoc, endLoc, width){
  if (width<Config.startColorWidth){
    ctx.strokeStyle=Config.leavesColor;
    ctx.fillStyle=Config.leavesColor;
  }
  else{
     ctx.strokeStyle=Config.primaryColor;
     ctx.fillStyle=Config.primaryColor;
   }

  ctx.beginPath();

  width=Math.round(width)
  let x1=Math.round(startLoc[0]), y1=Math.round(startLoc[1]);
  let x2=Math.round(endLoc[0]), y2=Math.round(endLoc[1])
    ctx.lineWidth=width;
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
    ctx.closePath();
}

function outside(loc){
  return loc[0]>Cwidth || loc[1]>Cheight || loc[0]<0 || loc[1]<0;
}

function findLoc(loc, angle){
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

function Configurate(preset={}){
  let Config={};
  if('minWidth' in preset){
    Config=preset;
    document.getElementsByName('maxConcurrent')[0].value=Config.maxConc;
    document.getElementsByName('incSize')[0].value=Config.dx;
    document.getElementsByName('branchProbability')[0].value=Config.branchProb;
    document.getElementsByName('minBranchAngle')[0].value=Config.minBAngle;
    document.getElementsByName('maxBranchAngle')[0].value=Config.maxBAngle;
    document.getElementsByName('minWanderAngle')[0].value=Config.minWander;
    document.getElementsByName('maxWanderAngle')[0].value=Config.maxWander;
    document.getElementsByName('minWidthShrink')[0].value=Config.minShrink;
    document.getElementsByName('maxWidthShrink')[0].value=Config.maxShrink;
    document.getElementsByName('perGenProbInc')[0].value=Config.bProbInc;
    document.getElementsByName('perGenShrinkInc')[0].value=Config.bShrink;
    document.getElementsByName('perGenWanderInc')[0].value=Config.wanderAngleInc;
    document.getElementsByName('branchShrinkLimit')[0].value=Config.shrinkLimit;
    document.getElementsByName('minWidth')[0].value=Config.minWidth;
    document.getElementsByName('startWidth')[0].value=Config.startWidth;
    document.getElementsByName('startColorWidth')[0].value=Config.startColorWidth;
    document.getElementsByName('primaryColor')[0].value=Config.primaryColor;
    document.getElementsByName('leavesColor')[0].value=Config.leavesColor;
  }
  else{
    Config.maxConc=Number(document.getElementsByName('maxConcurrent')[0].value);
    Config.dx=Number(document.getElementsByName('incSize')[0].value);
    Config.branchProb=Number(document.getElementsByName('branchProbability')[0].value);
    Config.minBAngle=Number(document.getElementsByName('minBranchAngle')[0].value);
    Config.maxBAngle=Number(document.getElementsByName('maxBranchAngle')[0].value);
    Config.minWander=Number(document.getElementsByName('minWanderAngle')[0].value);
    Config.maxWander=Number(document.getElementsByName('maxWanderAngle')[0].value);
    Config.minShrink=Number(document.getElementsByName('minWidthShrink')[0].value);
    Config.maxShrink=Number(document.getElementsByName('maxWidthShrink')[0].value);
    Config.bProbInc=Number(document.getElementsByName('perGenProbInc')[0].value);
    Config.bShrink=Number(document.getElementsByName('perGenShrinkInc')[0].value);
    Config.wanderAngleInc=Number(document.getElementsByName('perGenWanderInc')[0].value);
    Config.shrinkLimit=Number(document.getElementsByName('branchShrinkLimit')[0].value);
    Config.minWidth=Number(document.getElementsByName('minWidth')[0].value);
    Config.startWidth=Number(document.getElementsByName('startWidth')[0].value);
    Config.startColorWidth=Number(document.getElementsByName('startColorWidth')[0].value);
    Config.primaryColor=document.getElementsByName('primaryColor')[0].value;
    Config.leavesColor=document.getElementsByName('leavesColor')[0].value;
  }
  return Config
}
