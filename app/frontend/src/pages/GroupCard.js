import React from 'react';
import { Link } from 'react-router-dom';

function GroupCard({ imgUrl, groupName, admin, numberOfPeople }) {
  return (
    <div className="card">
      <div className="photo">
        <img src={imgUrl} alt="" className="img1" />
      </div>
      <h3>{groupName}</h3>
      <h4>Information:</h4>
      <p>Creation time: xxxx/xx/xx<br />
        Admin: {admin}<br />
        Number of people: {numberOfPeople}<br />
      </p>
      <Link to="/Members">Check members</Link>
    </div>
  );
}

export default GroupCard;
