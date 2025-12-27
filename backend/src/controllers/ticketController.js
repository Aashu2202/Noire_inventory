const { json } = require('sequelize');
const supabase = require('../config/supabaseClient');

// 1. Get filtered tickets based on Role
const getTickets = async (req, res) => {
    const { id, role } = req.user;
    try {
        // We use "Raised_By" in quotes for the relationship join
        let query = supabase.from('help_tickets').select(`
            *,
            raised_by:users!"Raised_By"(name),
            pc:users!accountable_pc(name),
            solver:users!problem_solver(name)
        `);

        // Role Logic: Column names in .or() must match the DB exactly
        if (role !== 'SUPERADMIN' && role !== 'ADMIN') {
            // Note the double quotes around "Raised_By"
            query = query.or(`"Raised_By".eq.${id},accountable_pc.eq.${id},problem_solver.eq.${id}`);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) {
            console.error('Supabase Error:', error);
            return res.status(400).json({ message: error.message });
        }
        
        console.log(`Fetched ${data.length} tickets for user ID ${id} with role ${role}`);
       console.log(JSON.stringify(data, null, 2)); 
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Create Ticket (Step 1)
const createTicket = async (req, res) => {
    const { 
        accountable_pc, 
        problem_description, 
        problem_solver, 
        priority, 
        Desired_Date, 
        Image_Upload 
    } = req.body;

    try {
        // Calculate Step 1 Planned: Now + 2 Hours
        const now = new Date();
        const step1Planned = new Date(now.getTime() + (2 * 60 * 60 * 1000));

        const { data, error } = await supabase.from('help_tickets').insert([{
            "Raised_By": req.user.id,    // Capitalized to match DB
            accountable_pc: accountable_pc,
            problem_description: problem_description,
            problem_solver: problem_solver,
            priority: priority,
            "Desired_Date": Desired_Date, // Capitalized to match DB
            "Image_Upload": Image_Upload, // Capitalized to match DB
            "step1_Planned": step1Planned // Capitalized to match DB
            // step1_Status and step1_Actual are removed as requested
        }]).select().single();

        if (error) {
            console.error('Insert Error:', error);
            throw error;
        }

        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Update Steps (Logic for Step 2 to 5)
const updateTicketStep = async (req, res) => {
    const { id } = req.params;
    const { step, status, remark, planned_date, revise_date, rating, reraise_date } = req.body;
    
    console.log("Incoming Step Update:", req.body);
    
    const now = new Date();
    let updateData = {};

    try {
        // Fetch existing ticket to calculate Time Taken
        const { data: ticket, error: fetchError } = await supabase
            .from('help_tickets')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError) throw fetchError;

        if (step === 1) {
            // Calculate time taken from creation to Step 1 Actual
            const diff = now - new Date(ticket.created_at);
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff / (1000 * 60)) % 60);

            updateData = {
                step1_Status: status,
                step1_Remark: remark,
                step1_Actual: now,
                step2_Planned: planned_date || null, // Convert "" to null
                Step1_time_taken: `${hours}h ${minutes}m`
            };
        } 
        else if (step === 2) {
            if (status === 'REVISED') {
                updateData = { 
                    Revise_Count: (ticket.Revise_Count || 0) + 1,
                    Revise_Date: revise_date || null,
                    step2_Remark: remark,
                    step2_Status: 'REVISED'
                };
            } else {
                const diff = now - new Date(ticket.step1_Actual || ticket.created_at);
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff / (1000 * 60)) % 60);

                const step3P = new Date(now.getTime() + (4 * 60 * 60 * 1000));
                updateData = {
                    step2_Status: 'SOLVED',
                    step2_Remark: remark,
                    step2_Actual: now,
                    step3_Planned: step3P,
                    step2_Time_taken: `${hours}h ${minutes}m`
                };
            }
        } 
        else if (step === 3) {
            const diff = now - new Date(ticket.step2_Actual);
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff / (1000 * 60)) % 60);

            const step4P = new Date(now.getTime() + (4 * 60 * 60 * 1000));
            updateData = {
                step3_Status: 'VERIFIED',
                step3_Remark: remark,
                step3_Actual: now,
                step4_Planned: step4P,
                step3_Time_taken: `${hours}h ${minutes}m`
            };
        } 
        else if (step === 4) {
            const diff = now - new Date(ticket.step3_Actual);
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff / (1000 * 60)) % 60);

            updateData = {
                step4_Status: status,
                Rating: rating ? parseInt(rating) : null, // Parse string '3' to Int 3
                Reraise_Date: reraise_date || null,      // Fix: Convert "" to null
                step4_Actual: now,
                step4_Time_taken: `${hours}h ${minutes}m`
            };
        }

        const { data, error } = await supabase
            .from('help_tickets')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);

    } catch (error) {
        console.error("Update Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTickets, createTicket, updateTicketStep };