import React from 'react'
import MapView from '../components/MapView.jsx'

export default function MapPage() {
  return (
    <main className="page">
      <div className="page-container">
        <div className="map-card">
          <MapView />
        </div>
      </div>
    </main>
  )
}
