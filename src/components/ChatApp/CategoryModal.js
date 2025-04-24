import React from 'react';

// Modal component with fade-out animation
function CategoryModal({ isOpen, isClosing, categories, onCategorySelect }) {
  if (!isOpen && !isClosing) return null;
  
  const handleCategoryClick = (category) => {
    if (category.active) {
      // Track the event (will be integrated with GA and clickstream)
      trackCategorySelection(category);
      
      // Call the parent handler
      onCategorySelect(category);
    }
  };
  
  // Function to track category selection (would connect to GA/clickstream)
  const trackCategorySelection = (category) => {
    console.log(`Category selected: ${category.title}`); 
    // In a real implementation, you would send this to Google Analytics or clickstream
  };
  
  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`}>
      <div className="modal-content">
        <h2 className="modal-title">
          What do you need help with today?
        </h2>
        
        <div className="category-grid">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className={`category-item ${category.active ? 'active' : 'inactive'}`}
              onClick={() => handleCategoryClick(category)}
            >
              <div className={`category-icon ${category.active ? 'active' : 'inactive'}`}>
                <img 
                  src={category.image} 
                  alt={category.alt} 
                  className={`category-image ${!category.active ? 'inactive' : ''}`} 
                />
              </div>
              <span className={`category-title ${category.active ? 'active' : 'inactive'}`}>
                {category.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryModal;