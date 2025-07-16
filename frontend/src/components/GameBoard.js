import React, { useState, useEffect } from 'react';
import CardItem from './CardItem';
import { Row, Col, Form, Button, Modal, CardHeader } from 'react-bootstrap';
import { Socket } from '../socket';
import axios from 'axios';
import { FaFileAlt } from 'react-icons/fa'; // FontAwesome file icon

const initialColumns = {
  todo: [],
  doing: [],
  done: [],
};

const GameBoard = () => {
  const userId = sessionStorage.getItem("user_id");
  const roomId = sessionStorage.getItem("room_id");
  const [columns, setColumns] = useState(initialColumns);
  const [newCard, setNewCard] = useState("");
  const [dragInfo, setDragInfo] = useState(null);
  const [showCardDetailModal, setShowCardDetailModal] = useState(false);
  //---------------------------------------------------------------------------MODAL STATES 
  const [modalHeading, setModalHeading] = useState("");
  const [modalText, setModalText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [cardId, setCardId] = useState("");
  const [modalScrMode, setModalScrMode] = useState("D");
  const [modalDescScrMode, setModalDescScrMode] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  //---------------------------------------------------------------------------

  const fetchCards = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cards/room/${roomId}`);
      const cards = res.data.cards;
      const newCols = { todo: [], doing: [], done: [] };
      cards.forEach(card => {
        if (newCols[card.status]) {
          newCols[card.status].push(card);
        } else {
          newCols.todo.push(card);
        }
      });
      setColumns(newCols);
    } catch (err) {
      console.error('Error fetching cards', err);
    }
  };

  useEffect(() => {
    fetchCards();
    //--------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------
    Socket.on('card_added', ({ roomId, card }) => {
      setColumns(prev => ({
        ...prev,
        todo: [...prev.todo, card],
      }));
    });
    Socket.on('card_deleted', ({ cardId }) => {
      setColumns(prev => {
        const updated = { ...prev };
        for (let col in updated) {
          updated[col] = updated[col].filter(c => c._id !== cardId);
        }
        return updated;
      });
    });
    return () => {
      Socket.off('card_added');
      Socket.off('card_deleted');
    };
  }, []);
  const handleAddCard = async () => {
    if (!newCard.trim()) return;

    const res = await axios.post('http://localhost:5000/api/cards/addcard', {
      text: newCard,
      roomId,
      userId,
      status: 'todo',
    });

    const newCardObj = res.data.card;
    setNewCard("");
    // Dusre browsers ko bhi bhejo
    Socket.emit('card_added', { roomId, card: newCardObj });
  };


  const handleDelete = async (colKey, cardId) => {
    await axios.delete(`http://localhost:5000/api/cards/deletecard/${cardId}`);
    setColumns(prev => ({
      ...prev,
      [colKey]: prev[colKey].filter(c => c._id !== cardId),
    }));
    Socket.emit('card_deleted', { roomId, cardId });
  };

  const onDragStart = (e, colKey, index) => {
    setDragInfo({ colKey, index });
  };

  const onDrop = (e, targetCol) => {
    e.preventDefault();
    const { colKey, index } = dragInfo;
    const draggedCard = columns[colKey][index];

    if (colKey === targetCol) return;

    const updatedSource = [...columns[colKey]];
    updatedSource.splice(index, 1);

    const updatedTarget = [...columns[targetCol], { ...draggedCard, status: targetCol }];

    setColumns({
      ...columns,
      [colKey]: updatedSource,
      [targetCol]: updatedTarget,
    });

    axios.put(`http://localhost:5000/api/cards/update/${draggedCard._id}`, { status: targetCol });
    setDragInfo(null);
  };

  const allowDrop = (e) => e.preventDefault();

  //***************************************************************************  MODAL BOX OPERATIONS   ***************************************************
  const handleCardDetail = (card) => {
    setModalScrMode("D");
    axios.get(`http://localhost:5000/api/upload/getByCard/${card._id}`)
      .then(res => setUploadedFiles(res.data.files))
      .catch(err => console.error("Fetching uploaded files failed", err));
    setCardId(card._id);
    setModalHeading(card.text);
    setShowCardDetailModal(true);
  }
  const saveModalData = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/cards/update-description/${cardId}`, {
        description: modalText
      });
      alert("Description saved");
    } catch (err) {
      alert("Failed to save description");
      console.error(err);
    }
  };
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const uploadFile = async () => {
    if (!selectedFile) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("roomId", roomId);
    formData.append("cardId", cardId);
    formData.append("uploadedBy", userId);

    try {
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    }
  };
  const handleModelScrMode = (scrmode) => {
    setModalScrMode(scrmode);
  }
  //*******************************************************************************************************************************************************
  const renderColumn = (title, colKey) => (
    <Col md={4} className="p-2" onDrop={(e) => onDrop(e, colKey)} onDragOver={allowDrop}>
      <div className="p-3 bg-dark rounded shadow-sm text-white">
        <h5 className="mb-3">{title}</h5>
        {columns[colKey].map((card, index) => (
          <div key={card._id || index} onClick={() => handleCardDetail(card)} draggable onDragStart={(e) => onDragStart(e, colKey, index)}>

            <CardItem
              card={card}
              index={index}
              onDelete={() => handleDelete(colKey, card._id)}
            // onToggle can be passed too if needed
            />
          </div>
        ))}
      </div>
    </Col>
  );

  return (
    <>
      <Form className="d-flex my-3">
        <Form.Control
          type="text"
          placeholder="Enter a new task"
          value={newCard}
          onChange={(e) => setNewCard(e.target.value)}
        />
        <Button onClick={handleAddCard} className="ms-2">Add</Button>
      </Form>

      <Row>
        {renderColumn("📝 To Do", "todo")}
        {renderColumn("⚙️ Doing", "doing")}
        {renderColumn("✅ Done", "done")}
      </Row>
      <Modal show={showCardDetailModal} size='xl' onHide={() => setShowCardDetailModal(false)} scrollable backdrop="static">
        <Modal.Header className='modal-header-outer-div' closeButton>
          <Modal.Title >
            <Row  >
              <Col>
                <span>{modalHeading} </span>
              </Col>
            </Row>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>&nbsp;</Row>
          <Row>
            <Col className="col-md-10">
              {modalScrMode === "D" && <>
                <Row className='model-chat-box-outer-div'>
                  <Form.Group>
                    <Form.Label style={{ color: "white" }}><b>Description</b></Form.Label>
                    <Form.Control
                      className='model-chat-box-inner-div'
                      value={modalText}
                      disabled={modalDescScrMode !== "E"}
                      maxLength={500}
                      as="textarea"
                      placeholder="Add more detailed description"
                      style={{ height: '200px' }}
                      onChange={(e) => setModalText(e.target.value)}
                    />
                  </Form.Group>
                </Row> &nbsp;
                <Row>
                  <Col>
                    <Button style={{ marginTop: "33px" }} variant='outline-primary' size='sm' className='buttonStyle' onClick={() => saveModalData()}>Save</Button>&nbsp;
                    <Button style={{ marginTop: "33px" }} variant='outline-primary' size='sm' className='buttonStyle' onClick={() => setModalDescScrMode("E")}>Edit </Button>&nbsp;
                  </Col>
                  <Col>
                    <Form.Group controlId="uploadEntries">
                      <Form.Label>Attach file (MAX 10MB)</Form.Label>
                      <Form.Control
                        type="file"
                        onChange={(e) => handleFileChange(e)}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Button style={{ marginTop: "33px" }} variant='outline-primary' className='buttonStyle' size='sm' onClick={() => uploadFile()}>Submit</Button>
                  </Col>
                </Row>
                &nbsp;
              </>}
              {modalScrMode === "U" &&
                uploadedFiles.map(file => (
                  <div key={file._id} className="document-box">
                    <a href={`http://localhost:5000/uploads/${file.fileName}`} target="_blank" rel="noopener noreferrer" className="document-link">
                      <FaFileAlt className="file-icon" />
                      <span className="file-name">{file.originalName}</span>
                    </a>
                  </div>
                ))}
            </Col>
            <Col className="col-md-2">
              <Row><Button style={{ marginTop: "2px" }} variant='outline-primary' className='buttonStyle' size='sm' onClick={() => handleModelScrMode("D")}>Enter Description</Button></Row>
              <Row><Button style={{ marginTop: "3px" }} variant='outline-primary' className='buttonStyle' size='sm' onClick={() => handleModelScrMode("U")}>Uploaded Files</Button></Row>
              <Row><Button style={{ marginTop: "3px" }} variant='outline-primary' className='buttonStyle' size='sm' onClick={() => handleModelScrMode("A")}>Activity</Button></Row>
              <Row><Button style={{ marginTop: "3px" }} variant='outline-primary' className='buttonStyle' size='sm' onClick={() => handleModelScrMode("E")}>Export card details</Button></Row>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};


export default GameBoard;
