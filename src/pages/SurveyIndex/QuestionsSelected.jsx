// ListItem.js
import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';


const ItemTypes = {
    LIST_ITEM: "listItem",
  };
const QuestionsSelected = ({ item, index, moveItem, onSelectChange, onCheckboxChange, questions, onRemoveItem }) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: ItemTypes.LIST_ITEM,
    hover(draggedItem) {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.LIST_ITEM,
    item: { type: ItemTypes.LIST_ITEM, id: item.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div ref={ref} className={`list-item ${isDragging ? "dragging" : ""}`}>
    <FormControl fullWidth>
      <InputLabel id={`select-question-label-${index}`}>Soru Seçimi</InputLabel>
      <Select
        labelId={`select-question-label-${index}`}
        id={`select-question-${index}`}
        value={item.id}
        onChange={(e)=>onSelectChange(index,e.target.value) }
      >
        {questions.map((question) => (
          <MenuItem key={question.id} value={question.id}>{question.description}</MenuItem>
        ))}
      </Select>
    </FormControl>
   
    <FormControlLabel
      control={<Checkbox checked={item.isRequired} 
      onChange={(e)=>onCheckboxChange(index,e.target.checked)}
      />}
      label="Sorunun Zorunlu Olup Olmadığı"
    />
   <Button onClick={onRemoveItem}>Soruyu Kaldır</Button>


  </div>
  );
};

export default QuestionsSelected;