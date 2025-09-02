import { useState } from 'react'
import { api } from '../utils/api'

const ClubForm = ({ onClubAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
    group: 'Academic'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await api.addClub(formData)
      setFormData({ name: '', description: '', tags: '', group: 'Academic' })
      onClubAdded()
      alert('Club added successfully!')
    } catch (error) {
      console.error('Error adding club:', error)
      alert('Failed to add club. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Club</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block font-medium mb-2">
            Club Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter club name"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="description" className="block font-medium mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your club's mission and activities"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="tags" className="block font-medium mb-2">
            Tags *
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. programming, technology, networking"
            required
            disabled={isSubmitting}
          />
          <p className="text-sm text-gray-600 mt-1">
            Enter tags separated by commas
          </p>
        </div>

        <div>
          <label htmlFor="group" className="block font-medium mb-2">
            Category *
          </label>
          <select
            id="group"
            name="group"
            value={formData.group}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isSubmitting}
          >
            <option value="Academic">Academic</option>
            <option value="Arts">Arts</option>
            <option value="Sports">Sports</option>
            <option value="Service">Service</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding Club...' : 'Add Club'}
          </button>
          
          <button
            type="button"
            onClick={() => setFormData({ name: '', description: '', tags: '', group: 'Academic' })}
            disabled={isSubmitting}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  )
}

export default ClubForm