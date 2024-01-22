import React, { useState, useEffect, useRef, useContext } from 'react';
import '../component/CSS/sidebar_style.css';
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [result, setResult] = useState('');
  const [activeLink, setActiveLink] = useState('home');
  const [code, setCode] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const toggleModal = () => {
    setModalOpen(prev => !prev);
  };

  const handleProfileClick = () => {
    navigate('/Profile'); // Navigate to the profile page
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

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };
  const handleCreateGroup = async () => {
    const newCode = generateRandomCode();
    setCode(newCode);
    setShowPopup(true);

    const groupName = document.querySelector('[name="groupname"]').value;
    console.log(groupName);
    if (groupName) {
      try {
        const response = fetch('http://localhost:5001/add-group', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ groupName: groupName, code: newCode }),
        });
        if (!response) {
          console.log('no');
        } else {
          console.log(response);
        }
        if (response) {
          // Handle successful group creation
          console.log('Group created successfully');
        } else {
          // Handle errors
          console.error('Failed to create group');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      // Handle case where group name is not entered
      console.error('Group name is required');
    }
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
          <button onClick={handleProfileClick}>Profile</button>
          <button onClick={handleLogout} className='logout-button'>
            Logout
          </button>
        </div>
      </div >
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
              <div className='creategroup'>
                <h3>Create your group here</h3>
                <input
                  type="text"
                  placeholder="Your Group Name"
                  name='groupname'
                />
                <button onClick={handleCreateGroup}>Create!</button>
                {showPopup && <div>Group Code: {code}</div>}
              </div>
              <div className="addgroup">
                <h3>Find your group here</h3>
                <input
                  type="text"
                  maxLength="5"
                  placeholder="Enter a 5-character code"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value.toUpperCase())}
                />
                <button onClick={searchGroup}>Join!</button>
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
