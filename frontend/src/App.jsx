import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import MapPage from './pages/MapPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import PostDetailPage from './pages/PostDetailPage.jsx' 

export default function App() {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/post/:postId" element={<PostDetailPage />} /> {/* NEW */}
      </Routes>
    </div>
  )
}