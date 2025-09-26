// Book.jsx
import { useState } from "react";
import "../../styles/book.css";

// Page flip sound
const pageFlipSound = new Audio("/assets/page-flip.mp3");

export default function Book({ character, story }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const playPageFlipSound = () => {
    pageFlipSound.currentTime = 0;
    pageFlipSound.play().catch(() => {}); // Ignore errors if audio fails
  };

  const nextPage = () => {
    if (currentPage < story.length - 1 && !isFlipping) {
      setIsFlipping(true);
      playPageFlipSound();
      
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setTimeout(() => setIsFlipping(false), 300);
      }, 300);
    }
  };

  const prevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      playPageFlipSound();
      
      setTimeout(() => {
        setCurrentPage(prev => prev - 1);
        setTimeout(() => setIsFlipping(false), 300);
      }, 300);
    }
  };

  return (
    <div className="interactive-book">
      <div className="book-spine"></div>
      <div className="book-pages-container">
        <div className="book-pages-wrapper">
          {/* Previous pages (showing as a stack) */}
          {Array.from({ length: currentPage }).map((_, idx) => (
            <div
              key={`prev-${idx}`}
              className="book-page book-page-left"
              style={{ 
                zIndex: currentPage - idx,
                transform: `rotateY(0deg) translateZ(${idx * 2}px)`
              }}
            >
              <div className="book-page-content">
                <h3>{story[idx]?.title || "Previous Page"}</h3>
                <p>{story[idx]?.description || "Content from previous page..."}</p>
                <div className="page-number">Page {idx + 1}</div>
              </div>
            </div>
          ))}

          {/* Current page (right side) */}
          <div
            className={`book-page book-page-right ${isFlipping ? 'flipping' : ''}`}
            style={{ zIndex: 100 }}
          >
            <div className="book-page-content">
              <h3>{story[currentPage]?.title || "Current Page"}</h3>
              <p>{story[currentPage]?.description || "Current page content..."}</p>
              <div className="page-number">Page {currentPage + 1}</div>
            </div>
          </div>

          {/* Next page preview (slightly visible) */}
          {currentPage < story.length - 1 && (
            <div
              className="book-page book-page-next-preview"
              style={{ zIndex: 50 }}
            >
              <div className="book-page-content">
                <h3>{story[currentPage + 1]?.title || "Next Page"}</h3>
                <p>{story[currentPage + 1]?.description || "Next page content..."}</p>
                <div className="page-number">Page {currentPage + 2}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="book-controls">
        <button 
          onClick={prevPage} 
          disabled={currentPage === 0 || isFlipping}
          className="book-control-btn book-prev-btn"
        >
          ◀ Previous Page
        </button>
        
        <div className="book-progress">
          <span>Page {currentPage + 1} of {story.length}</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentPage + 1) / story.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <button 
          onClick={nextPage} 
          disabled={currentPage === story.length - 1 || isFlipping}
          className="book-control-btn book-next-btn"
        >
          Next Page ▶
        </button>
      </div>
    </div>
  );
}