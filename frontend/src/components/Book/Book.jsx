// Book.jsx
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody
} from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import { ProgressBar } from '@progress/kendo-react-progressbars';
import "../../styles/book.css";

// Page flip sound
const pageFlipSound = new Audio("/assets/page-flip.mp3");

export default function Book({ character, story }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const playPageFlipSound = () => {
    pageFlipSound.currentTime = 0;
    pageFlipSound.play().catch(() => {});
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
          {Array.from({ length: currentPage }).map((_, idx) => (
            <Card
              key={`prev-${idx}`}
              className="book-page book-page-left"
              style={{
                zIndex: currentPage - idx,
                transform: `rotateY(0deg) translateZ(${idx * 2}px)`
              }}
            >
              <CardHeader><h3>{story[idx]?.title || "Previous Page"}</h3></CardHeader>
              <CardBody>
                <p>{story[idx]?.description || "Content from previous page..."}</p>
                <div className="page-number">Page {idx + 1}</div>
              </CardBody>
            </Card>
          ))}

          <Card
            className={`book-page book-page-right ${isFlipping ? "flipping" : ""}`}
            style={{ zIndex: 100 }}
          >
            <CardHeader><h3>{story[currentPage]?.title || "Current Page"}</h3></CardHeader>
            <CardBody>
              <p>{story[currentPage]?.description || "Current page content..."}</p>
              <div className="page-number">Page {currentPage + 1}</div>
            </CardBody>
          </Card>

          {currentPage < story.length - 1 && (
            <Card
              className="book-page book-page-next-preview"
              style={{ zIndex: 50 }}
            >
              <CardHeader><h3>{story[currentPage + 1]?.title || "Next Page"}</h3></CardHeader>
              <CardBody>
                <p>{story[currentPage + 1]?.description || "Next page content..."}</p>
                <div className="page-number">Page {currentPage + 2}</div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      <div className="book-controls">
        <Button
          onClick={prevPage}
          disabled={currentPage === 0 || isFlipping}
          className="book-control-btn book-prev-btn"
        >
          ◀ Previous
        </Button>

        <div className="book-progress">
          <span>Page {currentPage + 1} of {story.length}</span>
          <ProgressBar
            value={((currentPage + 1) / story.length) * 100}
          />
        </div>

        <Button
          onClick={nextPage}
          disabled={currentPage === story.length - 1 || isFlipping}
          className="book-control-btn book-next-btn"
        >
          Next ▶
        </Button>
      </div>
    </div>
  );
}
