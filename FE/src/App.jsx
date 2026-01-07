import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EventTypes from './pages/EventTypes';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <nav className="border-b bg-card">
          <div className="container mx-auto px-8 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-2xl font-bold text-foreground">
                Scalar Scheduler
              </Link>
              <div className="flex gap-6">
                <Link
                  to="/event-types"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Event Types
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <div className="container mx-auto p-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Welcome to Scalar Scheduler
              </h1>
              <p className="text-muted-foreground mb-8">
                A Calendly-like scheduling application
              </p>
              <Link
                to="/event-types"
                className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Manage Event Types
              </Link>
            </div>
          } />
          <Route path="/event-types" element={<EventTypes />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
