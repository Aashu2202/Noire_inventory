import { useSelector } from 'react-redux';
import Navbar from '../components/navbar/navbar';

import { User, LayoutDashboard, Activity } from 'lucide-react'; 

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Navbar />
      <div className="container-fluid py-5 px-md-5" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-wheat)' }}>
        <div className="row g-4">
          <div className="col-12 mb-2">
            <h2 className="fw-bold d-flex align-items-center">
              <LayoutDashboard className="me-2" color="var(--primary-purple)" /> 
              Dashboard Overview
            </h2>
            <p className="text-muted">Hello {user?.name}, here is what's happening with your inventory today.</p>
          </div>
          
          {/* Card 1: User Role */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '15px', backgroundColor: 'white' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted text-uppercase small fw-bold">User Role</h6>
                  <h3 className="fw-bold mb-0" style={{ color: 'var(--primary-purple)' }}>{user?.role}</h3>
                </div>
                <div className="p-3 rounded-3" style={{ backgroundColor: 'rgba(123, 77, 255, 0.1)' }}>
                   {/* This was causing the error - now it's imported */}
                   <User color="var(--primary-purple)" size={28} />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Account Status */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '15px', backgroundColor: 'white' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted text-uppercase small fw-bold">Account Status</h6>
                  <h3 className="fw-bold mb-0" style={{ color: 'var(--primary-green)' }}>Active</h3>
                </div>
                <div className="p-3 rounded-3" style={{ backgroundColor: 'rgba(19, 201, 119, 0.1)' }}>
                   <Activity color="var(--primary-green)" size={28} />
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="col-12">
            <div className="card border-0 shadow-sm p-5 mt-4 text-center" style={{ borderRadius: '20px', backgroundColor: 'var(--white)' }}>
              <h4 className="fw-bold">Welcome to the Inventory Management System</h4>
              <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                Use the navigation menu to manage products, check stock levels, and generate reports. 
                Everything is synced in real-time with Supabase.
              </p>
              <button className="btn btn-custom-green px-5 py-3 fw-bold mt-3">
                Explore Inventory
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;