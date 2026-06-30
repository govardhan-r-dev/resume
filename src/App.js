import React, { useState, useEffect } from 'react';
import './App.css';

// Asset URLs from Figma
const resumeIcon = "https://www.figma.com/api/mcp/asset/6e6d6101-d1b4-4196-8449-4b06eaa0d636";

// Dock app icons using system emoji / SVG representations
const dockApps = [
  { name: 'Finder', emoji: '🔵', color: '#1d6ef5' },
  { name: 'Launchpad', emoji: '🚀', color: '#f4f4f4' },
  { name: 'Safari', emoji: '🧭', color: '#006aff' },
  { name: 'Messages', emoji: '💬', color: '#34c759' },
  { name: 'Mail', emoji: '✉️', color: '#147efb' },
  { name: 'Maps', emoji: '🗺️', color: '#34c759' },
  { name: 'Photos', emoji: '🌅', color: '#ff9500' },
  { name: 'FaceTime', emoji: '📹', color: '#34c759' },
  { name: 'Calendar', emoji: '📅', color: '#ff3b30' },
  { name: 'Contacts', emoji: '👤', color: '#ff9500' },
  { name: 'Reminders', emoji: '☑️', color: '#ff9500' },
  { name: 'Notes', emoji: '📝', color: '#ffcc00' },
  { name: 'Freeform', emoji: '🖊️', color: '#147efb' },
  { name: 'Apple TV', emoji: '📺', color: '#1c1c1e' },
  { name: 'Music', emoji: '🎵', color: '#fc3c44' },
  { name: 'News', emoji: '📰', color: '#ff3b30' },
  { name: 'App Store', emoji: '🛍️', color: '#147efb' },
  { name: 'Folder', emoji: '📁', color: '#147efb' },
  { name: 'Trash', emoji: '🗑️', color: '#8e8e93' },
];

const menuItems = ['Finder', 'File', 'Edit', 'View', 'Go', 'Window', 'Help'];

function useTime() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  return time;
}

function MenuBar() {
  const time = useTime();
  const formatted = time.toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true
  });

  return (
    <div className="menubar">
      <div className="menubar-left">
        <span className="apple-logo">&#63743;</span>
        {menuItems.map((item, i) => (
          <span key={i} className={`menu-item ${i === 0 ? 'menu-item-bold' : ''}`}>{item}</span>
        ))}
      </div>
      <div className="menubar-right">
        <span className="menu-icon">📶</span>
        <span className="menu-icon">🔍</span>
        <span className="menu-icon">👤</span>
        <span className="menu-time">{formatted}</span>
      </div>
    </div>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  return (
    <div className={`search-wrapper ${focused ? 'focused' : ''}`}>
      <span className="search-icon">🔍</span>
      <input
        className="search-input"
        type="text"
        placeholder="Search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

function DesktopIcon({ name, icon, onOpen }) {
  const [selected, setSelected] = useState(false);

  return (
    <div
      className={`desktop-icon ${selected ? 'selected' : ''}`}
      onClick={() => setSelected(true)}
      onDoubleClick={() => { setSelected(false); if (onOpen) onOpen(); }}
    >
      <div className="desktop-icon-img">
        <img src={icon} alt={name} />
      </div>
      <span className={`desktop-icon-label ${selected ? 'label-selected' : ''}`}>{name}</span>
    </div>
  );
}

function Dock() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="dock-container">
      <div className="dock">
        {dockApps.map((app, i) => {
          const distance = hoveredIndex !== null ? Math.abs(i - hoveredIndex) : 99;
          const scale = distance === 0 ? 1.5 : distance === 1 ? 1.25 : distance === 2 ? 1.1 : 1;
          return (
            <div
              key={i}
              className="dock-item"
              style={{ transform: `scale(${scale})`, transformOrigin: 'bottom center' }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              title={app.name}
            >
              <div className="dock-icon" style={{ background: app.color }}>
                <span>{app.emoji}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PageOne({ onOpenResume }) {
  return (
    <div className="desktop">
      <div className="wallpaper" />
      <MenuBar />
      <div className="search-container">
        <SearchBar />
      </div>
      <div className="desktop-icons-area">
        <DesktopIcon
          name="govardhans resume"
          icon={resumeIcon}
          onOpen={onOpenResume}
        />
      </div>
      <Dock />
    </div>
  );
}

function PageTwo({ onBack }) {
  return (
    <div className="desktop">
      <div className="wallpaper" />
      <MenuBar />

      <div className="pdf-window">
        <div className="pdf-window-header">
          <div className="modal-buttons">
            <button className="modal-btn close" onClick={onBack} title="Close" />
            <button className="modal-btn minimize" title="Minimize" />
            <button className="modal-btn maximize" title="Maximize" />
          </div>
          <span className="pdf-window-title">govardhans resume.pdf</span>
        </div>
        <div className="pdf-window-body">
          <iframe
            src="/resume.pdf"
            title="Govardhan R Dev Resume"
            className="pdf-frame"
          />
        </div>
      </div>

      <Dock />
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState(1);

  return page === 1
    ? <PageOne onOpenResume={() => setPage(2)} />
    : <PageTwo onBack={() => setPage(1)} />;
}
