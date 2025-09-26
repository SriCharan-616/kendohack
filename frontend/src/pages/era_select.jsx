// App.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { Card, CardHeader, CardTitle, CardBody } from '@progress/kendo-react-layout';
import { Fade } from '@progress/kendo-react-animation';
import '../styles/era_select.css';
import romeImage from '../assets/leonardo.png';
import industrialImage from '../assets/leonardo.png';
import modernImage from '../assets/leonardo.png';


const FadeOnScroll = ({ children }) => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div ref={ref} className="story-card">
      <Fade >
        <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s' }}>
          {children}
        </div>
      </Fade>
    </div>
  );
};

const App = () => {
  return (
    <div className="manuscript-container">
      <header className="manuscript-header">
        <div className="center-ornament">◆</div>
        <h1>Select the era you want to explore</h1>
      </header>
      <main className="manuscript-content">
        <FadeOnScroll>
          <Card className="ancient-rome-card">
            <div className="card-content-wrapper">
              <div className="card-text-section">
                <CardHeader>
                  <CardTitle>Ancient Rome Era (27 BC - 476 AD)</CardTitle>
                </CardHeader>
                <CardBody>
                  <p>
                    Step into the sandals of Caesar and navigate the marble halls of the Forum. 
                    Command legions, debate with senators, and shape the destiny of the eternal city 
                    where gods and mortals intertwine...
                  </p>
                  <Button>⚔️ Enter the Empire</Button>
                </CardBody>
              </div>
              <div className="card-image-section">
                <img src={romeImage} alt="Ancient Rome" className="era-image" />
              </div>
            </div>
          </Card>
        </FadeOnScroll>
        
        <FadeOnScroll>
          <Card className="industrial-era-card">
            <div className="card-content-wrapper">
              <div className="card-text-section">
                <CardHeader>
                  <CardTitle>Industrial Revolution (1800-1900)</CardTitle>
                </CardHeader>
                <CardBody>
                  <p>
                    Witness the dawn of steam and steel as nations transform before your eyes. 
                    Lead through an age of innovation, social upheaval, and industrial might 
                    that will reshape civilization forever...
                  </p>
                  <Button>⚙️ Power the Revolution</Button>
                </CardBody>
              </div>
              <div className="card-image-section">
                <img src={industrialImage} alt="Industrial Revolution" className="era-image" />
              </div>
            </div>
          </Card>
        </FadeOnScroll>
        
        <FadeOnScroll>
          <Card className="modern-era-card">
            <div className="card-content-wrapper">
              <div className="card-text-section">
                <CardHeader>
                  <CardTitle>Modern Era (1900-2000)</CardTitle>
                </CardHeader>
                <CardBody>
                  <p>
                    Navigate through a century of unprecedented change, world wars, and technological 
                    revolution. Guide nations through their greatest triumphs and darkest hours 
                    in humanity's most transformative century...
                  </p>
                  <Button>🚀 Shape the Future</Button>
                </CardBody>
              </div>
              <div className="card-image-section">
                <img src={modernImage} alt="Modern Era" className="era-image" />
              </div>
            </div>
          </Card>
        </FadeOnScroll>
      </main>
    </div>
  );
};

export default App;