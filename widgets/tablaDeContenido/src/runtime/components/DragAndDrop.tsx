import React, { useState } from 'react'
import '../../styles/style.css'

const DragAndDrop = ({items, setItems, setBanderaRefreshCapas}) => {
    // const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']);
    const [draggedItem, setDraggedItem] = useState(null);
  
    const handleDragStart = (event:any, index:any) => {
        console.log(index)
      setDraggedItem(index);
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/html', event.target.parentNode);
      event.target.classList.add('dragging');
    };
  
    const handleDragOver = (event:any, index:any) => {
      event.preventDefault();
      console.log(index)
      event.dataTransfer.dropEffect = 'move';
      const draggedIndex = draggedItem;
      if (draggedIndex !== index) {
        const newItems = [...items];
        const [removed] = newItems.splice(draggedIndex, 1);
        newItems.splice(index, 0, removed);
        setItems(newItems);
        setDraggedItem(index);
        setBanderaRefreshCapas((e: boolean) => !e)
      }
    };
  
    const handleDragEnd = (event:any) => {
        console.log(11111111111)
      event.target.classList.remove('dragging');
      setDraggedItem(null);
    };
  
    return (
      <ul className="drag-and-drop">
        {items.map((item, index) => (
          <>
            <li
              key={index}
              className={`draggable ${draggedItem === index ? 'dragging' : ''} pointer`}
              draggable
              onDragStart={(event) => handleDragStart(event, index)}
              onDragOver={(event) => handleDragOver(event, index)}
              onDragEnd={handleDragEnd}
            >
              - {item.capa.NOMBRETEMATICA} - {item.capa.TITULOCAPA}
            </li>
            <hr />
          </>
        ))}
      </ul>
    );
}

export default DragAndDrop