import React, { useState } from "react";
import { caesarTimeline } from "../../data/caesar.js";
import { Button } from '@progress/kendo-react-buttons';
import { Card, CardHeader, CardBody, CardActions } from '@progress/kendo-react-layout';
import { PanelBar, PanelBarItem } from '@progress/kendo-react-layout'; 
import { Tooltip } from '@progress/kendo-react-tooltip';
import "@progress/kendo-theme-default/dist/all.css";
import "../../styles/timeline.css";

// Automatically assign colors to each branch
const getBranchColors = (events) => {
  const colorsPalette = ["#2c3e50","#e74c3c","#3498db","#e67e22","#8e44ad","#27ae60","#f39c12","#1abc9c"];
  const uniqueBranches = [...new Set(events.map(e => e.branch))];
  const branchColors = {};
  uniqueBranches.forEach((branch, idx) => branchColors[branch] = colorsPalette[idx % colorsPalette.length]);
  return branchColors;
};

const EventNode = ({ event, onClick, isActive, branchColor }) => (
  <div
    className={`event-node ${isActive ? "scale-125" : ""}`}
    style={{ left: `${50 + event.x * 80}px`, top: `${100 + event.y * 100}px` }}
    onClick={(e) => onClick(event, { x: e.clientX, y: e.clientY })}
  >
    <div className="circle" style={{ backgroundColor: branchColor }} />
    <div className="label">{event.title}</div>
  </div>
);

const DialogueBox = ({ event, position, onClose }) => {
  if (!event) return null;
  return (
    <div
      className="dialogue-box"
      style={{
        left: Math.min(position.x + 20, window.innerWidth - 320),
        top: Math.max(position.y - 50, 10),
      }}
    >
      <Button look="flat" icon="close" style={{ position: "absolute", top: 5, right: 5 }} onClick={onClose} />
      <Card>
        <CardHeader>
          <h3>{event.title}</h3>
        </CardHeader>
        <CardBody>
          <p>{event.description}</p>
          <p style={{ fontSize: "0.75rem", color: "#f1c40f" }}>📅 {event.date}</p>
          {event.cause && <p style={{ fontSize: "0.75rem", color: "#2ecc71" }}>🔗 {event.cause}</p>}
        </CardBody>
      </Card>
    </div>
  );
};

const GitTimeline = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialoguePosition, setDialoguePosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleEventClick = (event, position) => {
    setSelectedEvent(event);
    setDialoguePosition(position);
  };
  const closeDialogue = () => setSelectedEvent(null);

  const branchColors = getBranchColors(caesarTimeline.events);

  const maxX = Math.max(...caesarTimeline.events.map(e => e.x));
  const maxY = Math.max(...caesarTimeline.events.map(e => e.y));
  const containerWidth = (maxX + 3) * 80 + 200;
  const containerHeight = (maxY + 3) * 100 + 300;

  // Build branch lines, all lines inherit branch color
  const branchLines = [];
  caesarTimeline.events.forEach(event => {
    const sameBranchEvents = caesarTimeline.events.filter(e => e.branch === event.branch).sort((a,b)=>a.y-b.y);
    for (let i = 0; i < sameBranchEvents.length - 1; i++) {
      branchLines.push({ from: sameBranchEvents[i], to: sameBranchEvents[i+1], color: branchColors[event.branch] });
    }
    // connect to any spawned branch
    event.branches.forEach(b => {
      const childEvent = caesarTimeline.events.find(e => e.branch === b.branch);
      if (childEvent) branchLines.push({ from: event, to: childEvent, color: branchColors[b.branch] });
    });
  });

  return (
    <div >
      <div className="timeline-container">
        <Card style={{ top: 10  }}>
            <CardHeader>Branches</CardHeader>
            <CardBody>
              {Object.entries(branchColors).map(([branch,color]) => (
                <div key={branch} style={{ display:"flex", alignItems:"center", marginBottom:4 }}>
                  <div style={{ width:12, height:12, borderRadius:"50%", backgroundColor:color, marginRight:6 }} />
                  <span style={{ fontSize:12, textTransform:"capitalize" }}>{branch.replace("-"," ")}</span>
                </div>
              ))}
            </CardBody>
          </Card>
        <div className="timeline-content" style={{ width: `${containerWidth}px`, height: `${containerHeight}px`, transform: `scale(${zoom})`, left:"50%"}}>
          <svg className="timeline-svg">
            {branchLines.map((line, idx) => {
              const fromX = 50 + line.from.x * 80;
              const fromY = 100 + line.from.y * 100;
              const toX = 50 + line.to.x * 80;
              const toY = 100 + line.to.y * 100;
              const pathData = `M ${fromX} ${fromY} Q ${(fromX+toX)/2} ${(fromY+toY)/2} ${toX} ${toY}`;
              return <path key={idx} d={pathData} stroke={line.color} strokeWidth="2" fill="none" />;
            })}
          </svg>

          {caesarTimeline.events.map(event => (
            <EventNode
              key={event.id}
              event={event}
              branchColor={branchColors[event.branch]}
              onClick={handleEventClick}
              isActive={selectedEvent?.id === event.id}
            />
          ))}
          
        </div>
      </div>

      <DialogueBox event={selectedEvent} position={dialoguePosition} onClose={closeDialogue} />
      {selectedEvent && <div className="fixed inset-0 z-40" onClick={closeDialogue} />}
    </div>
  );
};

export default GitTimeline;
