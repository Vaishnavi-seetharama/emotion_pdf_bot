import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";

// Styled Components
const TopRightHeading = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  z-index: 1;
`;
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  color: white;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: black;
    z-index: -2;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/bg.jpg') no-repeat center center;
    background-size: 45%;
    z-index: -1;
  }
`;

const Header = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
`;

const LogoPlaceholder = styled.div`
  width: 40px;
  height: 40px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  font-weight: bold;
  font-size: 16px;
`;

const ChatContainer = styled.div`
  flex-grow: 1;
  position: relative; /* Enables the use of 'top' */
  top: 30px; /* Content starts after 10px from the top */
  overflow-y: auto;
  margin: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ChatMessage = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  max-width: 70%;
  align-self: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
  background-color: ${(props) => (props.isUser ? '#58c4b5' : '#8f9695')};
  color: white;
  padding: 10px;
  border-radius: 10px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  order: ${(props) => (props.isUser ? 2 : 0)};
`;

const MessageText = styled.div`
  flex: 1;
  word-wrap: break-word;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px;
  background-color: #222;

  input {
    flex: 1;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 16px;
    background-color: white;
    color: black;
  }
`;

const Button = styled.button`
  background-color: rgb(63, 64, 64);
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
`;

// Main Component
const Emotion_Buddy = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
   
  
    setChatHistory([...chatHistory, { isUser: true, text: message }, { isUser: false, text: "Typing..." }]);
    setMessage('');
  
    try {
      const API_BASE = process.env.REACT_APP_API_BASE_URL;
      const response = await axios.post('${API_BASE}/emotion_chat', { message });
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory.slice(0, -1), // Remove the "Loading..." placeholder
        { isUser: false, text: response.data.response },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      if (error.response?.data?.error === "AttributeError: 'NoneType' object has no attribute 'as_retriever'") {
        setChatHistory((prevChatHistory) => [
          ...prevChatHistory.slice(0, -1), // Remove the "Loading..." placeholder
          { isUser: false, text: "Please upload a PDF to chat with it." },
        ]);
      } else {
        setChatHistory((prevChatHistory) => [
          ...prevChatHistory.slice(0, -1), // Remove the "Loading..." placeholder
          { isUser: false, text: "An error occurred. Please try again later." },
        ]);
      }
    }
  };
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  return (
    <AppContainer>
      <Header onClick={() => navigate('/')}>
        <LogoPlaceholder>VS</LogoPlaceholder>
        Vaishnavi Seetharama
      </Header>
      <TopRightHeading>Emotion-Buddy</TopRightHeading>
      <ChatContainer>
        {chatHistory.map((chat, index) => (
          <ChatMessage key={index} isUser={chat.isUser}>
            <Avatar src={chat.isUser ? '/user.png' : '/bot.png'} alt="Avatar" />
            <MessageText>{chat.text}</MessageText>
          </ChatMessage>
        ))}
        <div ref={chatEndRef} />
      </ChatContainer>
      <InputContainer>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <Button onClick={sendMessage}>Send</Button>
      </InputContainer>
    </AppContainer>
  );
};

export default Emotion_Buddy;
