import React, { useEffect, useRef, useState } from 'react'

function fetchPostsByBuildingId(id) {
  const N = 12
  return Array.from({ length: N }).map((_, i) => ({
    id: `${id}-${i+1}`,
    title: `Post ${i+1} about building ${id}`,
  }))
}

export default function BuildingHoverCard() {
  const [visible, setVisible] = useState(false)
  const [locked, setLocked] = useState(false)
  const [name, setName] = useState('')
  const [bid, setBid] = useState('')
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [posts, setPosts] = useState([])
  const scrollRef = useRef(null)
  const timerRef = useRef(null)

  // auto-scroll when visible & not locked
  useEffect(() => {
    clearInterval(timerRef.current)
    if (visible && !locked && scrollRef.current) {
      timerRef.current = setInterval(() => {
        const el = scrollRef.current
        if (!el) return
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) el.scrollTop = 0
        else el.scrollTop += 1
      }, 40)
    }
    return () => clearInterval(timerRef.current)
  }, [visible, locked])

  useEffect(() => {
    const onHover = (e) => {
      if (locked) return
      const { id, name, point } = e.detail || {}
      setBid(String(id ?? ''))
      setName(String(name ?? ''))
      setPosts(fetchPostsByBuildingId(id))
      setVisible(true)
      const pad = 12, w = 300, h = 260
      const x = Math.min(window.innerWidth - w - pad, Math.max(pad, point.x + 16))
      const y = Math.min(window.innerHeight - h - pad, Math.max(pad, point.y + 16))
      setPos({ x, y })
    }
    const onLeave = () => { if (!locked) setVisible(false) }
    const onLock = (e) => {
      const { id, name, point } = e.detail || {}
      setBid(String(id ?? ''))
      setName(String(name ?? ''))
      setPosts(fetchPostsByBuildingId(id))
      setLocked(true); setVisible(true)
      const pad = 12, w = 300, h = 260
      const x = Math.min(window.innerWidth - w - pad, Math.max(pad, point.x + 16))
      const y = Math.min(window.innerHeight - h - pad, Math.max(pad, point.y + 16))
      setPos({ x, y })
    }

    window.addEventListener('building-hover', onHover)
    window.addEventListener('building-leave', onLeave)
    window.addEventListener('building-lock', onLock)
    return () => {
      window.removeEventListener('building-hover', onHover)
      window.removeEventListener('building-leave', onLeave)
      window.removeEventListener('building-lock', onLock)
    }
  }, [locked])

  if (!visible) return null

  return (
    <div className="hover-card" style={{ left: pos.x, top: pos.y }}>
      <div className="hover-card-header">
        <div className="hover-title">{name || 'Building'}</div>
        <div className="hover-badge">{posts.length > 99 ? '99+' : posts.length}</div>
      </div>
      <div className={`hover-card-body ${locked ? 'is-locked' : ''}`} ref={scrollRef}>
        {posts.map(p => <div className="hover-post" key={p.id}>{p.title}</div>)}
      </div>
      <div className="hover-card-footer">
        {!locked ? <span className="muted">Double-click building to pin</span> :
          <button className="btn-ghost" onClick={() => { setLocked(false); setVisible(false) }}>exist ×</button>}
      </div>
    </div>
  )
}
