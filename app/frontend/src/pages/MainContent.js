import React, { useState, useEffect,useRef } from 'react';
import { useNavigate } from "react-router-dom";
import GroupCard from './GroupCard';
import newUserArrow from '../component/image/Arrow_newUser.png';

function MainContent() {
  const [userId, setUserId] = useState('');
  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [result, setResult] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionUser = sessionStorage.getItem('user');
    if (!sessionUser) {
      navigate('/login');
    } else {
      const user = JSON.parse(sessionUser);
      setUserId(user.userid);
      console.log("User Id: " + user.userid);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:5001/groups/${userId}`,)
        .then(response => {
          console.log(response);
          if (!response.ok) {
            console.error('Response Status:', response.status);
            console.error('Response Status Text:', response.statusText);
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setGroups(data);
        })
        .catch(error => {
          console.error('Error fetching groups:', error);
        });
    }
  }, [userId]);
  console.log(groups);

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

  const searchGroup = () => {
    const message = searchValue.length === 5
      ? `Searching for group with code: ${searchValue}`
      : 'Please enter a 5-character code.';
    setResult(message);
  };

  const toggleModal = () => {
    setModalOpen(prev => !prev);
  };

  return (
    <div className="content">
      <div className="main-content">
        <div className="first-row">
        {groups.length > 0 ? (
                        groups.map(group => (
                            <GroupCard
                                key={group.groupid}
                                imgUrl={group.imgUrl}
                                time={group.group_creation_time}
                                groupName={group.groupname}
                                admin={group.admin}
                                numberOfPeople={group.member_count}
                            />
                        ))
                    ) : (
                      <div className='newUser'>
                        <h2>You are not in any group yet. Join or create a new group to get started!</h2>
                        <a id="myBtn" className="addgroup" href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleModal(); }}>
                        <button>Click Here to Create or Join!</button>
                        </a>
                        </div>
                    )}
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

      </div>
    </div>
  );
}

export default MainContent;
