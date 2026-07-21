const express = require('express');
const Company = require('../../models/crm/Company');
const Contact = require('../../models/crm/Contact');
const Deal = require('../../models/crm/Deal');
const Task = require('../../models/crm/Task');
const authenticate = require('../../middleware/auth');

const router = express.Router();

// Get CRM dashboard statistics
router.get('/', authenticate, async (req, res) => {
    try {
        const [companies, contacts, deals, tasks] = await Promise.all([
            Company.countDocuments(),
            Contact.countDocuments(),
            Deal.find().lean(),
            Task.find({ status: 'pending' }).countDocuments()
        ]);

        const totalRevenue = deals
            .filter(d => d.stage === 'won')
            .reduce((sum, d) => sum + Number(d.value || 0), 0);

        const pipelineValue = deals
            .filter(d => !['won', 'lost'].includes(d.stage))
            .reduce((sum, d) => sum + Number(d.value || 0), 0);

        const activeDeals = deals.filter(d => !['won', 'lost'].includes(d.stage)).length;
        const wonDeals = deals.filter(d => d.stage === 'won').length;

        return res.json({
            totalCompanies: companies,
            totalContacts: contacts,
            totalDeals: deals.length,
            activeDeals,
            wonDeals,
            totalRevenue,
            pipelineValue,
            pendingTasks: tasks
        });
    } catch (err) {
        console.error('Get CRM stats error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
