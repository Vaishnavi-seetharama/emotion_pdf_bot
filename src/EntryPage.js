import React from "react";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { VscHubot } from "react-icons/vsc"; // Robot icon
import { RiMentalHealthLine } from "react-icons/ri"; // App icon
import styled from "styled-components";

// Styled components for header and logo
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

const EntryPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "black", // Black background fallback
        backgroundImage: "url('/bg.jpg')", // Path to your image
        backgroundSize: "45%", // Make the image cover the entire screen
        backgroundPosition: "center", // Center the image
        backgroundRepeat: "no-repeat", // Ensure the background does not repeat
        position: "relative", // Required for absolute positioning of the header // Required for absolute positioning of the header
      }}
    >
      {/* Header with logo */}
      <Header>
        <LogoPlaceholder>VS</LogoPlaceholder>
        Vaishnavi Seetharama
      </Header>

      {/* Chatbot Icon */}
      <div
        style={{
          margin: "100px",
          cursor: "pointer",
          textAlign: "center",
          color: "white", // Text color
        }}
        onClick={() => navigate("/pdfbot")}
      >
        <div
          style={{
            width: "150px",
            height: "150px",
            backgroundColor: "grey", // Default circle background
            borderRadius: "60%", // Make it a circle
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: "background-color 0.3s ease", // Smooth hover transition
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgb(79, 81, 81)")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgb(62, 68, 68)")}
        >
          <VscHubot size={80} color="white" />
        </div>
        <h2>Pdf-Bot</h2>
      </div>

      {/* Other App Icon */}
      <div
        style={{
          margin: "100px",
          cursor: "pointer",
          textAlign: "center",
          color: "white", // Text color
        }}
        onClick={() => navigate("/Emotion_Buddy")}
      >
        <div
          style={{
            width: "150px",
            height: "150px",
            backgroundColor: "grey", // Default circle background
            borderRadius: "60%", // Make it a circle
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: "background-color 0.3s ease", // Smooth hover transition
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgb(79, 81, 81)")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgb(62, 68, 68)")}
        >
          <RiMentalHealthLine size={80} color="white" />
        </div>
        <h2>Emotion Buddy</h2>
      </div>
    </div>
  );
};

export default EntryPage;
