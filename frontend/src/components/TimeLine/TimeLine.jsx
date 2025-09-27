import React, { useState } from "react";
import { caesarTimeline } from "../../data/caesar.js";
import { Button } from '@progress/kendo-react-buttons';
import { Card, CardHeader, CardBody } from '@progress/kendo-react-layout';
import "@progress/kendo-theme-default/dist/all.css";
import "../../styles/timeline.css";

// Assign colors to branches
const getBranchColors = (events) => {
  const uniqueBranches = [...new Set(events.map(e => e.branch))];
  const branchColors = {};
  uniqueBranches.forEach((branch, idx) => {
    // Evenly space hues on the color wheel (0–360)
      const hue = (idx * 360) / uniqueBranches.length;
    // You can adjust saturation & lightness to taste
      branchColors[branch] = `hsl(${hue}, 70%, 50%)`;
  });  
  return branchColors;
};

// Assign lanes to branches
const assignBranchLanes = (events) => {
  const branchLanes = {};
  let lane = 0;
  const sortedBranches = [...new Set(events.map(e => e.branch))];
  sortedBranches.forEach(branch => {
    branchLanes[branch] = lane++;
  });
  return branchLanes;
};

const EventNode = ({ event, onClick, isActive, branchColor, lane }) => (
  <div
    className={`event-node ${isActive ? "scale-125" : ""}`}
    style={{
      left: `${100 - 12 + lane * 70}px`,
      top: `${100 - 15 + event.y * 90}px`,
      position: "absolute",
      cursor: "pointer",
      zIndex: 10
    }}
    onClick={(e) => { e.stopPropagation(); onClick(event, { x: e.clientX, y: e.clientY }); }}
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
        position: "absolute",
        left: position.x - 250,
        top: position.y - 400,
        width: "250px",
        zIndex: 1000,
        pointerEvents: "auto",
      }}
    >
      <Button look="flat" icon="close" style={{ position: "absolute", top: 5, right: 5 }} onClick={onClose} />
      <Card>
        <CardHeader style={{ fontSize: "0.85rem" }}>{event.title}</CardHeader>
        <CardBody style={{ fontSize: "0.75rem" }}>
          <p>{event.description}</p>
          <p style={{ color: "#f1c40f" }}>📅 {event.date}</p>
          {event.cause && <p style={{ color: "#2ecc71" }}>🔗 {event.cause}</p>}
        </CardBody>
      </Card>
    </div>
  );
};

const GitTimeline = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialoguePosition, setDialoguePosition] = useState({ x: 0, y: 0 });

  const handleEventClick = (event, position) => {
    setSelectedEvent(event);
    setDialoguePosition(position);
  };
  const closeDialogue = () => setSelectedEvent(null);

  const branchColors = getBranchColors(caesarTimeline.events);
  const branchLanes = assignBranchLanes(caesarTimeline.events);

  const maxY = Math.max(...caesarTimeline.events.map(e => e.y));
  const containerWidth = Object.keys(branchLanes).length * 100 + 100;
  const containerHeight = (maxY + 3) * 100;

  const branchLines = [];
  caesarTimeline.events.forEach(event => {
    const sameBranchEvents = caesarTimeline.events
      .filter(e => e.branch === event.branch)
      .sort((a,b) => a.y - b.y);

    for (let i = 0; i < sameBranchEvents.length - 1; i++) {
      const from = sameBranchEvents[i];
      const to = sameBranchEvents[i+1];
      branchLines.push({ from, to, color: branchColors[event.branch] });
    }

    event.branches.forEach(b => {
      const childEvent = caesarTimeline.events.find(e => e.branch === b.branch);
      if (childEvent) branchLines.push({ from: event, to: childEvent, color: branchColors[b.branch] });
    });
  });

  // Close dialogue when clicking outside
  const handleBackgroundClick = () => closeDialogue();

  return (
      <div onClick={handleBackgroundClick} style={{ position: 'relative' }}>
        <div className="timeline-container">
        <strong>Branches:</strong>
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: 5 }}>
          {Object.entries(branchColors).map(([branch,color]) => (
            <div key={branch} style={{ display:"flex", alignItems:"center", marginRight: 10, marginBottom: 4 }}>
              <div style={{ width:12, height:12, borderRadius:"50%", backgroundColor:color, marginRight:4 }} />
              <span style={{ fontSize:12 }}>{branch.replace("-"," ")}</span>
            </div>
          ))}
        </div>
      

        <div className="timeline-content" style={{ width: containerWidth, height: containerHeight, position: 'relative' }}>
          <svg className="timeline-svg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            {branchLines.map((line, idx) => {
              const mulx = 70;
              const muly = 90;
              const fromX = 100 + branchLanes[line.from.branch] * mulx;
              const fromY = 100 + line.from.y * muly;
              const toX = 100 + branchLanes[line.to.branch] * mulx;
              const toY = 100 + line.to.y * muly;
              return <line key={idx} x1={fromX} y1={fromY} x2={toX} y2={toY} stroke={line.color} strokeWidth="2" />;
            })}
          </svg>

          {caesarTimeline.events.map(event => (
            <EventNode
              key={event.id}
              event={event}
              branchColor={branchColors[event.branch]}
              onClick={handleEventClick}
              isActive={selectedEvent?.id === event.id}
              lane={branchLanes[event.branch]}
            />
          ))}
        </div>
      </div>

      <DialogueBox event={selectedEvent} position={dialoguePosition} onClose={closeDialogue} />
    </div>
  );
};

export default GitTimeline;
