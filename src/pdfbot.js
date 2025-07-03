import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FiUpload } from 'react-icons/fi';
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

const AppContainer = styled.div`
  display: flex;
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

const LeftPane = styled.div`
  width: 50%;
  // border-right: 1px solid #333;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  flex-direction: column;
`;

const ChooseFileButton = styled.label`
  background-color: rgb(50, 51, 51);
  color: white;
  padding: 20px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgb(80, 81, 81);
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const LoadingBarContainer = styled.div`
  width: 50%;
  background-color: #333;
  border-radius: 5px;
  margin-top: 20px;
`;

const LoadingBar = styled.div`
  height: 10px;
  background-color: rgb(44, 219, 146);
  width: 85%;
  border-radius: 5px;
  transition: width 0.3s ease;
`;

const LoadingText = styled.span`
  color: #fff;
  font-weight: bold;
  font-size: 14px;
`;

const RightPane = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
`;

const ChatContainer = styled.div`
  flex-grow: 1;
  position:relative;
  top:30px;
  overflow-y: auto;
  margin-bottom: 35px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ChatMessage = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  position:relative;
  top:30px;
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

  input {
    flex: 1;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 16px;
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
const PdfBot = () => {
  const [file, setFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  const uploadPdf = async (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const API_BASE = process.env.REACT_APP_API_BASE_URL;
      const response = await axios.post('${API_BASE}/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      setPdfFile(URL.createObjectURL(selectedFile));
      setIsUploaded(true);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploadProgress(0);
    }
  };

  const sendMessage = async () => {
    if (!isUploaded) {
      setChatHistory([...chatHistory, { isUser: true, text: message }, { isUser: false, text: "Please upload a PDF to chat with it." }]);
      setMessage('');
      return;
    }
  
    setChatHistory([...chatHistory, { isUser: true, text: message }, { isUser: false, text: "Typing..." }]);
    setMessage('');
  
    try {
      const response = await axios.post('http://127.0.0.1:5000/chat', { message });
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
      <TopRightHeading>Pdf-Bot
          <p style={{ fontSize: '0.9rem', color: '#555', marginTop: '4px' }}>
        😊 <strong>Chat with your PDF</strong>
      </p>
          </TopRightHeading>
          
      <LeftPane>
        {!isUploaded ? (
          <>
            <ChooseFileButton htmlFor="file-upload">
              <FiUpload size={32} />
            </ChooseFileButton>
            <HiddenFileInput id="file-upload" type="file" onChange={uploadPdf} />
            {uploadProgress > 0 && (
              <LoadingBarContainer>
                <LoadingBar progress={uploadProgress} />
                <LoadingText>Uploading...</LoadingText>
              </LoadingBarContainer>
            )}
          </>
        ) : (
          <>
              <p></p>
              <h2 style={{ alignSelf: 'flex-start', fontSize: '18px' }}>Uploaded PDF</h2>
              <object data={pdfFile} type="application/pdf" width="100%" height="100%">
                <p>Alternative text - include a link <a href={pdfFile}>to the PDF!</a></p>
              </object>
            </>
        )}
      </LeftPane>
      <RightPane>
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
            style={{ flexGrow: 1, padding: '10px', borderRadius: '5px', border: '1px solid #333' }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
          />
          <Button onClick={sendMessage}>Send</Button>
        </InputContainer>
      </RightPane>
    </AppContainer>
  );
};

export default PdfBot;
