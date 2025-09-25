// App.jsx
import React from 'react';
import { Button, FloatingActionButton } from '@progress/kendo-react-buttons';
import { Card, CardHeader, CardTitle, CardBody } from '@progress/kendo-react-layout';
import { Fade } from '@progress/kendo-react-animation';
import bg from '../assets/background.jpg';


const App = () => {
  return (
    <div
      className="manuscript-container"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}
    >
      <header className="manuscript-header">
        <h1>The Chronicles of Time</h1>
        <p className="subtitle">A Journey Through History</p>
      </header>

      <main className="manuscript-content">
        {/* Card 1 */}
        <Fade appear={true}>
          <Card className="story-card">
            <CardHeader>
              <CardTitle>Chapter I: The Dawn</CardTitle>
            </CardHeader>
            <CardBody>
              <p>
                Long ago, in a land forgotten by time, heroes rose and fell, leaving behind tales
                etched in the hearts of generations. The parchment whispers secrets of those
                ancient days...
              </p>
              <Button themeColor="primary">Explore More</Button>
            </CardBody>
            <FloatingActionButton icon="arrow-right" positionMode="absolute" align={{ horizontal: 'end', vertical: 'end' }} />
          </Card>
        </Fade>

        {/* Card 2 */}
        <Fade appear={true}>
          <Card className="story-card">
            <CardHeader>
              <CardTitle>Chapter II: The Rise of Kingdoms</CardTitle>
            </CardHeader>
            <CardBody>
              <p>
                Mighty kingdoms flourished, their banners waving high, and the ink of scribes
                captured every conquest and tragedy.
              </p>
              <Button>Read Stories</Button>
            </CardBody>
            <FloatingActionButton icon="book" positionMode="absolute" align={{ horizontal: 'end', vertical: 'end' }} />
          </Card>
        </Fade>

        {/* Card 3 */}
        <Fade appear={true}>
          <FloatingActionButton>
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
          </FloatingActionButton>
        </Fade>
      </main>

      <footer className="manuscript-footer">
        &copy; 2025 Chronicles. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
