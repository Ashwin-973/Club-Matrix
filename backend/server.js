const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { clubs } = require('./data');

const app = express();
const PORT = 1972;

app.use(cors());
app.use(express.json());

// const transporter = nodemailer.createTransporter({
//   host: 'smtp.mailtrap.io',
//   port: 2525,
//   auth: {
//     user: 'your-mailtrap-user',
//     pass: 'your-mailtrap-pass'
//   }
// });

const calculateScore = (metrics) => {
  const weights = {
    engagement: 0.3,
    community: 0.25,
    impact: 0.25,
    motivation: 0.2
  };
  
  return (
    metrics.engagement * weights.engagement +
    metrics.community * weights.community +
    metrics.impact * weights.impact +
    metrics.motivation * weights.motivation
  );
};

app.get('/api/clubs', (req, res) => {
  res.json(clubs);
});

app.post('/api/clubs', (req, res) => {
  const { name, description, tags, group } = req.body;
  
  const newClub = {
    id: clubs.length + 1,
    name,
    description,
    group,
    tags: tags.split(',').map(tag => tag.trim()),
    heads: [],
    metrics: {
      engagement: Math.floor(Math.random() * 40) + 60, // 60-100
      community: Math.floor(Math.random() * 40) + 60,
      impact: Math.floor(Math.random() * 40) + 60,
      motivation: Math.floor(Math.random() * 40) + 60
    }
  };
  
  clubs.push(newClub);
  res.status(201).json(newClub);
});

app.get('/api/groups', (req, res) => {
  const grouped = clubs.reduce((acc, club) => {
    if (!acc[club.group]) {
      acc[club.group] = [];
    }
    acc[club.group].push(club);
    return acc;
  }, {});
  
  res.json(grouped);
});

app.get('/api/ranking', (req, res) => {
  const rankedClubs = clubs
    .map(club => ({
      ...club,
      score: calculateScore(club.metrics)
    }))
    .sort((a, b) => b.score - a.score);
    
  res.json(rankedClubs);
});

app.post('/api/send-survey', async (req, res) => {
  const { email, clubName, surveyData } = req.body;
  
  const mailOptions = {
    from: 'clubmatrix@example.com',
    to: email,
    subject: `Club Survey for ${clubName}`,
    text: `
Dear Club Head,

We would like to gather feedback about ${clubName}. Please take a moment to respond to our survey:

Survey Questions:
${surveyData.questions || 'General feedback questions about club performance and engagement.'}

Survey Link: ${surveyData.link || 'https://example.com/survey'}

Thank you for your time!

Best regards,
ClubMatrix Team
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Survey sent successfully' });
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({ success: false, message: 'Failed to send survey' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});