const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());

// DB file path
const DB_PATH = path.join(__dirname, 'db.json');

// Ensure db file exists
fs.ensureFileSync(DB_PATH);
const loadDB = () => {
  const content = fs.readFileSync(DB_PATH, 'utf-8') || '';
  return content ? JSON.parse(content) : { students: [], teachers: [] };
};
const saveDB = (db) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
};

// Student registration/login
app.post('/api/student/register', (req, res) => {
  const { name, collegeId, password, institution } = req.body;
  if (!name || !collegeId || !password || !institution) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const db = loadDB();
  if (db.students.some(s => s.collegeId === collegeId)) {
    return res.status(400).json({ error: 'Student already exists' });
  }
  const newStudent = { id: uuidv4(), name, collegeId, password, institution };
  db.students.push(newStudent);
  saveDB(db);
  res.json({ success: true, user: newStudent });
});

app.post('/api/teacher/register', (req, res) => {
  const { name, collegeId, password, institution } = req.body;
  if (!name || !collegeId || !password || !institution) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const db = loadDB();
  if (db.teachers.some(t => t.collegeId === collegeId)) {
    return res.status(400).json({ error: 'Teacher already exists' });
  }
  const newTeacher = { id: uuidv4(), name, collegeId, password, institution };
  db.teachers.push(newTeacher);
  saveDB(db);
  res.json({ success: true, user: newTeacher });
});

// (You can add login endpoints similarly, profile update, etc.)

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
