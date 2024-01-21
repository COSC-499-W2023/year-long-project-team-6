import React from 'react';
import '../component/CSS/style.css'; // Assuming your styles are compatible with React
import '../component/CSS/sidebar_style.css';
import Sidebar from './sidebar';
import MainContent from './MainContent';

function Home() {
  return (
    <div>
      <Sidebar />
      <MainContent />
    </div>
  );
}

export default Home;
