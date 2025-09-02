import { useState, useEffect } from 'react';

function App() {

  const [groupedClubs, setGroupedClubs] = useState({});
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedClub, setSelectedClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE = 'http://localhost:1972/api';

  useEffect(() => {
    fetchGroupedClubs();
  }, []);

  const fetchGroupedClubs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/groups`);
      if (!response.ok) {
        throw new Error('Failed to fetch clubs data');
      }
      const data = await response.json();
      setGroupedClubs(data);
      
      // Set first group as default selection
      const firstGroup = Object.keys(data)[0];
      if (firstGroup) {
        setSelectedGroup(firstGroup);
      }
      
      setError('');
    } catch (err) {
      setError('Failed to load clubs data. Make sure the server is running on port 3001.');
    } finally {
      setLoading(false);
    }
  };

  // Handle group selection
  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setSelectedClub(null); // Close any open club details
  };

  // Handle club selection for details view
  const handleClubSelect = (club) => {
    setSelectedClub(club);
  };

  // Close club details modal
  const closeClubDetails = () => {
    setSelectedClub(null);
  };

  // Get available groups
  const availableGroups = Object.keys(groupedClubs);

  // Get clubs for selected group
  const selectedClubs = selectedGroup ? groupedClubs[selectedGroup] || [] : [];

  return(
    <div className="min-h-screen bg-gray-50">
      {/* header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-gray-900">ClubMatrix</h1>
          <p className="text-gray-600 mt-2">College Club Activity Aggregator & Analyzer</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Club Categories</h2>
              <nav className="space-y-2">
                {availableGroups.map((group) => (
                  <button
                    key={group}
                    onClick={() => handleGroupSelect(group)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedGroup === group
                        ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{group}</div>
                    <div className="text-sm text-gray-500">
                      {groupedClubs[group]?.length || 0} clubs
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* main content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              {/* selected group */}
              <div className="px-6 py-4 border-b">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {selectedGroup} Clubs
                </h2>
                <p className="text-gray-600 mt-1">
                  {selectedClubs.length} clubs in this category
                </p>
              </div>

              {/* Clubs List */}
              <div className="p-6">
                {selectedClubs.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>No clubs found in this category.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {selectedClubs.map((club) => (
                      <div
                        key={club.id}
                        onClick={() => handleClubSelect(club)}
                        className="p-4 border rounded-lg hover:shadow-md cursor-pointer transition-all duration-200 hover:border-blue-300"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                              {club.name}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {club.description}
                            </p>
                          </div>
                          <div className="ml-4 text-blue-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Club Details Modal */}
      {selectedClub && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedClub.name}
              </h2>
              <button
                onClick={closeClubDetails}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">About</h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedClub.description}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Category</h3>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {selectedClub.group}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedClub.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 rounded-b-lg">
              <button
                onClick={closeClubDetails}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
