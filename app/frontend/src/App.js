import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import LoginForm from "./pages/login_signup";
import PostPage from "./pages/Post";
import RecordedPage from "./pages/Recorded";
import EditPage from "./pages/Edit";
import MainContent from './pages/MainContent';
import Sidebar from './pages/sidebar';
import Profile from './pages/UserProfile';
import Members from './pages/Members';
import GroupPost from './pages/groupPost';

import VideoPage from './pages/VideoPage';
import './component/CSS/style.css'; // Assuming your styles are compatible with React

import './component/CSS/sidebar_style.css';
import './App.css';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<LayoutWithSidebar />}>
            <Route index element={<MainContent />} />
            <Route path="PostPage" element={<PostPage />} />
            <Route path="RecordedPage" element={<RecordedPage />} />
            <Route path="EditPage" element={<EditPage />} />
            <Route path="Profile" element={<Profile />} />
            <Route path="Members/:groupId" element={<Members />} />
            <Route path="Video/:videoId" element={<VideoPage />} />
            <Route path="grouppost/:groupId/:currentuserid" element={<GroupPost />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}
function LayoutWithSidebar() {
  return (
    <div>
      <Sidebar />
      <Outlet /> {/* Renders the child routes */}
    </div>
  );
}


export default App;
