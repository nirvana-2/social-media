import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';

// Common + Layout
import MainLayout from './components/Layout/MainLayout';

// Auth Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Pages
import Feed from './components/Feed/Feed';
import ChatPage from './components/Chat/ChatPage';
import ProfilePage from './components/Profile/ProfilePage';

function App() {
  useEffect(() => {
    // Determine and set theme natively initially to avoid flash
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes inside MainLayout */}
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Feed />} />
          <Route path="feed" element={<Feed />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="profile/:userId" element={<ProfilePage />} />
        </Route>
        
        <Route path="*" element={<div className="flex justify-center items-center h-full">404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
