import React, { useEffect, useMemo, useState } from 'react'

export default function SearchBar() {
  const [allNames, setAllNames] = useState([])
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let isMounted = true
    fetch('/UmassBuildings.geojson')
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return
        const names = (data?.features || [])
          .map(f => f?.properties?.name)
          .filter(Boolean)
        // unique & sorted
        const uniq = Array.from(new Set(names)).sort((a, b) =>
          a.localeCompare(b)
        )
        setAllNames(uniq)
      })
      .catch(() => setAllNames([]))
    return () => { isMounted = false }
  }, [])

  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return []
    return allNames
      .filter(n => n.toLowerCase().includes(s))
      .slice(0, 8)
  }, [q, allNames])

  return (
    <div className="search">
      <input
        className="search-input"
        type="text"
        placeholder="Search buildings..."
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true) }}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onFocus={() => setOpen(true)}
      />
      {open && results.length > 0 && (
        <div className="search-panel">
          {results.map(name => (
            <button
              key={name}
              className="search-item"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setQ(name)
                setOpen(false)
                // TODO: later we can dispatch a CustomEvent to pan map.
                // window.dispatchEvent(new CustomEvent('goto-building', { detail: { name } }))
              }}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
