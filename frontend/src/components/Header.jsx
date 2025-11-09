// src/components/Header.jsx
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import SearchBar from './SearchBar.jsx'
import { useAuth } from "../context/AuthContext.jsx";

export default function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate()
  const location = useLocation()
  // Use a different placeholder on post detail pages
  const isPostPage = location.pathname.startsWith('/post/')
  const placeholder = isPostPage ? 'Search post...' : 'Search buildings...'

  return (
    <header className="topbar">
      <div className="topbar-inner">
        {/* Left: Logo */}
        <div className="logo" onClick={() => navigate('/')}>
          <span className="logo-mark">GeoCampus</span>
        </div>

        {/* Middle: Search (positioned by CSS .search-container) */}
        <div className="topbar-middle search-container">
          <SearchBar placeholder={placeholder} />
        </div>

        {/* Right: Avatar */}
        <button
          className="avatar"
          aria-label="Open profile"
          onClick={() => navigate('/profile')}
          title="Profile"
        >
          <span>{user?.avatarLetter??"U"}</span>
        </button>
      </div>
    </header>
  )
}
