const API = '/students';
    let editingId = null;

    async function loadStudents() {
      const res = await fetch(API);
      const students = await res.json();
      const list = document.getElementById('studentList');
      list.innerHTML = '';

      students.forEach(s => {
        const div = document.createElement('div');
        div.className = 'student';
        div.innerHTML = `
          <strong>${s.name}</strong> (${s.age}) - ${s.course}
          <button onclick="editStudent('${s.id}', '${s.name}', ${s.age}, '${s.course}')">Edit</button>
          <button onclick="deleteStudent('${s.id}')">Delete</button>
        `;
        list.appendChild(div);
      });
    }

    async function addStudent() {
      const name = document.getElementById('name').value;
      const age = document.getElementById('age').value;
      const course = document.getElementById('course').value;

      if (!name || !age || !course) return alert('Fill all fields');

      const student = { name, age: Number(age), course };

      if (editingId) {
        await fetch(`${API}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(student)
        });
        editingId = null;
        document.getElementById('submitBtn').innerText = 'Add Student';
      } else {
        await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(student)
        });
      }

      clearForm();
      loadStudents();
    }

    function editStudent(id, name, age, course) {
      document.getElementById('name').value = name;
      document.getElementById('age').value = age;
      document.getElementById('course').value = course;
      editingId = id;
      document.getElementById('submitBtn').innerText = 'Update Student';
    }

    async function deleteStudent(id) {
      await fetch(`${API}/${id}`, { method: 'DELETE' });
      loadStudents();
    }

    function clearForm() {
      document.getElementById('name').value = '';
      document.getElementById('age').value = '';
      document.getElementById('course').value = '';
    }

    loadStudents();