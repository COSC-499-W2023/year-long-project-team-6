import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet, Navigate } from 'react-router-dom';
import LoginForm from "./pages/login_signup";
import PostPage from "./pages/Post";
import RecordedPage from "./pages/Recorded";
import EditPage from "./pages/Edit";
import MainContent from './pages/MainContent';
import Sidebar from './pages/sidebar';
import Profile from './pages/UserProfile';
import Members from './pages/Members';
import VideoPage from './pages/VideoPage';
import { AuthContext, AuthProvider } from './pages/AuthContext';
import './component/CSS/style.css'; // Assuming your styles are compatible with React
import './component/CSS/sidebar_style.css';
import './App.css';

function App() {
  return (
    <div>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/Signup" element={<LoginForm />} />

            <Route path="/" element={<LayoutWithSidebar />}>
              <Route index element={<ProtectedRoute><MainContent /></ProtectedRoute>} />
              <Route path="PostPage" element={<PostPage />} />
              <Route path="RecordedPage" element={<RecordedPage />} />
              <Route path="EditPage" element={<EditPage />} />
              <Route path="Profile" element={<Profile />} />
              <Route path="Members" element={<Members />} />
              <Route path="Video/:videoId" element={<VideoPage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
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

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/Signup" />;
  }

  return children;
}

export default App;
