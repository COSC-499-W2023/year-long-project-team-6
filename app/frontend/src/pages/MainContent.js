import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import GroupCard from './GroupCard';


function MainContent() {
  const [userId, setUserId] = useState('');
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const sessionUser = sessionStorage.getItem('user');
    console.log("Sessopm User: " + sessionUser);
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
          console.log(setGroups);
        })
        .catch(error => {
          console.error('Error fetching groups:', error);
        });
    }
  }, [userId]);

  return (
    <div className="content">
      <div className="main-content">
        <div className="first-row">
          {
            groups.map(group => (
              <GroupCard
                key={group.groupid} 
                imgUrl={group.imgUrl}
                groupName={group.name}
                admin={group.admin}
                numberOfPeople={group.numberOfPeople}
              />
            ))
          }

        </div>

      </div>
    </div>
  );
}

export default MainContent;
