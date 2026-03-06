const express = require('express');
const router = express.Router();
const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

// GET all contacts
router.get('/', async (req, res) => {
  const db = mongodb.getDb().db('cse341');
  const contacts = await db.collection('contacts').find().toArray();
  res.json(contacts);
});

// GET single contact by ID
router.get('/:id', async (req, res) => {
  const db = mongodb.getDb().db('cse341');
  const contact = await db
    .collection('contacts')
    .findOne({ _id: new ObjectId(req.params.id) });
  res.json(contact);
});

module.exports = router;
