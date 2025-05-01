// ServerSidebar.jsx: 메인 서버 대시보드 사이드바

import React from 'react';

const Sidebar = ({ name, email, myCount, runningCount, stoppedCount }) => (
  <aside className="sidebar">
    <h3>{name}</h3>
    <p>{email}</p>
    <ul>
      <li>My Server <span>({myCount})</span></li>
      <li>Running Server <span>({runningCount})</span></li>
      <li>Stopped Server <span>({stoppedCount})</span></li>
    </ul>
  </aside>
);

export default Sidebar;
