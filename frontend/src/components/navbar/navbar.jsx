import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User, LayoutDashboard, LifeBuoy, Menu } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top shadow-sm px-3 px-md-4" 
         style={{ backgroundColor: 'var(--white)', borderBottom: '3px solid var(--primary-green)' }}>
      <div className="container-fluid">
        
        {/* BRAND */}
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/dashboard" style={{ color: 'var(--primary-purple)' }}>
          <LayoutDashboard className="me-2" /> 
          INVENTORY<span style={{ color: 'var(--primary-green)' }}>PRO</span>
        </Link>

        {/* HAMBURGER TOGGLE BUTTON */}
        <button 
          className="navbar-toggler border-0 shadow-none" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <Menu size={24} color="var(--primary-purple)" />
        </button>

        {/* COLLAPSIBLE CONTENT */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <Link 
                to="/help-tickets" 
                className="nav-link d-flex align-items-center fw-semibold px-3 py-2 rounded-pill"
                style={{ color: 'var(--text-dark)', transition: 'var(--transition)' }}
              >
                <LifeBuoy size={18} className="me-2 text-primary" />
                Help Desk
              </Link>
            </li>
            {/* You can add more links here later */}
          </ul>

          {/* USER PROFILE SECTION */}
          <div className="d-flex align-items-center mt-3 mt-lg-0 border-top pt-3 pt-lg-0 border-lg-0">
            <div className="me-3 d-block text-end">
              <small className="text-muted d-block small" style={{ fontSize: '11px' }}>Logged in as</small>
              <span className="fw-semibold d-block" style={{ color: 'var(--text-dark)', fontSize: '14px' }}>{user?.name}</span>
            </div>
            
            <div className="dropdown">
              <button 
                  className="btn btn-light rounded-circle p-2 shadow-sm border" 
                  type="button" 
                  id="userDropdown" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
              >
                <User size={20} color="var(--primary-purple)" />
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2" aria-labelledby="userDropdown">
                <li className="px-3 py-2 border-bottom">
                  <span className="d-block small text-muted">Signed in as</span>
                  <strong className="text-truncate d-block" style={{maxWidth: '150px'}}>{user?.email}</strong>
                </li>
                <li>
                  <button 
                      onClick={onLogout} 
                      className="dropdown-item text-danger d-flex align-items-center mt-1 py-2"
                  >
                    <LogOut size={16} className="me-2" /> Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;