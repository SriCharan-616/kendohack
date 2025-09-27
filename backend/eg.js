const response = await fetch('http://localhost:5000/get-options', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    currentEvent: '3)Lincoln decides to focus solely on farm work, postponing his education and political ambitions for several years.' ,
    previousEvents: [
      "1)Learned to read and write from family and self-study",
      '2)Starts helping his father with farm work, learning the value of hard work and responsibility.'
    ]
  })
});
const data = await response.json();
console.log(data);