import { useState, useEffect } from 'react'
import { api } from '../utils/api'

const ClubList = ({ clubs, onClubClick }) => {
  const [groupedClubs, setGroupedClubs] = useState({})

  useEffect(() => {
    api.getGroups().then(setGroupedClubs).catch(console.error)
  }, [clubs])

  return (
    <div className="space-y-6">
      {Object.entries(groupedClubs).map(([group, clubList]) => (
        <div key={group} className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-600">{group}</h2>
          <div className="grid gap-4">
            {clubList.map(club => (
              <div 
                key={club.id}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onClubClick(club)}
              >
                <h3 className="font-semibold text-lg">{club.name}</h3>
                <p className="text-gray-600 mt-2">{club.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {club.tags.map(tag => (
                    <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ClubList