const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

const getAllContacts = async (req, res) => {
  try {
    const db = getDb();
    const contacts = await db.collection('contacts').find().toArray();
    res.status(200).json(contacts);
  } catch (err) {
    console.error('GET /contacts error:', err);
    res.status(500).json({ error: err.message });
  }
};

const getContactById = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    const db = getDb();
    const contact = await db
      .collection('contacts')
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.status(200).json(contact);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve contact' });
  }
};

const createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({
        error: 'All fields are required: firstName, lastName, email, favoriteColor, birthday'
      });
    }

    const db = getDb();
    const result = await db.collection('contacts').insertOne({
      firstName,
      lastName,
      email,
      favoriteColor,
      birthday
    });

    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create contact' });
  }
};

const updateContact = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
      return res.status(400).json({
        error: 'All fields are required: firstName, lastName, email, favoriteColor, birthday'
      });
    }

    const db = getDb();
    const result = await db.collection('contacts').replaceOne(
      { _id: new ObjectId(req.params.id) },
      { firstName, lastName, email, favoriteColor, birthday }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to update contact' });
  }
};

const deleteContact = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const db = getDb();
    const result = await db
      .collection('contacts')
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete contact' });
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};