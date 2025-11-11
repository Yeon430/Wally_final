import React from 'react';
import './StatusBar.css';

function StatusBar({ currentPage }) {
  const isChatPage = currentPage === 'chat';
  
  return (
    <div className={`status-bar ${isChatPage ? 'status-bar-pink' : 'status-bar-white'}`}>
      <div className="status-bar-notch">
        <div className="notch-bg"></div>
      </div>
    </div>
  );
}

export default StatusBar;
