import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import SearchBar from './SearchBar.jsx'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const isPostPage = location.pathname.startsWith('/post/')
  const placeholder = isPostPage ? 'Search post...' : 'Search buildings...'

  return (
    <header className="topbar">
      <div
        className="topbar-inner flex items-center justify-between"
        style={{ alignItems: 'center' }}
      >
        <div
          className="logo flex items-center cursor-pointer"
          onClick={() => navigate('/')}
          style={{
            gap: '10px',
            display: 'flex',
            alignItems: 'center', // ✅ 垂直居中对齐搜索框
          }}
        >
          <img
            src="/logo.png"
            alt="UMass Atlas Logo"
            style={{
              height: '48px', // ✅ 稍微减小一点，和搜索框匹配
              objectFit: 'contain',
            }}
          />
          <span
            style={{
              fontSize: '26px',
              fontWeight: 800,
              color: '#2b2b2b',
              letterSpacing: '0.6px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            UMass Atlas
          </span>
        </div>

        <div className="topbar-middle search-container">
          <SearchBar placeholder={placeholder} />
        </div>

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
