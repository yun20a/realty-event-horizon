
// Initially using in-memory storage
// In a real app, this would connect to a database

const { generateId } = require('../utils/helpers');

// Sample participants
const sampleParticipants = [
  {
    id: "user-1",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "agent",
  },
  {
    id: "user-2",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    role: "agent",
  },
  {
    id: "user-3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "client",
  }
];

// Get all participants
const getAllParticipants = () => {
  return [...sampleParticipants];
};

// Create a new participant
const createParticipant = (participant) => {
  const newParticipant = {
    ...participant,
    id: participant.id || generateId(),
  };
  
  sampleParticipants.push(newParticipant);
  return newParticipant;
};

module.exports = {
  getAllParticipants,
  createParticipant
};
