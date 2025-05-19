
// Helper to generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15);

module.exports = {
  generateId
};
