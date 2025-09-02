import { useState, useEffect } from 'react'
import { api } from '../utils/api'

const RankingList = () => {
  const [rankedClubs, setRankedClubs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const data = await api.getRanking()
        setRankedClubs(data)
      } catch (error) {
        console.error('Error fetching rankings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRanking()
  }, [])

  const getRankingBadgeColor = (rank) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    if (rank === 2) return 'bg-gray-100 text-gray-800 border-gray-200'
    if (rank === 3) return 'bg-orange-100 text-orange-800 border-orange-200'
    return 'bg-blue-100 text-blue-800 border-blue-200'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Club Rankings</h1>
        <div className="text-center py-8">
          <div className="text-gray-600">Loading rankings...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">Club Rankings</h1>
      
      <div className="mb-4 text-sm text-gray-600">
        Rankings are calculated based on weighted metrics: Engagement (30%), Community (25%), Impact (25%), Motivation (20%)
      </div>

      <div className="space-y-4">
        {rankedClubs.map((club, index) => {
          const rank = index + 1
          return (
            <div key={club.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`px-3 py-1 rounded-full border text-lg font-bold ${getRankingBadgeColor(rank)}`}>
                    #{rank}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{club.name}</h3>
                    <p className="text-gray-600">{club.group} • {club.description.substring(0, 60)}...</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{club.score.toFixed(1)}</div>
                  <div className="text-gray-600 text-sm">Overall Score</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-medium text-gray-700">Engagement</div>
                  <div className="text-lg font-bold text-blue-600">{club.metrics.engagement}%</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-700">Community</div>
                  <div className="text-lg font-bold text-green-600">{club.metrics.community}%</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-700">Impact</div>
                  <div className="text-lg font-bold text-purple-600">{club.metrics.impact}%</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-700">Motivation</div>
                  <div className="text-lg font-bold text-orange-600">{club.metrics.motivation}%</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {rankedClubs.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-600">No clubs found to rank.</div>
        </div>
      )}
    </div>
  )
}

export default RankingList