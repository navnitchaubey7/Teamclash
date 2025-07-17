// frontend/src/pages/ProfilePage.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CreateRoom from "./CreateRoom";
import JoinRoom from "./JoinRoom";
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../redux/sidebarSlice';
import { useNavigate } from "react-router-dom";
import * as Common from "../components/Common"


const ProfilePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const { isVisible: sidebarVisible, createRoom: newRoomVisible, enterRoom: enterRoomVisible } = useSelector((state) => state.sidebar);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token || token === "null" || token === "undefined") {
        navigate("/");
        return;
      }

      try {
        const res = await axios.get(Common.apiprofilepageauth, {
          headers: {
            Authorization: token,
          },
        });
        setUserData(res.data.user);
      } catch (err) {
        console.error(err);
        alert("Access denied. Invalid token.");
      }
    };
    fetchProfile();
  }, []);
  const generativeAi = async () => {
    // const response = await axios.post('http://localhost:5000/api/ai/generate-description', {
    //   shortTitle: 'Fix UI bug on login page'
    // });
    // console.log(response);
  }

  return (
    <div>
      <Navbar toggleSidebar={() => dispatch(toggleSidebar())} />

      <div style={{ display: 'flex' }}>
        <Sidebar isVisible={sidebarVisible} />
        <div
          style={{
            marginLeft: sidebarVisible ? '220px' : '0px',
            transition: 'margin-left 0.3s ease-in-out',
            padding: '20px',
            width: '100%',
          }}
        >
          {/* DON'T REMOVE THIS LINE WORK WHEN WE GOT SUBSCRIPTION OF AI */}
          {/* <button className="btn btn-success mt-2" onClick={generativeAi}>Check AI</button> */}
          <a href={Common.downloadreport} download><button>📥 Download Progress Report</button></a>
          {newRoomVisible && <div className='create_room_header'><CreateRoom /></div>}
          {enterRoomVisible && <div className='create_room_header'><JoinRoom /></div>}
        </div>
      </div>
    </div>
  );

};

export default ProfilePage;
