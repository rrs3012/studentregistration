const form = document.getElementById('student-form');
const tableBody = document.querySelector('#records-table tbody');
let students = JSON.parse(localStorage.getItem('students')) || [];
let editMode = false;
let editStudentId = null;

// Load existing records on page load
document.addEventListener('DOMContentLoaded', () => {
    students.forEach(student => addRowToTable(student));
});

// Form Submission (Add or Edit)
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const id = document.getElementById('id').value.trim();
    const email = document.getElementById('email').value.trim();
    const contact = document.getElementById('contact').value.trim();

    // Validation with Regex
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const contactRegex = /^[0-9]{10}$/;

    if (!name || !id || !email || !contact) {
        alert('Please fill out all fields.');
        return;
    }

    if (!nameRegex.test(name)) {
        alert('Student Name must contain only alphabets.');
        return;
    }

    if (!emailRegex.test(email)) {
        alert('Enter a valid email address.');
        return;
    }

    if (!contactRegex.test(contact)) {
        alert('Contact number must be 10 digits.');
        return;
    }

    // Check if student exists (in edit mode)
    const existingIndex = students.findIndex(student => student.id === id);

    if (editMode && editStudentId) {
        // Update the existing student
        students[existingIndex] = { name, id, email, contact };
        editMode = false;
        editStudentId = null;
    } else {
        // Add new student if not in edit mode
        if (existingIndex !== -1) {
            alert('Student ID already exists. Use a different ID.');
            return;
        }
        students.push({ name, id, email, contact });
    }

    // Save to localStorage
    localStorage.setItem('students', JSON.stringify(students));
    renderTable();
    form.reset();
});

// Add Row to Table
function addRowToTable(student) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.id}</td>
        <td>${student.email}</td>
        <td>${student.contact}</td>
        <td>
            <button onclick="editStudent('${student.id}')">Edit</button>
            <button onclick="deleteStudent('${student.id}')">Delete</button>
        </td>
    `;
    tableBody.appendChild(row);
}

// Edit Student
function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;

    document.getElementById('name').value = student.name;
    document.getElementById('id').value = student.id;
    document.getElementById('email').value = student.email;
    document.getElementById('contact').value = student.contact;

    // Set form in edit mode
    editMode = true;
    editStudentId = id;
}

// Delete Student
function deleteStudent(id) {
    students = students.filter(s => s.id !== id);
    localStorage.setItem('students', JSON.stringify(students));
    renderTable();
}

// Re-render Table
function renderTable() {
    tableBody.innerHTML = '';
    students.forEach(student => addRowToTable(student));
}