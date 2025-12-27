import React, { useState, useEffect } from 'react'; // 1. MUST IMPORT useState
import { useSelector, useDispatch } from 'react-redux';
import { fetchTickets, createTicket } from '../features/tickets/ticketSlice';
import supabase from "../config/supabaseClient";
import { Plus, Camera, Upload, Clock, CheckCircle, AlertCircle, Activity, LifeBuoy } from 'lucide-react';
import Navbar from '../components/navbar/navbar';

const HelpTicketPage = () => {
    const dispatch = useDispatch();
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    
    // NEW: States for the Action Modal
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    const { tickets, isLoading } = useSelector((state) => state.tickets);
    const { user } = useSelector((state) => state.auth);

    const [pcs, setPcs] = useState([]);
    const [solvers, setSolvers] = useState([]);
    const [formData, setFormData] = useState({
        accountable_pc: '',
        problem_description: '',
        problem_solver: '',
        priority: 'LOW',
        Desired_Date: ''
    });

    useEffect(() => {
        dispatch(fetchTickets());
        fetchUsers();
    }, [dispatch]);

    const fetchUsers = async () => {
        const { data } = await supabase.from('users').select('id, name, Designation');
        if (data) {
            setPcs(data.filter(u => u.Designation === 'PC'));
            setSolvers(data);
        }
    };

    const handleOpenTicket = (ticket) => {
        setSelectedTicket(ticket);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(createTicket(formData));
        setShowOffcanvas(false);
    };

    return (
         <div style={{ backgroundColor: 'var(--bg-wheat)', minHeight: '100vh' }}>
            <Navbar />
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold" style={{ color: 'var(--primary-purple)' }}>
                        <LifeBuoy className="me-2" /> Help Desk
                    </h2>
                    <button className="btn btn-custom-purple d-flex align-items-center" onClick={() => setShowOffcanvas(true)}>
                        <Plus size={18} className="me-2" /> Raise Ticket
                    </button>
                </div>

                {/* 3 CARDS IN A ROW GRID */}
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {tickets && tickets.map(ticket => (
                        <div key={ticket.id} className="col">
                            <TicketCard ticket={ticket} onClick={() => handleOpenTicket(ticket)} />
                        </div>
                    ))}
                </div>
            </div>

            {/* ACTION MODAL */}
            {showModal && (
                <TicketActionModal 
                    ticket={selectedTicket} 
                    onClose={() => { setShowModal(false); setSelectedTicket(null); }} 
                />
            )}


            {/* OFF-CANVAS COMPONENT */}
            <div 
                className={`offcanvas offcanvas-end ${showOffcanvas ? 'show' : ''}`} 
                style={{ 
                    visibility: showOffcanvas ? 'visible' : 'hidden', 
                    width: '450px',
                    boxShadow: '-5px 0 15px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid var(--primary-green)'
                }}
            >
                <div className="offcanvas-header border-bottom">
                    <h5 className="fw-bold mb-0">New Help Ticket</h5>
                    <button type="button" className="btn-close" onClick={() => setShowOffcanvas(false)}></button>
                </div>
                <div className="offcanvas-body">
                    <form onSubmit={handleSubmit} className="d-grid gap-3">
                        <div className="p-3 rounded bg-light border small text-muted">
                            Raised By: <strong className="text-dark">{user?.name}</strong>
                        </div>
                        
                       <div>
    <label className="form-label fw-bold small">Accountable PC (Designation: PC)</label>
    <select className="form-select bg-light" required onChange={e => setFormData({...formData, accountable_pc: e.target.value})}>
        <option value="">Select PC</option>
        {pcs.map(pc => <option key={pc.id} value={pc.id}>{pc.name}</option>)}
    </select>
</div>

                        <div>
                            <label className="form-label fw-bold small">Problem Description</label>
                            <textarea className="form-control border-0 bg-light" rows="3" required onChange={e => setFormData({...formData, problem_description: e.target.value})} placeholder="Describe the issue..."></textarea>
                        </div>

                        <div>
    <label className="form-label fw-bold small">Problem Solver</label>
    <select className="form-select bg-light" required onChange={e => setFormData({...formData, problem_solver: e.target.value})}>
        <option value="">Select Solver</option>
        {solvers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
    </select>
</div>

                        <div>
    <label className="form-label fw-bold small">Desired Date</label>
    <input type="date" className="form-control bg-light" required onChange={e => setFormData({...formData, Desired_Date: e.target.value})} />
</div>


                        <div>
                            <label className="form-label fw-bold small">Priority</label>
                            <select className="form-select border-0 bg-light py-2" onChange={e => setFormData({...formData, priority: e.target.value})}>
                                <option value="LOW">LOW</option>
                                <option value="INTERMEDIATE">INTERMEDIATE</option>
                                <option value="HIGH">HIGH</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-custom-green py-3 fw-bold mt-3 shadow-sm">
                            Submit Ticket
                        </button>
                    </form>
                </div>
            </div>

            {/* BACKDROP - Important for closing by clicking outside */}
            {showOffcanvas && (
                <div 
                    className="offcanvas-backdrop fade show" 
                    onClick={() => setShowOffcanvas(false)}
                ></div>
            )}
        </div>
    );
};

// Sub-component for Ticket UI
const TicketCard = ({ ticket, onClick }) => {
    const truncate = (str, n) => (str?.length > n ? str.substr(0, n - 1) + "..." : str);

    // Logic to determine which date to show
    const getTargetInfo = () => {
        if (ticket.step1_Status === 'Open') return { label: 'Step 1 Target', date: ticket.step1_Planned };
        if (ticket.step2_Status !== 'SOLVED') return { label: 'Step 2 Target', date: ticket.step2_Planned };
        if (ticket.step3_Status !== 'VERIFIED') return { label: 'Step 3 Target', date: ticket.step3_Planned };
        return { label: 'Final Step Target', date: ticket.step4_Planned };
    };

    const target = getTargetInfo();

    return (
        <div 
            className="card h-100 border-0 shadow-sm hover-shadow" 
            style={{ borderRadius: '15px', cursor: 'pointer', transition: '0.3s', backgroundColor: 'white' }}
            onClick={onClick}
        >
            <div className="card-header bg-white border-0 d-flex justify-content-between pt-3">
                <span className="badge bg-light text-primary border">{ticket.Help_Ticket_No}</span>
                <span className={`badge ${ticket.priority === 'HIGH' ? 'bg-danger' : 'bg-info'}`}>{ticket.priority}</span>
            </div>
            <div className="card-body">
                <h6 className="fw-bold mb-2">{truncate(ticket.problem_description, 50)}</h6>
                <div className="small text-muted mb-3">
                    <div><strong>By:</strong> {ticket.raised_by?.name}</div>
                    <div><strong>PC:</strong> {ticket.pc?.name}</div>
                </div>
                <div className="p-2 rounded bg-light small">
                    <div className="d-flex justify-content-between">
                        <span>Solver:</span> <span className="fw-semibold">{ticket.solver?.name}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                        <span>Desired:</span> <span className="text-primary">{ticket.Desired_Date}</span>
                    </div>
                </div>
            </div>
            <div className="card-footer bg-white border-0 pb-3">
                <div className="text-uppercase fw-bold text-muted mb-1" style={{ fontSize: '10px' }}>{target.label}</div>
                <div className="small fw-bold text-success">
                    <Clock size={14} className="me-1" />
                    {target.date ? new Date(target.date).toLocaleString() : 'Not Set'}
                </div>
            </div>
        </div>
    );
};

import { updateStep } from '../features/tickets/ticketSlice'; // Ensure this is imported

const TicketActionModal = ({ ticket, onClose }) => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [actionData, setActionData] = useState({
        remark: '',
        status: '',
        planned: '',
        revise_date: '',
        rating: 5,
        reraise_date: ''
    });

    const isPC = user.id === ticket.accountable_pc;
    const isSolver = user.id === ticket.problem_solver;
    const isRaiser = user.id === ticket.Raised_By;

    const onUpdate = (stepNumber, payload) => {
        dispatch(updateStep({ id: ticket.id, stepData: { ...payload, step: stepNumber } }));
        onClose();
    };

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
                    <div className="modal-header border-0 pb-0">
                        <h5 className="fw-bold">{ticket.Help_Ticket_No}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    
                    <div className="modal-body p-4">
                        {/* 5-STEP TRACKER VISUAL */}
                        <div className="d-flex justify-content-between mb-4 text-center">
                            {['Raised', 'Verified', 'Solved', 'FollowUp', 'Closed'].map((label, i) => {
                                const stepKey = i === 0 ? 'step1_Status' : `step${i}_Status`;
                                const isDone = ticket[stepKey] === 'DONE' || ticket[stepKey] === 'SOLVED' || ticket[stepKey] === 'VERIFIED' || ticket[stepKey] === 'CLOSED';
                                return (
                                    <div key={i} style={{ width: '20%' }}>
                                        <div className={`rounded-circle mx-auto mb-1 d-flex align-items-center justify-content-center ${isDone ? 'bg-success text-white' : 'bg-light text-muted'}`} style={{ width: '35px', height: '35px', fontSize: '14px', fontWeight: 'bold' }}>
                                            {isDone ? <CheckCircle size={18} /> : i + 1}
                                        </div>
                                        <div style={{ fontSize: '11px', fontWeight: 'bold' }}>{label}</div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* STEP 1: PC CHECK */}
                        {ticket.step1_Status === 'Open' && (
                            <div className="alert alert-info border-0 shadow-sm">
                                <h6 className="fw-bold">Step 1: PC Verification Needed</h6>
                                {isPC ? (
                                    <div className="mt-3">
                                        <textarea className="form-control mb-2" placeholder="Enter PC Remark..." onChange={e => setActionData({...actionData, remark: e.target.value})} />
                                        <label className="small fw-bold">Plan Step 2 Completion Date:</label>
                                        <input type="datetime-local" className="form-control mb-3" onChange={e => setActionData({...actionData, planned: e.target.value})} />
                                        <button className="btn btn-primary w-100 fw-bold" onClick={() => onUpdate(1, { status: 'DONE', remark: actionData.remark, planned_date: actionData.planned })}>Approve & Set Plan</button>
                                    </div>
                                ) : <p className="mb-0">Waiting for PC <strong>{ticket.pc?.name}</strong> to verify this ticket.</p>}
                            </div>
                        )}

                        {/* STEP 2: SOLVER ACTION */}
                        {ticket.step1_Status === 'DONE' && !ticket.step2_Status && (
                            <div className="alert alert-warning border-0 shadow-sm">
                                <h6 className="fw-bold">Step 2: Solve Problem</h6>
                                {isSolver ? (
                                    <div className="mt-3">
                                        <select className="form-select mb-2" onChange={e => setActionData({...actionData, status: e.target.value})}>
                                            <option value="">Select Action</option>
                                            <option value="SOLVED">SOLVED (Finish)</option>
                                            <option value="REVISED">REVISED (Need more time)</option>
                                        </select>
                                        {actionData.status === 'REVISED' && (
                                            <input type="date" className="form-control mb-2" onChange={e => setActionData({...actionData, revise_date: e.target.value})} />
                                        )}
                                        <textarea className="form-control mb-2" placeholder="Solving Remark..." onChange={e => setActionData({...actionData, remark: e.target.value})} />
                                        <button className="btn btn-warning w-100 fw-bold" onClick={() => onUpdate(2, { status: actionData.status, remark: actionData.remark, revise_date: actionData.revise_date })}>Submit Progress</button>
                                    </div>
                                ) : <p className="mb-0">Waiting for Solver <strong>{ticket.solver?.name}</strong> to resolve.</p>}
                            </div>
                        )}

                        {/* STEP 3: PC FOLLOW-UP (NEW) */}
                        {ticket.step2_Status === 'SOLVED' && !ticket.step3_Status && (
                            <div className="alert alert-primary border-0 shadow-sm">
                                <h6 className="fw-bold">Step 3: PC Follow-Up & Verification</h6>
                                {isPC ? (
                                    <div className="mt-3">
                                        <textarea className="form-control mb-3" placeholder="Verification Remark..." onChange={e => setActionData({...actionData, remark: e.target.value})} />
                                        <button className="btn btn-primary w-100 fw-bold" onClick={() => onUpdate(3, { status: 'VERIFIED', remark: actionData.remark })}>Verify & Pass to Raiser</button>
                                    </div>
                                ) : <p className="mb-0">Waiting for PC to verify the solution.</p>}
                            </div>
                        )}

                        {/* STEP 4: RAISER CLOSING (NEW) */}
                        {ticket.step3_Status === 'VERIFIED' && !ticket.step4_Status && (
                            <div className="alert alert-success border-0 shadow-sm">
                                <h6 className="fw-bold">Step 4: Final Confirmation</h6>
                                {isRaiser ? (
                                    <div className="mt-3">
                                        <select className="form-select mb-2" onChange={e => setActionData({...actionData, status: e.target.value})}>
                                            <option value="">Choose Result</option>
                                            <option value="CLOSED">CLOSE TICKET</option>
                                            <option value="RERAISE">RERAISE (Not solved)</option>
                                        </select>
                                        {actionData.status === 'CLOSED' && (
                                            <div className="mb-2">
                                                <label className="small fw-bold">Rating (1-5 Stars):</label>
                                                <input type="number" min="1" max="5" className="form-control" onChange={e => setActionData({...actionData, rating: e.target.value})} />
                                            </div>
                                        )}
                                        {actionData.status === 'RERAISE' && (
                                            <input type="date" className="form-control mb-2" onChange={e => setActionData({...actionData, reraise_date: e.target.value})} />
                                        )}
                                        <button className="btn btn-success w-100 fw-bold" onClick={() => onUpdate(4, { status: actionData.status, rating: actionData.rating, reraise_date: actionData.reraise_date })}>Complete Ticket</button>
                                    </div>
                                ) : <p className="mb-0">Waiting for <strong>{ticket.raised_by?.name}</strong> to close the ticket.</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpTicketPage;