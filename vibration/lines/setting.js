const presets={
  perfectSpringBall:{
    drawMode:'springBall',
    springCoef:50,
    radius:30,
    elasticityCoef:0,
    springsNo:1,
    orient:'vertical',
    colors:[],
  },
  perfectHorizontal:{
    drawMode:'horizontalLine',
    springCoef:20,
    radius:10,
    elasticityCoef:0,
    springsNo:1,
    orient:'horizontal',
    colors:[],
  }
};

var render={
  clearMode:false,
  drawSpring:{
    springBall:function(spring){
      let bandStretchCoef=1000;
      let x=spring.origin[0], y=spring.origin[1];
      let d=spring.displacement, r=spring.radius;
      ctx.beginPath();
      Math.abs(d)>r ? ctx.lineWidth=(1/Math.abs(d))*bandStretchCoef : ctx.lineWidth=5;
      ctx.moveTo(x,y);
      ctx.lineTo(x,y+d);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.arc(x,y+d,r,0,2*Math.PI);
      ctx.fill();
      ctx.closePath();
      render.clearMode=true;
    },
    horizontalLine:function(spring){
      //minwidth and d/coef depends on how many lines are there
      let x=spring.origin[0], y=spring.origin[1];
      let d=spring.displacement, r=spring.radius;
      let minWidth=80;
      ctx.lineWidth=minWidth;
      ctx.beginPath();
      ctx.moveTo(0,y);
      ctx.lineTo(Cwidth,y);
      ctx.stroke();
      ctx.closePath();

      ctx.beginPath();
      ctx.moveTo(0,y-d/2);
      ctx.lineTo(0,y+d/2);
      ctx.lineTo(Cwidth,y+d/2);
      ctx.lineTo(Cwidth,y-d/2);
      ctx.lineTo(0,y-d/2);
      ctx.fill();
      ctx.closePath();
      render.clearMode=true;
    }
  }
}
