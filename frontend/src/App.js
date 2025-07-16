// src/App.js
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import CreateRoom from './pages/CreateRoom';
import JoinRoom from './pages/JoinRoom';
import Playground from './pages/Playground';
import GameBoard from './components/GameBoard';
import ChatBoxx from './components/ChatBoxx';
import TruckAnimation from './TruckAnimation';


function App() {

  return (
    <div className="bg-wrapper">
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create-room" element={<CreateRoom />} />
          <Route path="/join-room" element={<JoinRoom />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/test" element={<GameBoard />} />

          <Route path="/chat-box" element1={<ChatBoxx />} />
          <Route path="/loader" element={<TruckAnimation />} />
        </Routes>
      </div>
    </div>
  );
}


export default App;
