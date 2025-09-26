export const caesarTimeline = {
  events: [
    {
      id: 1,
      title: "Birth",
      description: "Born into the Julius family, a patrician family in Rome",
      date: "100 BCE",
      branch: "main",
      x: 0,
      y: 0,
      branches: []
    },
    {
      id: 2,
      title: "Political Career Begins",
      description: "Started his political career as a young man in Rome",
      date: "85 BCE",
      branch: "main",
      x: 0,
      y: 1,
      branches: []
    },
    {
      id: 3,
      title: "Military Service",
      description: "Served in the military and gained experience in warfare",
      date: "81 BCE",
      branch: "main",
      x: 0,
      y: 2,
      branches: [{ branch: "military", color: "#e74c3c" }]
    },
    {
      id: 4,
      title: "Gallic Campaign Start",
      description: "Began the conquest of Gaul",
      date: "58 BCE",
      branch: "military",
      x: 1,
      y: 3,
      branches: [{ branch: "gallic-tribes", color: "#8e44ad" }],
      cause: "Military expertise led to this campaign"
    },
    {
      id: 5,
      title: "Helvetii War",
      description: "Defeated the migrating Helvetii tribe",
      date: "58 BCE",
      branch: "gallic-tribes",
      x: -2,
      y: 4,
      branches: [{ branch: "germanic-threat", color: "#27ae60" }],
      cause: "Strategic response to tribal movements"
    },
    {
      id: 6,
      title: "Germanic Invasion",
      description: "Repelled Germanic tribes across the Rhine",
      date: "55 BCE",
      branch: "germanic-threat",
      x: 3,
      y: 5,
      branches: [],
      cause: "Germanic tribes threatened Gallic allies"
    },
    {
      id: 7,
      title: "Gallic Wars End",
      description: "Completed conquest of Gaul with victory at Alesia",
      date: "50 BCE",
      branch: "military",
      x: 1,
      y: 6,
      branches: [],
      cause: "Final consolidation of Gallic territories"
    },
    {
      id: 8,
      title: "Consul Election",
      description: "Elected as Consul of Rome",
      date: "59 BCE",
      branch: "main",
      x: 0,
      y: 3,
      branches: [{ branch: "political", color: "#3498db" }]
    },
    {
      id: 9,
      title: "First Triumvirate",
      description: "Formed political alliance with Pompey and Crassus",
      date: "60 BCE",
      branch: "political",
      x: 2,
      y: 4,
      branches: [{ branch: "senate-relations", color: "#f39c12" }],
      cause: "Political maneuvering to gain power"
    },
    {
      id: 10,
      title: "Senate Opposition",
      description: "Growing tension with traditional senators",
      date: "54 BCE",
      branch: "senate-relations",
      x: 3,
      y: 5,
      branches: [],
      cause: "Conservative senators opposed reforms"
    },
    {
      id: 11,
      title: "Crosses the Rubicon",
      description: "Made the fateful decision to cross the Rubicon river",
      date: "49 BCE",
      branch: "main",
      x: 0,
      y: 7,
      branches: [{ branch: "civil-war", color: "#e67e22" }]
    },
    {
      id: 12,
      title: "Civil War Begins",
      description: "War against Pompey and the Roman Senate",
      date: "49 BCE",
      branch: "civil-war",
      x: 4,
      y: 8,
      branches: [{ branch: "egyptian-campaign", color: "#1abc9c" }],
      cause: "Crossing the Rubicon started civil war"
    },
    {
      id: 13,
      title: "Egyptian Alliance",
      description: "Formed alliance with Cleopatra in Egypt",
      date: "47 BCE",
      branch: "egyptian-campaign",
      x: 5,
      y: 9,
      branches: [],
      cause: "Strategic alliance during civil war"
    },
    {
      id: 14,
      title: "Victory at Pharsalus",
      description: "Decisive victory over Pompey",
      date: "48 BCE",
      branch: "civil-war",
      x: 4,
      y: 10,
      branches: [],
      cause: "Major battle in the civil war"
    },
    {
      id: 15,
      title: "Dictator of Rome",
      description: "Became dictator and implemented major reforms",
      date: "44 BCE",
      branch: "main",
      x: 0,
      y: 11,
      branches: []
    },
    {
      id: 16,
      title: "Assassination",
      description: "Assassinated on the Ides of March by senators",
      date: "44 BCE",
      branch: "main",
      x: 0,
      y: 12,
      branches: []
    }
  ]
};