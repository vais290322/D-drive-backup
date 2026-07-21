// Employees page initialization
export default function initEmployees() {
  const employeesList = document.getElementById('employees-list');
  const addEmployeeBtn = document.getElementById('add-employee-btn');
  const departmentFilter = document.getElementById('department-filter');
  const searchInput = document.getElementById('employee-search');

  // Static employee data as the backend is removed
  const employees = [
    { id: '1', name: 'Alice Johnson', position: 'Software Developer', department: 'Engineering', phone: '555-0101', email: 'alice.j@example.com' },
    { id: '2', name: 'Bob Williams', position: 'Project Manager', department: 'Management', phone: '555-0102', email: 'bob.w@example.com' },
    { id: '3', name: 'Charlie Brown', position: 'UX Designer', department: 'Design', phone: '555-0103', email: 'charlie.b@example.com' },
    { id: '4', name: 'Diana Miller', position: 'QA Tester', department: 'Engineering', phone: '555-0104', email: 'diana.m@example.com' }
  ];

  renderEmployees(employees);

  // Add/filter/search functionality is disabled as it requires a backend.
  // addEmployeeBtn.addEventListener('click', showAddEmployeeModal);
  // departmentFilter.addEventListener('change', () => filterEmployees(employees));
  // searchInput.addEventListener('input', () => filterEmployees(employees));
}

function renderEmployees(employees) {
  const employeesList = document.getElementById('employees-list');
  employeesList.innerHTML = '';

  employees.forEach(employee => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${employee.name}</td>
      <td>${employee.position}</td>
      <td>${employee.department}</td>
      <td>${employee.phone}</td>
      <td>${employee.email}</td>
      <td>
        <button class="edit-btn" data-id="${employee.id}">Edit</button>
        <button class="delete-btn" data-id="${employee.id}">Delete</button>
      </td>
    `;
    employeesList.appendChild(row);
  });
}