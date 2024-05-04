import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import * as Pages from './pages';
import io from 'socket.io-client';

const socket = io('http://localhost:5001');

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Pages.Home />} />
        <Route path="*" element={<Pages.NotFoundPage />} />
        <Route path="/login" element={<Pages.LoginPage />} />
        <Route path="/signup" element={<Pages.SignUpPage />} />
        <Route path="/student" element={<Pages.StudentDashboard socket={socket} />} />
        <Route path="/teacher" element={<Pages.TeacherDashboard socket={socket} />} />
        <Route path="/ta" element={<Pages.TaDashboard socket={socket} />} />
      </Routes>
    </Router>
  );
}

export default App;
