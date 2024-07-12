import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="dashboard">
      <h1>Welcome Admin</h1>
      <div className="dashboard-boxes">
        <div className="dash" style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          <div className="dashboard-box" onClick={() => { navigate('/createAudioBook') }}>
            <h2>Create Audio Book</h2>
            <div style={{  color: '#6637ED', fontSize: 150, fontFamily: 'sans-serif', fontWeight: '800', wordWrap: 'break-word', top: "-1rem", position: "relative" }}>+</div>
          </div>
          <div className="dashboard-box" onClick={() => { navigate('/createProject') }}>
            <h2>Create Projects</h2>
            <div style={{  color: '#6637ED', fontSize: 150, fontFamily: 'sans-serif', fontWeight: '800', wordWrap: 'break-word', top: "-1rem", position: "relative" }}>+</div>
          </div>
        </div>
        <div className="dashboard-box" onClick={() => { navigate('/createResource') }}>
          <h2>Create Resources and Guide</h2>
          <div style={{  color: '#6637ED', fontSize: 150, fontFamily: 'sans-serif', fontWeight: '800', wordWrap: 'break-word', top: "-1rem", position: "relative" }}>+</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
