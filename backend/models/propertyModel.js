
// Initially using in-memory storage
// In a real app, this would connect to a database

// Sample properties
const sampleProperties = [
  {
    id: "prop-1",
    address: "123 Main Street",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
    price: 1250000,
    type: "Single Family Home",
    coordinates: { lat: 34.052235, lng: -118.243683 },
  },
  {
    id: "prop-2",
    address: "456 Ocean Avenue",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    price: 1875000,
    type: "Condo",
    coordinates: { lat: 37.774929, lng: -122.419416 },
  },
  {
    id: "prop-3",
    address: "789 Desert Road",
    city: "Phoenix",
    state: "AZ",
    zipCode: "85001",
    price: 750000,
    type: "Single Family Home",
    coordinates: { lat: 33.448376, lng: -112.074036 },
  }
];

// Get all properties
const getAllProperties = () => {
  return [...sampleProperties];
};

module.exports = {
  getAllProperties
};
