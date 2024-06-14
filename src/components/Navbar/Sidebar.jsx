import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div>
        {/* ======= Sidebar ======= */}
        <aside id="sidebar" className="sidebar">
            <ul className="sidebar-nav" id="sidebar-nav">
              <li className="nav-item">
                <NavLink to={'/dashboard'} className={({isActive})=> isActive? "nav-link" :"nav-link collapsed"}>
                  <i className="bi bi-grid"></i>
                  <span>Dashboard</span>
                </NavLink>
              </li>
              {/* End Dashboard Nav */}
              <li className="nav-item">
                <NavLink to={'/campRequest'} className={({isActive})=> isActive? "nav-link" :"nav-link collapsed"}>
                  <i className="bi bi-arrow-bar-left"></i>
                  <span>Request for Camp</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to={'/campReport'} className={({isActive})=> isActive? "nav-link" :"nav-link collapsed"}>
                  <i className="bi bi-file-check-fill"></i>
                  <span>Camp Report</span>
                </NavLink>
              </li>
            </ul>
          </aside>
          {/* End Sidebar */}
    </div>
  )
}

export default Sidebar