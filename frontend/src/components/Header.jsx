import React from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar.jsx'

export default function Header() {
  const navigate = useNavigate()

  return (
    <header className="topbar">
      <div className="topbar-inner">
        {/* Left: Logo */}
        <div className="logo" onClick={() => navigate('/')}>
          <span className="logo-mark">GeoCampus</span>
        </div>

        {/* Middle: Search */}
        <div className="topbar-middle">
          <SearchBar />
        </div>

        {/* Right: Avatar */}
        <button
          className="avatar"
          aria-label="Open profile"
          onClick={() => navigate('/profile')}
          title="Profile"
        >
          <span>U</span>
        </button>
      </div>
    </header>
  )
}
