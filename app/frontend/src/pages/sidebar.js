import React, { useState, useEffect, useRef, useContext } from 'react';
import '../component/CSS/sidebar_style.css';
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [userId, setUserId] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [result, setResult] = useState('');
  const [activeLink, setActiveLink] = useState('home');
  const [code, setCode] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate();
  // set the logout modal constant.  
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const sessionUser = sessionStorage.getItem('user');
    if (!sessionUser) {
      navigate('/login');
    } else {
      const user = JSON.parse(sessionUser);
      setUserId(user.userid);
      console.log("User Id: " + user.userid);
    }
  }, [navigate]);

  const toggleModal = () => {
    setModalOpen(prev => !prev);
  };

  const handleProfileClick = () => {
    navigate('/Profile'); // Navigate to the profile page
  };



  const handleLinkClick = (link) => {
    setActiveLink(link);
    if (isModalOpen) setModalOpen(false);
  };

  //logout confirmation
  const handleLogoutClick = () => {
    // activate the modal when the log out button being clicked. 
    setShowLogoutModal(true);
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

    const groupName = document.querySelector('[name="groupname"]').value;

    if (groupName) {
      const newCode = generateRandomCode();
      setCode(newCode);
      setShowPopup(true);
      try {
        const response = await fetch('http://localhost:5001/add-group', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ groupName: groupName, code: newCode, admin: userId }),
        });

        if (response.ok) {
          const data = await response.json();
          alert("Successfully created the group! group id: " + newCode + ".");
          window.location.reload();
          console.log('Group created successfully:', data);
        } else {
          console.error('Failed to create group, HTTP status:', response.status);
          const errorData = await response.json();
          console.error(errorData);
        }
      } catch (error) {
        console.error('Error during fetch operation:', error);
      }
    } else {
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


  const joinGroup = async () => {
    if (searchValue.length === 5) {
      try {
        const response = await fetch(`http://localhost:5001/join-group/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inviteCode: searchValue })
        });
        const data = await response.json();
        if (response.ok) {
          alert("Successfully joined the group!");
          window.location.reload();
        } else {
          console.log(data);
          if (data.error) {
            alert(data.error);
          } else {
            setResult(data.message || "Error to join groups");
          }
        }
      } catch (error) {
        console.error('Error:', error);
        setResult("Failed to join the group.");
      }
    } else {
      setResult('Please enter a 5-character code.');
    }
  };

  // log out modal creation. 
  const LogoutModal = () => {
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={() => setShowLogoutModal(false)}>&times;</span>
          <h3>Are you sure you want to log out from the website?</h3>
          <button onClick={confirmLogout}>Yes</button>
          <button onClick={() => setShowLogoutModal(false)}>No</button>
        </div>
      </div>
    );
  };

  // when the log out confirm, do this. 
  const confirmLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className="topnav">
        <div className="topnav-right">
          <button onClick={handleProfileClick}>Profile</button>
          <button onClick={handleLogoutClick} className='logout-button'>
            Logout
          </button>
        </div>
        {/* log out modal render only when showLogoutModal is true */}
        {/* https://stackoverflow.com/questions/45653564/react-js-avoid-the-modal-to-be-executed-when-the-component-is-rendered */}
        {showLogoutModal && <LogoutModal />}
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
              <img src='/download_new.png' alt="Recorded" />
              <span className="tooltiptext">
                Recorded
              </span>
            </Link>
          </li>
          <li>
            <Link to="/PostPage" className={activeLink === 'PostPage' ? 'active' : ''} onClick={() => handleLinkClick('PostPage')}>
              <img src='/post_new.png' alt="Post" />
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
            <div className="modal-content" id='group-modal'>
              <span className="closeModal" onClick={toggleModal}>&times;</span>
              <br />
              <div className='creategroup'>
                <h3 class='Title'>Create your group here</h3>
                <input
                  type="text"
                  class="modalInput"
                  placeholder="Your Group Name"
                  name='groupname'
                />
                <button onClick={handleCreateGroup} className='createButton'>Create!</button>
              </div>
              <div className="addGroup">
                <h3>Find your group here</h3>
                <input
                  type="text"
                  class="modalInput"
                  maxLength="5"
                  placeholder="Enter a 5-character code"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value.toUpperCase())}
                />
                <button onClick={joinGroup}>Join!</button>
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
