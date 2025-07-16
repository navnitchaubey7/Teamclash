import React, { useRef, useEffect, useState } from 'react';
import { Socket } from '../socket';
import '../mcss/Home.css';
import axios from 'axios';

const ChatBox = ({ roomId, userName, userId }) => {
    const chatEndRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        const container = document.querySelector('.chat-messages');
        container.scrollTop = container.scrollHeight;
        const fetchHistory = async () => {
            const res = await axios.get(`http://localhost:5000/api/chat/room/${roomId}`);
            if (res.data.success) {
                setMessages(res.data.messages);
            }
        };

        fetchHistory();
        Socket.emit('join_room', { roomId });
        Socket.on('new_chat_message', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            Socket.off('new_chat_message');
        };
    }, [roomId]);

    const sendMessage = () => {
        if (!input.trim()) return;
        if (input.trim()) {
            Socket.emit('chat_message', {
                roomId,
                userId,
                userName,
                avatar: '',
                message: input
            });
            setInput('');
        }
        setTimeout(() => {
            if (chatEndRef.current) {
                chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 50);
    };

    return (
        <div className="chat-box-container">
            <div className="chat-messages">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`chat-bubble ${msg.userId === userId ? 'chat-me' : 'chat-other'}`}
                    >
                        <div className="chat-username">{msg.userName}</div>
                        <div className="chat-text">{msg.message}</div>
                        <div className="chat-time">🕒 {new Date(msg.timestamp).toLocaleTimeString()}</div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <div className="chat-input-box">
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button className="chat-send-btn" onClick={sendMessage}>Send 🚀</button>
            </div>
        </div>

    );
};

export default ChatBox;
