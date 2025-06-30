import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EntryPage from "./EntryPage";
import PdfBot from "./pdfbot";
import Emotion_Buddy from "./Emotion_Buddy";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route path="/pdfbot" element={<PdfBot />} />
        <Route path="/Emotion_Buddy" element={<Emotion_Buddy />} />
      </Routes>
    </Router>
  );
}

export default App;
