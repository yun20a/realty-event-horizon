
const properties = require('../models/propertyModel');

exports.getAllProperties = (req, res) => {
  try {
    const allProperties = properties.getAllProperties();
    res.status(200).json(allProperties);
  } catch (error) {
    console.error('Error getting all properties:', error);
    res.status(500).json({ message: 'Failed to get properties', error: error.message });
  }
};
