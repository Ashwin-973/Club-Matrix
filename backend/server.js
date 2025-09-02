const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 1972;

app.use(cors());
app.use(express.json());

//mock data
const clubsData = [
  {
    id: 1,
    name: "Debate Society",
    group: "Academic",
    tags: ["debate", "public speaking", "argumentation", "competition"],
    description: "A competitive debate club that participates in inter-collegiate tournaments and helps students develop critical thinking and public speaking skills."
  },
  {
    id: 2,
    name: "Model United Nations",
    group: "Academic",
    tags: ["diplomacy", "international relations", "negotiation", "politics"],
    description: "Simulates UN proceedings where students represent different countries and engage in diplomatic discussions on global issues."
  },
  {
    id: 3,
    name: "Coding Club",
    group: "Academic",
    tags: ["coding", "software development", "hackathons", "technology"],
    description: "Dedicated to fostering programming skills through workshops, coding competitions, and collaborative software projects."
  },
  {
    id: 4,
    name: "Economics Research Society",
    group: "Academic",
    tags: ["research", "economics", "analysis", "finance"],
    description: "Conducts economic research projects and organizes seminars on current economic trends and policy analysis."
  },

  {
    id: 5,
    name: "Film Club",
    group: "Arts & Culture",
    tags: ["theater", "acting", "performance", "storytelling"],
    description: "Produces theatrical performances and provides a platform for students to explore acting, directing, and stage production."
  },
  
];


app.get('/api',(req,res)=>{
  res.send("Say My Name")
})

app.get('/api/clubs', (req, res) => {
  try {
    res.json(clubsData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clubs data' });
  }
});

app.get('/api/groups', (req, res) => {
  try {
    const groupedClubs = clubsData.reduce((groups, club) => {
      const group = club.group;
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(club);
      return groups;
    }, {});

    res.json(groupedClubs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to group clubs data' });
  }
});

app.get('/api/club/:id', (req, res) => {
  try {
    const clubId = parseInt(req.params.id);
    const club = clubsData.find(club => club.id === clubId);
    
    if (!club) {
      return res.status(404).json({ error: 'Club not found' });
    }
    
    res.json(club);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch club data' });
  }
});


app.listen(PORT, () => {
  console.log(`Club-Matrix api running on http://localhost:${PORT}`);

});