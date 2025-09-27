export const lincolnTimeline = {
  events: [
    {
      id: 1,
      title: "Birth",
      age: 0,
      event: "Born in a log cabin in Hardin County, Kentucky",
      date: "1809",
      branch: "main",
      y: 0,
      branches: [],
      stats: { popularity: 5, political_power: 0, wealth: 2 },
      personality: "Curious, determined child with strong moral instincts."
    },
    {
      id: 2,
      title: "Early Education",
      age: 10,
      event: "Learned to read and write from family and self-study",
      date: "1819",
      branch: "main",
      y: 1,
      branches: [],
      stats: { popularity: 6, political_power: 0, wealth: 2 },
      personality: "Self-taught and disciplined, valuing knowledge."
    },
    {
      id: 3,
      title: "Law Career Begins",
      age: 23,
      event: "Started working as a lawyer in Illinois",
      date: "1832",
      branch: "main",
      y: 2,
      branches: [{ branch: "politics", color: "#3498db" }],
      stats: { popularity: 10, political_power: 5, wealth: 5 },
      personality: "Ethical and persuasive, gaining community respect."
    },
    {
      id: 4,
      title: "Political Career",
      age: 35,
      event: "Elected to U.S. House of Representatives",
      date: "1844",
      branch: "politics",
      y: 3,
      branches: [],
      stats: { popularity: 20, political_power: 15, wealth: 5 },
      personality: "Pragmatic and strategic, building political influence."
    },
    {
      id: 5,
      title: "Lincoln-Douglas Debates",
      age: 40,
      event: "Gained national attention during debates on slavery",
      date: "1858",
      branch: "politics",
      y: 4,
      branches: [],
      stats: { popularity: 35, political_power: 25, wealth: 5 },
      personality: "Eloquent and principled, advocating abolition."
    },
    {
      id: 6,
      title: "President of the United States",
      age: 52,
      event: "Elected 16th President",
      date: "1860",
      branch: "main",
      y: 5,
      branches: [{ branch: "civil-war", color: "#e74c3c" }],
      stats: { popularity: 50, political_power: 50, wealth: 4 },
      personality: "Determined leader, navigating the nation through crisis."
    },
    {
      id: 7,
      title: "Civil War Leadership",
      age: 54,
      event: "Led the Union during the American Civil War",
      date: "1863",
      branch: "civil-war",
      y: 6,
      branches: [],
      stats: { popularity: 70, political_power: 65, wealth: 4 },
      personality: "Resilient and strategic, committed to preserving the Union."
    },
    {
      id: 8,
      title: "Emancipation Proclamation",
      age: 54,
      event: "Declared freedom for slaves in Confederate states",
      date: "1863",
      branch: "civil-war",
      y: 7,
      branches: [],
      stats: { popularity: 80, political_power: 70, wealth: 4 },
      personality: "Moral and visionary, advancing human rights."
    },
    {
      id: 9,
      title: "Assassination",
      age: 56,
      event: "Assassinated at Ford's Theatre in Washington, D.C.",
      date: "1865",
      branch: "main",
      y: 8,
      branches: [],
      stats: { popularity: 85, political_power: 75, wealth: 4 },
      personality: "Martyr for unity and freedom, leaving lasting legacy."
    }
  ]
};
