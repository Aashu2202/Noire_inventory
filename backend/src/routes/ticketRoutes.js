const express = require('express');
const router = express.Router();
const { getTickets, createTicket, updateTicketStep } = require('../controllers/ticketController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getTickets).post(protect, createTicket);
router.route('/:id/step').put(protect, updateTicketStep);

module.exports = router;