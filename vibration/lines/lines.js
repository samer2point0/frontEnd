'use strict';
const canvas=$('#canvas')[0];
const ctx=canvas.getContext('2d');
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
const Cwidth=canvas.width, Cheight=canvas.height;

const Config=presets['perfectHorizontal'];
let dynamic=new Dynamic();
dynamic.createSprings();
dynamic.move();

function Spring(loc, springCoef=Config.springCoef, rad=Config.radius, elasticityCoef=Config.elasticityCoef){
  this.origin=loc;
  this.displacement=0;
  this.speed=0;
  this.springCoef=springCoef;
  this.energy=0;
  this.radius=rad;
  let self=this;
  this.rest=function(){
    return self.displacement==0 && self.speed==0;
  }
  this.onHandle=function(x,y){
    let x0=self.origin[0], y0=self.origin[1];
    let rad=self.radius;
    return ((x0-x)*(x0-x)+(y0-y)*(y0-y))< rad*rad;
  }
  this.drag=function(newy) {
    self.displacement=newy-self.origin[1];
    self.energy=0.5*Math.pow(self.displacement,2)*self.springCoef;
  }
  this.update=function(dt){
    self.speed=self.speed-self.springCoef*self.displacement*dt;
    self.displacement+=Math.round(self.speed*dt);
  }
  this.draw=function(mode=Config.drawMode){
    return render.drawSpring[mode](self);
  }

}

function Dynamic(){
  this.clickedSpring=null;
  this.springs=[];
  this.dragLocation=null;
  this.animID=null;
  this.past=0;
  let self=this;

  this.createSprings=function(no=Config.springsNo, orient=Config.orient){
    for(let i=0; i<no; i++){
      this.springs[i]=new Spring([Cwidth/2,Cheight/2]);
      this.springs[i].draw();
    }
  }

  this.getClicked= function(x,y){
    //makesure you dont loop over inhereted properties
    for(let i=0; i<self.springs.length; i++){
      if(self.springs[i].onHandle(x,y)){
        self.clickedSpring=self.springs[i];
      }
    }
  }

  this.move=function(){
    let shouldClear=render.clearMode;
    shouldClear? ctx.clearRect(0,0, Cwidth, Cheight) : null;
    for(let i=0; i<self.springs.length; i++){
      let dt=(Date.now()-self.past)/1000;
      let spring=self.springs[i];
      if(self.clickedSpring!=spring && !spring.rest()){
        spring.update(dt);
      }
      else if (self.clickedSpring==spring && self.dragLocation) {
        spring.drag(self.dragLocation[1]);
      }
      spring.draw();
      self.past=Date.now();
    }
    self.animID=window.requestAnimationFrame(self.move);
  }

  this.dragUpdate=function(x,y){
    if(!!self.clickedSpring){
      self.dragLocation=[x,y];
    }
  }
}

function eventHandler(e={}){
  if(e.type=='mousedown'){
    dynamic.getClicked(e.clientX,e.clientY)
  }
  else if(e.type=='mouseup') {
    dynamic.clickedSpring=null;
  }
  else if(e.type=='mousemove') {
    dynamic.dragUpdate(e.clientX,e.clientY);
  }
}
canvas.onmousedown=function(e){
  canvas.addEventListener('mousemove',(e)=>{eventHandler(e)});
  eventHandler(e);
}
canvas.onmouseup=function(e){
  canvas.removeEventListener('mousemove',eventHandler);
  eventHandler(e);
}
