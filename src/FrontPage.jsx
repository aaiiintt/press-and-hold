// src/FrontPage.jsx
import React, { useState } from 'react';
import Season1 from './Season1/ScratchCard'; 
// Assuming you have ScratchCard components for other seasons, import them as well:
// import Season2 from './Season2/ScratchCard';
// import Season3 from './Season3/ScratchCard';

const FrontPage = () => {
  const [selectedSeason, setSelectedSeason] = useState('Season1');

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };

  let SeasonComponent;

  switch (selectedSeason) {
    case 'Season1':
      SeasonComponent = <Season1 />;
      break;
    // Uncomment and update these cases if you add other seasons
    // case 'Season2':
    //   SeasonComponent = <Season2 />;
    //   break;
    // case 'Season3':
    //   SeasonComponent = <Season3 />;
    //   break;
    default:
      SeasonComponent = <Season1 />;
  }

  return (
    <div>
      <h1>Select Season</h1>
      <select value={selectedSeason} onChange={handleSeasonChange}>
        <option value="Season1">Season 1</option>
        {/* Add options for other seasons if required */}
        {/* <option value="Season2">Season 2</option> */}
        {/* <option value="Season3">Season 3</option> */}
      </select>
      {SeasonComponent}
    </div>
  );
};

export default FrontPage;