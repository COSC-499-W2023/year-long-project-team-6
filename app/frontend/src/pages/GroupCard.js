import React from 'react';
import { Link } from 'react-router-dom';

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


function GroupCard({ imgUrl, time, groupName, admin, numberOfPeople  }) {
  const randomColor = getRandomColor();
  return (
    <div className="card">
      <div className="photo" style={{ backgroundColor: randomColor }}>
      </div>
      <h3>{groupName}</h3>
      <h4>Information:</h4>
      <p>Creation time: {time.split('T')[0]}<br />
        Admin: {admin}<br />
        Number of people: {numberOfPeople}<br />
      </p>
      <Link to="/Members">Check members</Link>
    </div>
  );
}

export default GroupCard;
