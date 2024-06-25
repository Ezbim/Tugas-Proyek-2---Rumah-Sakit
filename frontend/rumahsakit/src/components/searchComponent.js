import React, { useState } from 'react';

const SearchComponent =({ nama_obat, handleInputChange, recommendations, handleRecommendationClick }) => {

  return (
    <div className='relative w-3/4 '>
      <input className='w-full p-2 '
       type="text" 
       value={nama_obat} 
       onChange={handleInputChange} 
       placeholder="Search nama obat..."
      />
      <ul className='absolute mt-2 bg-gray-200 w-full z-10'>
        {recommendations.map((recommendation, index) => (
          <li className='hover:border border-black p-2'
            key={index} 
            onClick={() => handleRecommendationClick(recommendation.nama_obat,recommendation.obat_id)}
            style={{ cursor: 'pointer' }}
          >
            {recommendation.nama_obat}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchComponent;
