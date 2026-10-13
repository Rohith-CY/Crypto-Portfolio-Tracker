
import { NavLink } from 'react-router-dom'

function Sidebar() {
  const links = [
    { to: '/', label: 'Dashboard', icon: '▦' },
    { to: '/holdings', label: 'My Holdings', icon: '◈' },
    { to: '/add-holding', label: 'Add Holding', icon: '+' },
    { to: '/transactions', label: 'Transactions', icon: '↔' },
  ]

  return (
    <aside className="sidebar">
      <h2 className="brand">
        <span className="brand-icon">◆</span> CRYPTO
      </h2>

      <p className="sidebar-label">MAIN MENU</p>

      <nav>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <p className="sidebar-label">PORTFOLIO</p>
        <p className="sidebar-description">
          Manage your digital assets securely on the blockchain.
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
