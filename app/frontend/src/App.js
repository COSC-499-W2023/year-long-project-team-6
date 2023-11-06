import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./pages/login_signup";
import './App.css';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
