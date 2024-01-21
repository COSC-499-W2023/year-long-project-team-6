import React from 'react';
import GroupCard from './GroupCard';
function MainContent() {
  return (
    <div className="content">
      <div className="main-content">
        <div className="first-row">
          {/* Reuse GroupCard for each group */}
          <GroupCard imgUrl="/1.png" groupName="Group1" admin="XXX" numberOfPeople="50" />
          <GroupCard imgUrl="/2.png" groupName="Group2" admin="XXX" numberOfPeople="50" />
          {/* Add more GroupCards as needed */} 
        </div>
        {/* Add more rows and GroupCards as needed */}
      </div>
    </div>
  );
}

export default MainContent;
