const form = document.getElementById('student-form');
const tableBody = document.querySelector('#records-table tbody');
let students = JSON.parse(localStorage.getItem('students')) || [];

// Load existing records when page loads
document.addEventListener('DOMContentLoaded', () => {
    students.forEach(student => addRowToTable(student));
});

// Form Submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const id = document.getElementById('id').value.trim();
    const email = document.getElementById('email').value.trim();
    const contact = document.getElementById('contact').value.trim();

    // Validation with Regex
    const nameRegex = /^[A-Za-z\s]+$/;  // Accepts only alphabets and spaces
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const contactRegex = /^[0-9]{10}$/; // 10 digits for phone number

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

    const student = { name, id, email, contact };
    students.push(student);
    localStorage.setItem('students', JSON.stringify(students));
    addRowToTable(student);
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

    deleteStudent(id);  // Remove to update
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