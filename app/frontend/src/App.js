import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./pages/login_signup";
import PostPage from "./pages/Post";
import RecordedPage from "./pages/Recorded";
import EditPage from "./pages/Edit";
import './App.css';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/PostPage" element = {<PostPage />}/>
          <Route path="/RecordedPage" element = {<RecordedPage />}/>
          <Route path="/EditPage" element = {<EditPage />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
