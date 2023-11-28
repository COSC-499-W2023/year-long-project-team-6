import React, { useState, useEffect, useRef } from 'react';
import '../component/CSS/sidebar_style.css';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [result, setResult] = useState('');
  const [activeLink, setActiveLink] = useState('home'); 
  const modalRef = useRef(null);

  const toggleModal = () => {
    setModalOpen(prev => !prev);
  };

  const searchGroup = () => {
    const message = searchValue.length === 5 
      ? `Searching for group with code: ${searchValue}`
      : 'Please enter a 5-character code.';
    setResult(message);
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
    if (isModalOpen) setModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModalOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
    <div className="topnav">
    <div className="topnav-right">
      <a href="/Signup">
        login
      </a>
    </div>
  </div>
    <div className="sidebar">
      <ul>
        <li>
        <Link to="/" className={activeLink === 'home' ? 'active' : ''} onClick={() => handleLinkClick('home')}>
            <img src='/home.png' alt="Home" />
            <span className="tooltiptext">
          Home
        </span>
        </Link>
        </li>
        <li>
  <Link to="/RecordedPage" className={activeLink === 'RecordedPage' ? 'active' : ''} onClick={() => handleLinkClick('RecordedPage')}>
    <img src='/downloads.png' alt="Recorded" />
    <span className="tooltiptext">
      Recorded
    </span>
  </Link>
</li>
        <li>
         <Link to="/PostPage" className={activeLink === 'PostPage' ? 'active' : ''} onClick={() => handleLinkClick('PostPage')}>
            <img src='/post.ico' alt="Post" />
            <span className="tooltiptext">
          Post
        </span>
        </Link>
        </li>
        <li>
        <a id="myBtn" className="addgroup" href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleModal(); }}>
            <img src='/addgroup.png' alt="Add Group" />
        </a> 
            <span className="tooltiptext">

          Add Group
        </span>

        </li>
        
      </ul>

      {isModalOpen && (
        <div className="modal" ref={modalRef}>
          <div className="modal-content">
            <span className="close" onClick={toggleModal}>&times;</span>
            <div className="addgroup">
              <h3>Find your group here</h3>
              <input
                type="text"
                maxLength="5"
                placeholder="Enter a 5-character code"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value.toUpperCase())}
              />
              <button onClick={searchGroup}>Search</button>
              <p>{result}</p>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Sidebar;
