import { useState } from 'react'
import { api } from '../utils/api'

const SurveyForm = ({ club, head, onClose }) => {
  const [surveyData, setSurveyData] = useState({
    questions: '',
    link: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSurveyData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await api.sendSurvey({
        email: head.email,
        clubName: club.name,
        surveyData
      })

      if (response.success) {
        alert('Survey sent successfully!')
        onClose()
      } else {
        alert('Failed to send survey: ' + response.message)
      }
    } catch (error) {
      console.error('Error sending survey:', error)
      alert('Failed to send survey. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Send Survey</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded">
          <div className="text-sm text-gray-600">Sending to:</div>
          <div className="font-medium">{head.name}</div>
          <div className="text-sm text-gray-600">{head.email}</div>
          <div className="text-sm text-gray-600">Club: {club.name}</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="questions" className="block font-medium mb-2">
              Survey Questions/Content
            </label>
            <textarea
              id="questions"
              name="questions"
              value={surveyData.questions}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter survey questions or description (optional)"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-600 mt-1">
              Leave empty to send default feedback questions
            </p>
          </div>

          <div>
            <label htmlFor="link" className="block font-medium mb-2">
              Survey Link (Optional)
            </label>
            <input
              id="link"
              name="link"
              type="url"
              value={surveyData.link}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/survey"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Survey'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SurveyForm