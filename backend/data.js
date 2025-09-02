const clubs = [
  {
    id: 1,
    name: "Computer Science Club",
    description: "A community for CS students to learn, build projects, and network with industry professionals.",
    group: "Academic",
    tags: ["programming", "technology", "networking", "projects"],
    heads: [
      { name: "Alex Chen", email: "alex.chen@example.com" },
      { name: "Sarah Kim", email: "sarah.kim@example.com" }
    ],
    metrics: {
      engagement: 85,
      community: 92,
      impact: 78,
      motivation: 88
    }
  },
  {
    id: 2,
    name: "Environmental Action Club",
    description: "Dedicated to promoting sustainability and environmental awareness on campus.",
    group: "Service",
    tags: ["environment", "sustainability", "community service", "awareness"],
    heads: [
      { name: "Maria Rodriguez", email: "maria.rodriguez@example.com" }
    ],
    metrics: {
      engagement: 76,
      community: 89,
      impact: 94,
      motivation: 91
    }
  },
  {
    id: 3,
    name: "Drama Society",
    description: "Bringing theater and performing arts to the campus community through productions and workshops.",
    group: "Arts",
    tags: ["theater", "performance", "creativity", "entertainment"],
    heads: [
      { name: "James Wilson", email: "james.wilson@example.com" },
      { name: "Emma Thompson", email: "emma.thompson@example.com" }
    ],
    metrics: {
      engagement: 82,
      community: 87,
      impact: 75,
      motivation: 89
    }
  },
  {
    id: 4,
    name: "Basketball Club",
    description: "Competitive and recreational basketball for all skill levels.",
    group: "Sports",
    tags: ["basketball", "sports", "fitness", "competition"],
    heads: [
      { name: "Michael Jordan", email: "mjordan@example.com" }
    ],
    metrics: {
      engagement: 91,
      community: 84,
      impact: 72,
      motivation: 86
    }
  },
  {
    id: 5,
    name: "Debate Team",
    description: "Developing critical thinking and public speaking skills through competitive debate.",
    group: "Academic",
    tags: ["debate", "public speaking", "critical thinking", "competition"],
    heads: [
      { name: "Rachel Green", email: "rachel.green@example.com" },
      { name: "David Lee", email: "david.lee@example.com" }
    ],
    metrics: {
      engagement: 79,
      community: 81,
      impact: 85,
      motivation: 87
    }
  },
  {
    id: 6,
    name: "Volunteer Corps",
    description: "Organizing community service projects and volunteer opportunities.",
    group: "Service",
    tags: ["volunteering", "community service", "charity", "outreach"],
    heads: [
      { name: "Lisa Wang", email: "lisa.wang@example.com" }
    ],
    metrics: {
      engagement: 88,
      community: 95,
      impact: 97,
      motivation: 93
    }
  },
  {
    id: 7,
    name: "Photography Club",
    description: "Exploring the art of photography through workshops, exhibitions, and photo walks.",
    group: "Arts",
    tags: ["photography", "art", "creativity", "exhibitions"],
    heads: [
      { name: "Kevin Park", email: "kevin.park@example.com" }
    ],
    metrics: {
      engagement: 74,
      community: 78,
      impact: 71,
      motivation: 82
    }
  },
  {
    id: 8,
    name: "Soccer Club",
    description: "Competitive soccer team representing the university in regional tournaments.",
    group: "Sports",
    tags: ["soccer", "football", "competition", "teamwork"],
    heads: [
      { name: "Carlos Santos", email: "carlos.santos@example.com" },
      { name: "Ana Lopez", email: "ana.lopez@example.com" }
    ],
    metrics: {
      engagement: 87,
      community: 83,
      impact: 79,
      motivation: 90
    }
  },
  {
    "id": 9,
    "name": "Chess Club",
    "description": "For enthusiasts of all skill levels to play and study chess, fostering strategic thinking and friendly competition.",
    "group": "Academic",
    "tags": ["chess", "strategy", "competition", "logic"],
    "heads": [
      { "name": "Ben Carter", "email": "ben.carter@example.com" }
    ],
    "metrics": {
      "engagement": 84,
      "community": 80,
      "impact": 70,
      "motivation": 88
    }
  },
  {
    "id": 10,
    "name": "Coding Club",
    "description": "A hub for computer science students to collaborate on projects, learn new languages, and prepare for hackathons.",
    "group": "Academic",
    "tags": ["coding", "computer science", "programming", "technology"],
    "heads": [
      { "name": "Sarah Chen", "email": "sarah.chen@example.com" },
      { "name": "Alex Wong", "email": "alex.wong@example.com" }
    ],
    "metrics": {
      "engagement": 92,
      "community": 91,
      "impact": 95,
      "motivation": 94
    }
  },
  {
    "id": 11,
    "name": "Gardening Club",
    "description": "Promoting sustainable living and a green campus through hands-on gardening projects and workshops.",
    "group": "Service",
    "tags": ["gardening", "sustainability", "environment", "outreach"],
    "heads": [
      { "name": "Emily Stone", "email": "emily.stone@example.com" }
    ],
    "metrics": {
      "engagement": 78,
      "community": 85,
      "impact": 89,
      "motivation": 86
    }
  },
  {
    "id": 12,
    "name": "Hiking Club",
    "description": "Organizing weekend hikes and outdoor trips to explore local trails and natural landscapes.",
    "group": "Recreation",
    "tags": ["hiking", "outdoors", "fitness", "nature"],
    "heads": [
      { "name": "Liam Parker", "email": "liam.parker@example.com" },
      { "name": "Olivia Miller", "email": "olivia.miller@example.com" }
    ],
    "metrics": {
      "engagement": 85,
      "community": 88,
      "impact": 70,
      "motivation": 92
    }
  },
  {
    "id": 13,
    "name": "Film Society",
    "description": "For lovers of cinema to watch, discuss, and create films. We host screenings and film production workshops.",
    "group": "Arts",
    "tags": ["film", "cinema", "movies", "production", "art"],
    "heads": [
      { "name": "Noah Davis", "email": "noah.davis@example.com" }
    ],
    "metrics": {
      "engagement": 80,
      "community": 82,
      "impact": 78,
      "motivation": 85
    }
  },
  {
    "id": 14,
    "name": "Robotics Club",
    "description": "Designing, building, and programming robots for competitions and educational outreach.",
    "group": "Academic",
    "tags": ["robotics", "engineering", "technology", "competition"],
    "heads": [
      { "name": "Chris Evans", "email": "chris.evans@example.com" },
      { "name": "Michelle Lee", "email": "michelle.lee@example.com" }
    ],
    "metrics": {
      "engagement": 90,
      "community": 89,
      "impact": 91,
      "motivation": 96
    }
  },
  {
    "id": 15,
    "name": "Medical Students Association",
    "description": "Providing resources and networking opportunities for pre-med students.",
    "group": "Academic",
    "tags": ["medicine", "pre-med", "healthcare", "networking"],
    "heads": [
      { "name": "Jessica King", "email": "jessica.king@example.com" }
    ],
    "metrics": {
      "engagement": 89,
      "community": 83,
      "impact": 92,
      "motivation": 90
    }
  },
  {
    "id": 16,
    "name": "Yoga Club",
    "description": "Offering yoga and meditation classes to promote mental and physical well-being on campus.",
    "group": "Recreation",
    "tags": ["yoga", "wellness", "meditation", "fitness"],
    "heads": [
      { "name": "Sofia Gomez", "email": "sofia.gomez@example.com" }
    ],
    "metrics": {
      "engagement": 75,
      "community": 79,
      "impact": 65,
      "motivation": 81
    }
  },
  {
    "id": 17,
    "name": "Creative Writing Club",
    "description": "A space for writers of all genres to share their work, give and receive feedback, and improve their craft.",
    "group": "Arts",
    "tags": ["writing", "creative writing", "literature", "poetry"],
    "heads": [
      { "name": "Daniel Kim", "email": "daniel.kim@example.com" }
    ],
    "metrics": {
      "engagement": 70,
      "community": 80,
      "impact": 68,
      "motivation": 83
    }
  },
  {
    "id": 18,
    "name": "Anime Club",
    "description": "A group for fans of Japanese animation to watch series, discuss new releases, and build a community.",
    "group": "Recreation",
    "tags": ["anime", "japanese culture", "movies", "fandom"],
    "heads": [
      { "name": "Chloe Evans", "email": "chloe.evans@example.com" },
      { "name": "Leo Martinez", "email": "leo.martinez@example.com" }
    ],
    "metrics": {
      "engagement": 86,
      "community": 90,
      "impact": 60,
      "motivation": 91
    }
  },
  {
    "id": 19,
    "name": "Music Production Club",
    "description": "Teaching students the basics of music production, sound engineering, and digital audio workstations.",
    "group": "Arts",
    "tags": ["music", "production", "audio", "sound"],
    "heads": [
      { "name": "Ryan Scott", "email": "ryan.scott@example.com" }
    ],
    "metrics": {
      "engagement": 81,
      "community": 85,
      "impact": 80,
      "motivation": 92
    }
  },
  {
    "id": 20,
    "name": "Entrepreneurship Club",
    "description": "Fostering an entrepreneurial spirit by helping students develop business plans and network with professionals.",
    "group": "Academic",
    "tags": ["entrepreneurship", "business", "startups", "networking"],
    "heads": [
      { "name": "Taylor Swift", "email": "taylor.swift@example.com" }
    ],
    "metrics": {
      "engagement": 88,
      "community": 90,
      "impact": 95,
      "motivation": 96
    }
  },
  {
    "id": 21,
    "name": "Community Outreach Club",
    "description": "Connecting with local charities to organize volunteer events and support local communities.",
    "group": "Service",
    "tags": ["community", "outreach", "volunteering", "charity"],
    "heads": [
      { "name": "Harry Styles", "email": "harry.styles@example.com" }
    ],
    "metrics": {
      "engagement": 90,
      "community": 96,
      "impact": 99,
      "motivation": 95
    }
  },
  {
    "id": 22,
    "name": "Board Game Club",
    "description": "A casual space for students to relax, play a wide variety of board games, and meet new people.",
    "group": "Recreation",
    "tags": ["board games", "gaming", "casual", "social"],
    "heads": [
      { "name": "Selena Gomez", "email": "selena.gomez@example.com" },
      { "name": "Justin Bieber", "email": "justin.bieber@example.com" }
    ],
    "metrics": {
      "engagement": 83,
      "community": 93,
      "impact": 68,
      "motivation": 88
    }
  },
  {
    "id": 23,
    "name": "Culinary Arts Club",
    "description": "Learning new cooking techniques and sharing a love for food through cooking classes and tasting events.",
    "group": "Arts",
    "tags": ["cooking", "food", "culinary", "baking"],
    "heads": [
      { "name": "Gordon Ramsay", "email": "gordon.ramsay@example.com" }
    ],
    "metrics": {
      "engagement": 87,
      "community": 91,
      "impact": 82,
      "motivation": 90
    }
  },
  {
    "id": 24,
    "name": "Cycling Club",
    "description": "Organizing group bike rides and promoting cycling as a fun and sustainable mode of transportation.",
    "group": "Sports",
    "tags": ["cycling", "biking", "fitness", "outdoors"],
    "heads": [
      { "name": "LeBron James", "email": "lebron.james@example.com" }
    ],
    "metrics": {
      "engagement": 89,
      "community": 87,
      "impact": 80,
      "motivation": 94
    }
  },
  {
    "id": 25,
    "name": "Model UN Club",
    "description": "Simulating United Nations sessions to hone public speaking, research, and diplomatic skills.",
    "group": "Academic",
    "tags": ["MUN", "politics", "debate", "diplomacy"],
    "heads": [
      { "name": "Angela Merkel", "email": "angela.merkel@example.com" },
      { "name": "Joe Biden", "email": "joe.biden@example.com" }
    ],
    "metrics": {
      "engagement": 94,
      "community": 90,
      "impact": 92,
      "motivation": 98
    }
  },
  {
    "id": 26,
    "name": "Animal Shelter Volunteers",
    "description": "Volunteering at local animal shelters to help care for pets and find them forever homes.",
    "group": "Service",
    "tags": ["animals", "volunteering", "charity", "pets"],
    "heads": [
      { "name": "Dr. Doolittle", "email": "dr.doolittle@example.com" }
    ],
    "metrics": {
      "engagement": 85,
      "community": 92,
      "impact": 96,
      "motivation": 94
    }
  },
  {
    "id": 27,
    "name": "Esports Club",
    "description": "Bringing together gamers to form teams and compete in various video game tournaments.",
    "group": "Recreation",
    "tags": ["esports", "gaming", "video games", "competition"],
    "heads": [
      { "name": "Shroud", "email": "shroud@example.com" }
    ],
    "metrics": {
      "engagement": 95,
      "community": 90,
      "impact": 80,
      "motivation": 97
    }
  },
  {
    "id": 28,
    "name": "Jazz Ensemble",
    "description": "A musical group dedicated to performing and promoting jazz music on campus and at local events.",
    "group": "Arts",
    "tags": ["jazz", "music", "performance", "ensemble"],
    "heads": [
      { "name": "Miles Davis", "email": "miles.davis@example.com" },
      { "name": "Ella Fitzgerald", "email": "ella.fitzgerald@example.com" }
    ],
    "metrics": {
      "engagement": 88,
      "community": 85,
      "impact": 89,
      "motivation": 92
    }
  }
];

module.exports = { clubs };