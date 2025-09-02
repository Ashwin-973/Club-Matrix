import { useState } from 'react'
import SurveyForm from './SurveyForm'

const ClubDetails = ({ club, onBack }) => {
  const [showSurveyForm, setShowSurveyForm] = useState(false)
  const [selectedHead, setSelectedHead] = useState(null)

  const handleSendSurvey = (head) => {
    setSelectedHead(head)
    setShowSurveyForm(true)
  }

  const closeSurveyForm = () => {
    setShowSurveyForm(false)
    setSelectedHead(null)
  }

  if (!club) return null

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <button 
        onClick={onBack}
        className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
      >
        ← Back to Clubs
      </button>

      <h1 className="text-2xl font-bold mb-4">{club.name}</h1>
      <p className="text-gray-700 mb-6">{club.description}</p>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Category:</h3>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded">{club.group}</span>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Tags:</h3>
        <div className="flex flex-wrap gap-2">
          {club.tags.map(tag => (
            <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Performance Metrics:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Engagement</span>
              <span className="text-lg font-bold text-blue-600">{club.metrics.engagement}%</span>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Community</span>
              <span className="text-lg font-bold text-green-600">{club.metrics.community}%</span>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Impact</span>
              <span className="text-lg font-bold text-purple-600">{club.metrics.impact}%</span>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Motivation</span>
              <span className="text-lg font-bold text-orange-600">{club.metrics.motivation}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Club Heads:</h3>
        {club.heads && club.heads.length > 0 ? (
          <div className="space-y-3">
            {club.heads.map(head => (
              <div key={head.email} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <div>
                  <div className="font-medium">{head.name}</div>
                  <div className="text-gray-600">{head.email}</div>
                </div>
                <button
                  onClick={() => handleSendSurvey(head)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Send Survey
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No club heads assigned yet.</p>
        )}
      </div>

      {showSurveyForm && (
        <SurveyForm 
          club={club}
          head={selectedHead}
          onClose={closeSurveyForm}
        />
      )}
    </div>
  )
}

export default ClubDetails