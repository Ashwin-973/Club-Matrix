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
  {
    id: 6,
    name: "Music Society",
    group: "Arts & Culture",
    tags: ["music", "instruments", "vocals", "concerts"],
    description: "Organizes musical events, concerts, and provides opportunities for students to showcase their musical talents."
  },
  {
    id: 7,
    name: "Art & Design Club",
    group: "Arts & Culture",
    tags: ["visual arts", "design", "creativity", "exhibitions"],
    description: "Promotes visual arts through workshops, exhibitions, and collaborative art projects spanning various artistic mediums."
  },
  {
    id: 8,
    name: "Cultural Heritage Society",
    group: "Arts & Culture",
    tags: ["culture", "traditions", "festivals", "heritage"],
    description: "Celebrates and preserves cultural traditions through festivals, cultural events, and educational programs."
  },

  {
    id: 9,
    name: "Community Service Club",
    group: "Service",
    tags: ["volunteering", "community outreach", "social impact", "charity"],
    description: "Engages in various community service projects and organizes volunteer activities to make a positive social impact."
  },
  {
    id: 10,
    name: "Environmental Action Group",
    group: "Service",
    tags: ["environment", "sustainability", "conservation", "activism"],
    description: "Focuses on environmental conservation through campus sustainability initiatives and environmental awareness campaigns."
  },
  {
    id: 11,
    name: "Blood Donation Drive",
    group: "Service",
    tags: ["healthcare", "donation", "medical assistance", "humanitarian"],
    description: "Organizes regular blood donation camps and health awareness programs to support healthcare initiatives."
  },
  {
    id: 12,
    name: "Literacy Outreach Program",
    group: "Service",
    tags: ["education", "literacy", "teaching", "social service"],
    description: "Provides educational support to underprivileged communities through tutoring and literacy programs."
  },

  {
    id: 13,
    name: "Sports Club",
    group: "Recreation",
    tags: ["adventure", "outdoor sports", "trekking", "camping"],
    description: "Organizes adventure activities like trekking, camping, and outdoor sports for thrill-seeking students."
  },
  {
    id: 14,
    name: "Gaming Society",
    group: "Recreation",
    tags: ["gaming", "esports", "tournaments", "entertainment"],
    description: "Hosts gaming tournaments and events for both video games and traditional board games."
  },
  {
    id: 15,
    name: "Photography Club",
    group: "Recreation",
    tags: ["photography", "visual storytelling", "workshops", "exhibitions"],
    description: "Explores the art of photography through workshops, photo walks, and annual photography exhibitions."
  },
  {
    id: 16,
    name: "Fitness & Wellness Club",
    group: "Recreation",
    tags: ["fitness", "wellness", "health", "sports"],
    description: "Promotes physical fitness and mental wellness through group workouts, yoga sessions, and health awareness programs."
  }
];


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