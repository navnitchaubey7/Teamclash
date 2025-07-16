import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, ListGroup } from 'react-bootstrap';

const PendingRequests = ({ userId }) => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/friends/requests/${userId}`);
      setRequests(res.data.requests);
    } catch (err) {
      console.error("Error fetching requests", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      await axios.patch(`http://localhost:5000/api/friends/accept/${requestId}`);
      alert("Accepted ✅");
      fetchRequests(); // Refresh list after accepting
    } catch (err) {
      console.error("Accept error", err);
    }
  };

  return (
    <div className="bg-dark p-3 text-white rounded">
      <h5>Pending Friend Requests</h5>
      <ListGroup>
        {requests.map((req) => (
          <ListGroup.Item key={req._id} className="d-flex justify-content-between align-items-center">
            {req.from.username} ({req.from.email})
            <Button variant="success" onClick={() => handleAccept(req._id)}>Accept</Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default PendingRequests;
