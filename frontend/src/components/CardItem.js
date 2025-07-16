import React, { useState } from 'react';
import { Socket } from '../socket';
import { Card, Button, Form } from 'react-bootstrap';

const CardItem = ({ card, onPointUpdate, onDelete, index }) => {
  const [checked, setChecked] = useState(card.checked);

  const handleCheck = () => {
    const updated = !checked;
    setChecked(updated);

    Socket.emit('card_checked', {
      cardId: card._id,
      checked: updated,
      roomId: card.roomId,
      userId: localStorage.getItem("userId")
    });

    onPointUpdate && onPointUpdate(card._id, updated);
  };
  return (
    <Card style={{ background: "#89428e" }} className="mb-2" >
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div style={{ 
          background: "#6b0751", paddingRight : "30px",paddingLeft : "5px"  }}>
          <Form.Check 
          style={{ color: "white" }}
            type="checkbox"
            checked={checked}
            onChange={handleCheck}
            label={card.text}
          />
        </div>
        <Button style = {{marginLeft : "8px"}} variant="danger" size="sm" onClick={() => onDelete(index)}>
          🗑️
        </Button>
      </Card.Body>
    </Card>
  );
};
export default CardItem;
