import React from 'react'

export default function ProfilePage() {
  return (
    <main className="page">
      <div className="page-container">
        <div className="panel">
          <h1 className="panel-title">User Profile</h1>
          <div className="panel-body">
            <div className="profile-row">
              <div className="profile-avatar">U</div>
              <div>
                <div className="profile-name">Username</div>
                <div className="profile-email">user@example.com</div>
              </div>
            </div>
            <p className="muted">This is a placeholder. Connect real data later.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
