import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import GroupCard from './GroupCard';

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
      alert('Group name is required');
      console.error('Group name is required');
    }
  };


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
                id={group.groupid}
                imgUrl={group.imgUrl}
                time={group.group_creation_time}
                groupName={group.groupname}
                admin={group.admin_username}
                invite_code={group.invite_code}
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
                  <button onClick={joinGroup}>Join!</button>
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
