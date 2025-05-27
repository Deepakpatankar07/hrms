// seedCandidates.js
const mongoose = require('mongoose');
const Candidate = require('./models/CandidateModel.js');

const candidates = [
  { 
    id: '01',
    name: 'Jacob William', 
    email: 'jacob.william@example.com', 
    phone: '(252) 555-0111',
    position: 'Senior Developer',
    status: 'New',
    experience: 1.5,
    resume: 'jacob-william-resume.pdf'
  },
  { 
    id: '02',
    name: 'Guy Hawkins', 
    email: 'kenzil.awson@example.com', 
    phone: '(907) 555-0101',
    position: 'Human Resource Lead',
    status: 'New',
    experience: 3,
    resume: 'guy-hawkins-resume.pdf'
  },
  { 
    id: '03',
    name: 'Artene McCoy', 
    email: 'artene.mccoy@example.com', 
    phone: '(302) 555-0107',
    position: 'Full Time Designer',
    status: 'Selected',
    experience: 2,
    resume: 'artene-mccoy-resume.pdf'
  },
  { 
    id: '04',
    name: 'Leslie Alexander', 
    email: 'willie.jennings@example.com', 
    phone: '(207) 555-0119',
    position: 'Full Time Developer',
    status: 'Rejected',
    experience: 0,
    resume: 'leslie-alexander-resume.pdf'
  },
];

const MONGODB_URI = 'mongodb://localhost:27017/hrms'; // Change DB name and URI if needed

async function seedCandidates() {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log('Connected to MongoDB');

    // Optional: Clear old data
    await Candidate.deleteMany({});
    console.log('Old candidate data cleared');

    // Insert new data
    await Candidate.insertMany(candidates);
    console.log('Candidate data seeded successfully');
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    mongoose.connection.close();
  }
}

seedCandidates();
