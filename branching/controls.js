const controlsForm=document.getElementById('controls');
const toggle=document.getElementById('toggleControls');
const reset=document.getElementsByName('reset')[0];
let minimized=true;
toggle.onclick=function(){
  if(minimized){
    controlsForm.style.display="block";
  }
  else {
    controlsForm.style.display="none";
  }
  minimized=!minimized;
}

reset.onclick=function(){
  if(!!tree){
    tree.doneFlag=true;
    window.cancelAnimationFrame(tree.animID);
  }
  ctx.clearRect(0,0, Cwidth,Cheight);
}
