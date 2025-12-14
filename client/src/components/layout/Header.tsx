import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Ticket Manager
              </h1>
            </Link>
          </div>
          
          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Tickets
            </Link>
            <Link 
              to="/tags" 
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Tags
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
