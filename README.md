# ClubMatrix - Complete Club Management System

A full-stack web application for managing and ranking university clubs with performance metrics.

## 🚀 Features

- **Club Dashboard**: View and filter all clubs
- **Club Details**: Detailed view with metrics and club head information
- **Add New Clubs**: Form-based club registration
- **Performance Rankings**: Automated club ranking system
- **Email Integration**: Contact club heads directly
- **Responsive UI**: Modern design with Tailwind CSS

## 🏗️ Project Structure

```
clubmatrix/
├── backend/
│   ├── server.js           # Main Express server
│   ├── routes/
│   │   └── api.js          # API routes
│   ├── data/
│   │   ├── clubs.json      # Club data storage
│   │   └── metrics.json    # Performance metrics data
│   └── package.json        # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── components/     # React components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AddClub.jsx
│   │   │   ├── ClubDetail.jsx
│   │   │   ├── Rankings.jsx
│   │   │   └── EmailModal.jsx
│   │   └── main.jsx        # React entry point
│   ├── index.html          # HTML template
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.js      # Vite configuration
│   └── tailwind.config.js  # Tailwind configuration
└── README.md              # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm start
```
Server runs on http://localhost:1972

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:5173

## 📊 API Endpoints

- `GET /api/clubs` - Get all clubs
- `GET /api/clubs/:id` - Get specific club details
- `GET /api/groups` - Get all unique groups
- `GET /api/metrics/:id` - Get club metrics
- `GET /api/rankings` - Get ranked clubs list
- `POST /api/clubs/add` - Add new club
- `POST /api/email` - Send email to club heads

## 🎨 Tech Stack

**Frontend:**
- React 18 with Vite
- React Router for routing
- Tailwind CSS for styling
- Lucide React for icons

**Backend:**
- Express.js
- Nodemailer for email functionality
- JSON file-based data storage
- CORS enabled for cross-origin requests

## 📝 Usage

1. **View Clubs**: Navigate to the dashboard to see all clubs with filtering options
2. **Add Club**: Use the "Add Club" form to register new clubs
3. **Club Details**: Click on any club to view detailed information and metrics
4. **Rankings**: View the performance-based ranking of all clubs
5. **Contact**: Click on club head emails to send messages

## ⚙️ Configuration

### Email Setup
Update the email configuration in `backend/routes/api.js`:
```javascript
// Replace with your actual email service credentials
const transporter = nodemailer.createTransporter({
  service: 'your-email-service',
  auth: {
    user: 'your-email@example.com',
    pass: 'your-password'
  }
});
```

## 🔧 Development

The application uses hot-reloading for development:
- Backend: Changes require server restart
- Frontend: Automatic hot-reload with Vite

## 📈 Metrics & Ranking

The ranking system uses a weighted algorithm based on:
- **Engagement** (30%): User interaction metrics
- **Community** (25%): Social media presence
- **Impact** (25%): Real-world influence
- **Motivation** (20%): Internal drive metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for educational purposes.
