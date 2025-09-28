import React, { useState, useRef } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { Card, CardHeader, CardBody } from "@progress/kendo-react-layout";
import "@progress/kendo-theme-default/dist/all.css";
import "../../styles/timeline.css";

// Assign colors to branches
const getBranchColors = (events) => {
  const uniqueBranches = [...new Set(events.map((e) => e.branch))];
  const branchColors = {};
  uniqueBranches.forEach((branch, idx) => {
    const hue = (idx * 360) / uniqueBranches.length;
    branchColors[branch] = `hsl(${hue}, 70%, 50%)`;
  });
  return branchColors;
};

// Assign lanes to branches
const assignBranchLanes = (events) => {
  const branchLanes = {};
  let lane = 0;
  const sortedBranches = [...new Set(events.map((e) => e.branch))];
  sortedBranches.forEach((branch) => {
    branchLanes[branch] = lane++;
  });
  return branchLanes;
};

// Event Node Component
const EventNode = ({ event, onClick, isActive, branchColor, lane }) => {
  const x = 100 - 10 + lane * 70;
  const y = 100 - 15 + event.y * 90;
  return (
    <div
      className={`event-node ${isActive ? "scale-125" : ""}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        position: "absolute",
        cursor: "pointer",
        zIndex: 10,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(event, { x, y });
      }}
    >
      <div className="circle" style={{ backgroundColor: branchColor }} />
      <div className="label">{event.title}</div>
    </div>
  );
};

// Dialogue Box Component (shifted slightly to the right)
const DialogueBox = ({ event, position, onClose, onNodeDoubleClick }) => {
  if (!event) return null;
  return (
    <div
      className="dialogue-box"
      style={{
        left: `${position.x + 60}px`, // shifted right
        top: `${position.y}px`,
        width: "250px",
        zIndex: 1000,
        pointerEvents: "auto",
        position: "absolute",
      }}
    >
      <Button
        look="flat"
        style={{
          position: "absolute",
          top: 5,
          right: 5,
          zIndex: 4,
        }}
        onClick={onClose}
      >
        X
      </Button>
      <Card>
        <CardHeader style={{ fontSize: "0.85rem" }}>{event.title}</CardHeader>
        <CardBody style={{ fontSize: "0.75rem" }}>
          <p>{event.event}</p>
          <p style={{ color: "#f1c40f" }}>📅 {event.date}</p>
          {event.cause && <p style={{ color: "#2ecc71" }}>🔗 {event.cause}</p>}
          {onNodeDoubleClick && (
            <p style={{ color: event.valid ? "#2ecc71" : "#e74c3c" }}>
              {event.valid ? "✅ Valid Branch" : "❌ Invalid Branch"}
            </p>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

// Main Timeline Component
const TimeLine = ({ timelineData, onNodeDoubleClick }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialoguePosition, setDialoguePosition] = useState({ x: 0, y: 0 });
  const lastClickRef = useRef({ nodeId: null, time: 0 });

  const [tooltipMessage, setTooltipMessage] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const events = timelineData?.events || [];
  const branchColors = getBranchColors(events);
  const branchLanes = assignBranchLanes(events);

  const maxY = Math.max(...events.map((e) => e.y));
  const containerWidth = Object.keys(branchLanes).length * 100 + 100;
  const containerHeight = (maxY + 3) * 100;

  const handleEventClick = (event, position) => {
    const now = Date.now();
    const DOUBLE_CLICK_DELAY = 400;

    if (
      lastClickRef.current.nodeId === event.id &&
      now - lastClickRef.current.time < DOUBLE_CLICK_DELAY
    ) {
      if (event.valid && onNodeDoubleClick) {
        // ✅ Double-click on valid node: trigger game navigation
        onNodeDoubleClick(event);
        lastClickRef.current = { nodeId: null, time: 0 };
        return; // skip dialogue box
      } else if (!event.valid && onNodeDoubleClick) {
        // Show tooltip near cursor
        setTooltipMessage("❌ This node is invalid. Cannot enter the game.");
        setTooltipPosition({ x: position.x + 15, y: position.y - 40 });
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 1500);
        lastClickRef.current = { nodeId: null, time: 0 };
        return; // skip dialogue box
      }
    } else {
      lastClickRef.current = { nodeId: event.id, time: now };
    }

    // Single click: show dialogue box
    setSelectedEvent(event);
    setDialoguePosition(position);
  };

  const closeDialogue = () => setSelectedEvent(null);

  // Build branch lines
  const branchLines = [];
  events.forEach((event) => {
    const sameBranchEvents = events
      .filter((e) => e.branch === event.branch)
      .sort((a, b) => a.y - b.y);

    for (let i = 0; i < sameBranchEvents.length - 1; i++) {
      const from = sameBranchEvents[i];
      const to = sameBranchEvents[i + 1];
      branchLines.push({ from, to, color: branchColors[event.branch] });
    }

    event.branches?.forEach((b) => {
      const childEvent = events.find((e) => e.branch === b.branch);
      if (childEvent)
        branchLines.push({
          from: event,
          to: childEvent,
          color: branchColors[b.branch],
        });
    });
  });

  const handleBackgroundClick = () => closeDialogue();

  return (
    <div onClick={handleBackgroundClick} style={{ position: "relative" }}>
      <div className="timeline-container">
        <strong>Branches:</strong>
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: 5 }}>
          {Object.entries(branchColors).map(([branch, color]) => (
            <div
              key={branch}
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: 10,
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: color,
                  marginRight: 4,
                }}
              />
              <span style={{ fontSize: 12 }}>{branch.replace("-", " ")}</span>
            </div>
          ))}
        </div>

        <div
          className="timeline-content"
          style={{
            width: containerWidth,
            height: containerHeight,
            position: "relative",
          }}
        >
          <svg
            className="timeline-svg"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            {branchLines.map((line, idx) => {
              const mulx = 70;
              const muly = 90;
              const fromX = 100 + branchLanes[line.from.branch] * mulx;
              const fromY = 100 + line.from.y * muly;
              const toX = 100 + branchLanes[line.to.branch] * mulx;
              const toY = 100 + line.to.y * muly;
              return (
                <line
                  key={idx}
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke={line.color}
                  strokeWidth="2"
                />
              );
            })}
          </svg>

          {events.map((event) => (
            <EventNode
              key={event.id}
              event={event}
              branchColor={branchColors[event.branch]}
              onClick={handleEventClick}
              isActive={selectedEvent?.id === event.id}
              lane={branchLanes[event.branch]}
            />
          ))}

          <DialogueBox
            event={selectedEvent}
            position={dialoguePosition}
            onClose={closeDialogue}
            onNodeDoubleClick={onNodeDoubleClick}
          />

          {showTooltip && (
            <div
              className="tooltip-custom"
              style={{
                position: "absolute",
                left: tooltipPosition.x,
                top: tooltipPosition.y,
                background: "#333",
                color: "#fff",
                padding: "6px 10px",
                borderRadius: 4,
                fontSize: 12,
                zIndex: 2000,
                pointerEvents: "none",
                whiteSpace: "nowrap",
              }}
            >
              {tooltipMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeLine;
