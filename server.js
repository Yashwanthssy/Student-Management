const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = 3000;

const studentsPath = './data/students.json';

app.use(express.json());
app.use(express.static('public'));


// Helper: Read/Write from students.json
const readStudents = () => JSON.parse(fs.readFileSync(studentsPath));
const writeStudents = (data) => fs.writeFileSync(studentsPath, JSON.stringify(data, null, 2));

// Routes

// Welcome route
app.get('/', (req, res) => {
    res.send('🎓 Welcome to the Student Management API');
  });

// Get all students
app.get('/students', (req, res) => {
  const students = readStudents();
  res.json(students);
});

// Get student by ID
app.get('/students/:id', (req, res) => {
  const students = readStudents();
  const student = students.find(s => s.id === req.params.id);
  student ? res.json(student) : res.status(404).json({ error: "Student not found" });
});

// Add a new student
app.post('/students', (req, res) => {
  const students = readStudents();
  const newStudent = { id: uuidv4(), ...req.body };
  students.push(newStudent);
  writeStudents(students);
  res.status(201).json(newStudent);
});

// Update a student
app.put('/students/:id', (req, res) => {
  let students = readStudents();
  const index = students.findIndex(s => s.id === req.params.id);

  if (index !== -1) {
    students[index] = { ...students[index], ...req.body };
    writeStudents(students);
    res.json(students[index]);
  } else {
    res.status(404).json({ error: "Student not found" });
  }
});

// Delete a student
app.delete('/students/:id', (req, res) => {
  let students = readStudents();
  const newStudents = students.filter(s => s.id !== req.params.id);
  if (students.length === newStudents.length) {
    res.status(404).json({ error: "Student not found" });
  } else {
    writeStudents(newStudents);
    res.json({ message: "Student deleted" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
