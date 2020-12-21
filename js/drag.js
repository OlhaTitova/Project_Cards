function DragDrops(e) {
    const cell = e.target.closest('.col.mb-4');
            
    let currentDroppable = null;
    cell.onmousedown = (e) => {
        let shiftX = e.clientX - cell.getBoundingClientRect().left;
        let shiftY = e.clientY - cell.getBoundingClientRect().top;
    
        cell.style.position = 'absolute';
        cell.style.zIndex = 1000;

        itemsRow.append(cell);

        moveAt(e.pageX, e.pageY);

        function moveAt(pageX, pageY){
            cell.style.left = pageX - shiftX + 'px';
            cell.style.top = pageY - shiftY + 'px';
        }
    

        function onMouseMove(e) {
            moveAt(e.pageX, e.pageY);

            cell.hidden = true;
            let elemBelow = document.elementFromPoint(e.clientX, e.clientY);
            cell.hidden = false;

            if(!elemBelow) return;

            let droppableBellow = elemBelow.closest('.droppable');

            if(currentDroppable != droppableBellow) {

                if(currentDroppable) {
                    leaveDroppable(currentDroppable)
                }

                currentDroppable = droppableBellow;

                if(currentDroppable) {
                    enterDroppable(currentDroppable)
                }
            }

            function enterDroppable(elem) {
                elem.style.background = 'pink';
              }
          
              function leaveDroppable(elem) {
                elem.style.background = '';
              }
        }

        itemsRow.addEventListener('mousemove', onMouseMove);
    
        cell.onmouseup = function () {
            itemsRow.removeEventListener('mousemove', onMouseMove);
            cell.style.position = 'relative';
            // cell.style.zIndex = 1000;
            // itemsRow.append(cell);
            cell.onmouseup = null;
    }
}
}