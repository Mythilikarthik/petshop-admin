const express = require('express');
const router = express.Router();
const Faq = require('../Models/Faq');   

// Get all FAQs
router.get('/', async (req, res) => {
  try {
    const faqs = await Faq.find();
    res.json({status: 'success', listings: faqs, success: true});
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Get FAQ by ID
router.get('/:id', async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    res.json({ status: 'success', faq: faq });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Create new FAQ
router.post('/', async (req, res) => {
  try {
    const newFaq = new Faq(req.body);
    const existing = await Faq.findOne({
      question: { $regex: `^${req.body.question}$`, $options: 'i' }
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'FAQ question already exists' });
    }
    const savedFaq = await newFaq.save();
    res.status(201).json({success: true, faq: savedFaq});
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Update FAQ by ID
router.put('/:id', async (req, res) => {
  try {
    const existing = await Faq.findOne({
      _id: { $ne: req.params.id },
      question: { $regex: `^${req.body.question}$`, $options: 'i' }
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'FAQ question already exists' });
    }
    const updatedFaq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFaq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    res.json({ success: true, faq: updatedFaq });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Delete FAQ by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedFaq = await Faq.findByIdAndDelete(req.params.id);
    if (!deletedFaq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;