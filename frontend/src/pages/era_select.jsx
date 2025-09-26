// App.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { Card, CardHeader, CardTitle, CardBody } from '@progress/kendo-react-layout';
import { Fade } from '@progress/kendo-react-animation';
import '../styles/era_select.css';
import cardImage from '../assets/crop1.png'; // Ensure you have a suitable image

const ScrollCard = ({ era, description, backgroundImage }) => {
  return (
    <div className="scroll-card" style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative',
      minHeight: '300px',
      margin: '20px 0',
      borderRadius: '0',
      border: 'none',
      boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
      overflow: 'hidden'
    }}>
      {/* Overlay for better text readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1
      }} />
      
      {/* Scroll-like decorative edges */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '15px',
        zIndex: 3,
        borderRadius: '0 0 50px 50px / 0 0 10px 10px'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '15px',
        zIndex: 3,
        borderRadius: '50px 50px 0 0 / 10px 10px 0 0'
      }} />
      
      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: '40px 60px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <h2 style={{
          color: '#f4f1e8',
          fontSize: '2.5rem',
          fontFamily: 'serif',
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          fontWeight: 'bold'
        }}>
          {era}
        </h2>
        
        <p style={{
          color: '#f4f1e8',
          fontSize: '1.2rem',
          lineHeight: '1.6',
          marginBottom: '30px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
          fontStyle: 'italic'
        }}>
          {description}
        </p>
        
        <button style={{
          color: '#f4f1e8',
          border: '2px solid #654321',
          padding: '12px 30px',
          fontSize: '1.1rem',
          borderRadius: '25px',
          cursor: 'pointer',
          fontFamily: 'serif',
          fontWeight: 'bold',
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          transition: 'all 0.3s ease',
          alignSelf: 'center'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        }}>
          Explore More
        </button>
      </div>
      
      {/* Scroll corners */}
      <div style={{
        position: 'absolute',
        top: '-5px',
        left: '-5px',
        width: '30px',
        height: '30px',
        
        borderRadius: '0 0 15px 0',
        zIndex: 4
      }} />
      
      <div style={{
        position: 'absolute',
        top: '-5px',
        right: '-5px',
        width: '30px',
        height: '30px',
        
        borderRadius: '0 0 0 15px',
        zIndex: 4
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-5px',
        left: '-5px',
        width: '30px',
        height: '30px',

        borderRadius: '0 15px 0 0',
        zIndex: 4
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-5px',
        right: '-5px',
        width: '30px',
        height: '30px',
        
        borderRadius: '15px 0 0 0',
        zIndex: 4
      }} />
    </div>
  );
};


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
    <div ref={ref}>
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
    <div className="manuscript-container" >
      <header className="manuscript-header">
        <h1>Select the era you want to explore</h1>
      </header>

      <main className="manuscript-content">
        <FadeOnScroll>
          <ScrollCard
            era="Era 1900-2000"
            description="Long ago, in a land forgotten by time, heroes rose and fell, leaving behind tales etched in the hearts of generations..."
            backgroundImage={cardImage}
          />
        </FadeOnScroll>
        <FadeOnScroll>
          <Card className="story-card" style={{ backgroundImage: `url(${cardImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',  }}>
            <CardHeader>
              <CardTitle>Era 1900-2000</CardTitle>
            </CardHeader>
            <CardBody>
              <p>
                Long ago, in a land forgotten by time, heroes rose and fell, leaving behind tales
                etched in the hearts of generations...
              </p>
              <Button themeColor="primary">Explore More</Button>
            </CardBody>
          </Card>
        </FadeOnScroll>

        <FadeOnScroll>
          <Card className="story-card">
            <CardHeader>
              <CardTitle>Era 1800-1900</CardTitle>
            </CardHeader>
            <CardBody>
              <p>
                Mighty kingdoms flourished, their banners waving high, and the ink of scribes
                captured every conquest and tragedy.
              </p>
              <Button>Read Stories</Button>
            </CardBody>
          </Card>
        </FadeOnScroll>

        <FadeOnScroll>
          <Card className="story-card">
            <CardHeader>
              <CardTitle>Chapter III: The Golden Era</CardTitle>
            </CardHeader>
            <CardBody>
              <p>
                Legends were forged, alliances formed, and the ink of scribes captured
                glorious victories and tragic losses alike.
              </p>
              <Button>Discover More</Button>
            </CardBody>
          </Card>
        </FadeOnScroll>
      
        
      </main>
    </div>
  );
};

export default App;