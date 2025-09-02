import { useState, useEffect } from 'react'
import ClubList from './components/ClubList'
import ClubDetails from './components/ClubDetails'
import ClubForm from './components/ClubForm'
import RankingList from './components/RankingList'
import { api } from './utils/api'

function App() {
  const [currentView, setCurrentView] = useState('clubs')
  const [selectedClub, setSelectedClub] = useState(null)
  const [clubs, setClubs] = useState([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    api.getClubs().then(setClubs).catch(console.error)
  }, [refreshTrigger])

  const handleClubAdded = () => {
    setRefreshTrigger(prev => prev + 1)
    setCurrentView('clubs')
  }

  const handleNavClick = (view) => {
    setCurrentView(view)
    setSelectedClub(null)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-10 h-16">
            <button
              onClick={() => handleNavClick('clubs')}
              className={`px-3 py-2 ${currentView === 'clubs' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Clubs
            </button>
            <button
              onClick={() => handleNavClick('ranking')}
              className={`px-3 py-2 ${currentView === 'ranking' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Ranking
            </button>
            <button
              onClick={() => handleNavClick('add')}
              className={`px-3 py-2 ${currentView === 'add' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            >
              Add Club
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ClubMatrix</h1>
          <p className="text-gray-600 mt-2">Manage and rank your clubs efficiently</p>
        </div>

        {currentView === 'clubs' && !selectedClub && (
          <ClubList clubs={clubs} onClubClick={setSelectedClub} />
        )}

        {currentView === 'clubs' && selectedClub && (
          <ClubDetails club={selectedClub} onBack={() => setSelectedClub(null)} />
        )}

        {currentView === 'ranking' && <RankingList />}

        {currentView === 'add' && <ClubForm onClubAdded={handleClubAdded} />}
      </main>
    </div>
  )
}

export default App