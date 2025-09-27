export const gandhiTimeline = {
  events: [
    {
      id: 1,
      title: "Birth",
      age: 0,
      event: "Born in Porbandar, India to a merchant family",
      date: "1869",
      branch: "main",
      y: 0,
      branches: [],
      stats: { popularity: 5, political_power: 0, wealth: 5 },
      personality: "Curious, empathetic child with strong moral values."
    },
    {
      id: 2,
      title: "Education in England",
      age: 18,
      event: "Traveled to London to study law",
      date: "1887",
      branch: "main",
      y: 1,
      branches: [],
      stats: { popularity: 6, political_power: 0, wealth: 4 },
      personality: "Diligent and disciplined, learning Western law and philosophy."
    },
    {
      id: 3,
      title: "Law Career in South Africa",
      age: 24,
      event: "Worked in South Africa and faced racial discrimination",
      date: "1893",
      branch: "main",
      y: 2,
      branches: [{ branch: "activism", color: "#e74c3c" }],
      stats: { popularity: 10, political_power: 2, wealth: 6 },
      personality: "Determined and compassionate, developing early activism skills."
    },
    {
      id: 4,
      title: "Nonviolent Activism Begins",
      age: 30,
      event: "Started organizing civil rights campaigns in South Africa",
      date: "1899",
      branch: "activism",
      y: 3,
      branches: [],
      stats: { popularity: 15, political_power: 5, wealth: 5 },
      personality: "Strategic and moral, advocating nonviolence and justice."
    },
    {
      id: 5,
      title: "Return to India",
      age: 38,
      event: "Returned to India to lead independence movement",
      date: "1915",
      branch: "main",
      y: 4,
      branches: [{ branch: "independence", color: "#3498db" }],
      stats: { popularity: 25, political_power: 10, wealth: 4 },
      personality: "Inspirational and patient, uniting people for a cause."
    },
    {
      id: 6,
      title: "Salt March",
      age: 60,
      event: "Led the Salt March against British salt taxes",
      date: "1930",
      branch: "independence",
      y: 5,
      branches: [],
      stats: { popularity: 50, political_power: 30, wealth: 3 },
      personality: "Resilient and persuasive, achieving large-scale civil mobilization."
    },
    {
      id: 7,
      title: "Quit India Movement",
      age: 71,
      event: "Called for British withdrawal from India",
      date: "1942",
      branch: "independence",
      y: 6,
      branches: [],
      stats: { popularity: 70, political_power: 50, wealth: 2 },
      personality: "Moral and steadfast, leading mass nonviolent resistance."
    },
    {
      id: 8,
      title: "Independence Achieved",
      age: 78,
      event: "India gains independence from British rule",
      date: "1947",
      branch: "main",
      y: 7,
      branches: [],
      stats: { popularity: 85, political_power: 70, wealth: 2 },
      personality: "Revered leader, embodying nonviolence and unity."
    },
    {
      id: 9,
      title: "Assassination",
      age: 78,
      event: "Assassinated in New Delhi",
      date: "1948",
      branch: "main",
      y: 8,
      branches: [],
      stats: { popularity: 90, political_power: 75, wealth: 2 },
      personality: "Legacy immortalized as a symbol of peace and justice."
    }
  ]
};
