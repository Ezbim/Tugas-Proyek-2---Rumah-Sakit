import React, { useState } from 'react';

const SearchComponent2 =({ inputValue2, handleInputChange, recommendations, handleRecommendationClick }) => {

  return (
    <div className='relative max-w-60'>
      <input className='w-full p-2'
       type="text" 
       value={inputValue2} 
       onChange={handleInputChange} 
       placeholder="Search nama layanan..."
      />
      <ul className='absolute mt-2 bg-gray-200 w-full z-10'>
        {recommendations.map((recommendation, index) => (
          <li className='hover:border border-black p-2'
            key={index} 
            onClick={() => handleRecommendationClick(recommendation.nama_layanan,recommendation.layanan_id)}
            style={{ cursor: 'pointer' }}
          >
            {recommendation.nama_layanan}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchComponent2;
