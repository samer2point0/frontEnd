'use strict';
const Grid = document.getElementById('grid');
const P = document.getElementsByName('p')[0];
const Reset = document.getElementsByName('reset')[0];
const ColorIn = document.getElementsByName('color')[0];
const SizeIn = document.getElementsByName('size')[0];
const dtIn = document.getElementsByName('dt')[0];
let playFlag=false;
let dt=dtIn.value; //ms
let Color=ColorIn.value;
let Size=SizeIn.value;
let Cells=[];
createGrid();

Reset.addEventListener('click',
      (e)=>{
        clearGrid();
        playFlag=false;
        Color=ColorIn.value;
        Size=SizeIn.value;
        dt=dtIn.value;
        createGrid();
      });
P.addEventListener('click',
  (e)=>{
    playFlag=!playFlag;
    live();
  });
function Cell(){
  this.cell=document.createElement('div');
  this.life=false;
  this.place=[];
  this.live=()=>{this.cell.style.backgroundColor=Color;
                 this.life=true;}
  this.die=()=>{this.cell.style.backgroundColor='white';
                 this.life=false;}
  this.make=(gridSize)=>{
    this.cell.setAttribute('class', 'cell');
    this.cell.style.padding=Math.floor(Size/gridSize)+'%';
    this.cell.addEventListener('mouseenter',(e,myCell=this)=>{myCell.live();});
    Grid.appendChild(this.cell);
  }
  this.nei=()=>{
    let neiX, neiY, crowd=0;
    for(let i=-1,x=this.place[0]; i<=1;i++){
      neiX=i+x;
      if( neiX>(Size-1) ){
        neiX=0;
      }
      else if(neiX<0){
        neiX=Size-1;
      }
      for(let j=-1,y=this.place[1]; j<=1; j++){
        if(i==0 && j==0){
          break;
        }
        neiY=y+j;
        if( neiY>(Size-1) ){
          neiY=0;
        }
        else if(neiY<0){
          neiY=Size-1;
        }
        console.log(neiX,neiY);
        if(Cells[neiX][neiY].life) crowd++;
      }
    }
    return crowd;
  }
}
function clearGrid(){
  Cells=[];
  while(Grid.firstChild){
    Grid.removeChild(Grid.firstChild);
  }
}
function createGrid(){
  for(let i=0, row; i<Size; i++){
    row=[]
    for(let j=0,temp=null; j<Size; j++){
      let gridSize= Grid.scrollWidth;
      temp=new Cell();
      temp.make(gridSize);
      temp.place=[i,j]
      row.push(temp);
    }
    Cells.push(row);
  }
  Grid.style.gridTemplateColumns= "auto ".repeat(Size);
}
function live(){
  if(playFlag){
    for(let i=0; i<Size; i++){
      for(let j=0, crowd=0; j<Size; j++){
        let myCell=Cells[i][j];
        crowd=myCell.nei();
        if(crowd==2 || crowd==3) {
          if(myCell.life)
          ;
          else if(crowd==3)
            myCell.live();
          }
        else myCell.die();
      }
    }
    window.setTimeout(live,dt);
  }
}
