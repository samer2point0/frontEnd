const pad = document.querySelector('#sketchPad');
const Reset = document.querySelector('#reset');
const gridSize = document.querySelector('#gridSize');
createGrid();
Reset.addEventListener('click', createGrid);
function createGrid() {
  while(pad.firstChild){
    pad.removeChild(pad.firstChild)
  }
  if (gridSize.value !== '') {
    size = gridSize.value;
  }
  for (var i = 0; i < size*size; i++) {
    const box = document.createElement('div');
    box.setAttribute('class', 'lilbox');
    box.style.padding=(200/size).toString()+'px';
    //box.textContent = 'p';
    box.addEventListener('mouseenter', (e) => {e.target.style.backgroundColor = '#'+(Math.random()*0xFFFFFF<<0).toString(16);});
    pad.appendChild(box);
  }
   pad.style.gridTemplateColumns= "auto ".repeat(size);
}
