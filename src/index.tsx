import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import StudentDashboard from './student_analytics_dashboard';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <StudentDashboard />
  </React.StrictMode>
);
