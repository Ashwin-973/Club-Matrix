const API_BASE = import.meta.env.VITE_API_BASE_URL

export const api = {
  getClubs: () => fetch(`${API_BASE}/api/clubs`).then(r => r.json()),
  
  addClub: (club) => fetch(`${API_BASE}/api/clubs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(club)
  }).then(r => r.json()),
  
  getGroups: () => fetch(`${API_BASE}/api/groups`).then(r => r.json()),
  
  getRanking: () => fetch(`${API_BASE}/api/ranking`).then(r => r.json()),
  
  sendSurvey: (data) => fetch(`${API_BASE}/api/send-survey`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json())
};