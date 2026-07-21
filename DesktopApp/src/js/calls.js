// Calls page initialization
export default function initCalls() {
  const callsList = document.getElementById('calls-list');
  const addCallBtn = document.getElementById('add-call-btn');
  const typeFilter = document.getElementById('call-type-filter');

  // Static call data as the backend is removed
  const calls = [
    { id: '1', createdAt: new Date().toISOString(), employeeName: 'Alice Johnson', type: 'Incoming', duration: 5, status: 'Completed' },
    { id: '2', createdAt: new Date().toISOString(), employeeName: 'Bob Williams', type: 'Outgoing', duration: 12, status: 'Completed' },
    { id: '3', createdAt: new Date().toISOString(), employeeName: 'Alice Johnson', type: 'Missed', duration: 0, status: 'Missed' },
    { id: '4', createdAt: new Date().toISOString(), employeeName: 'Charlie Brown', type: 'Incoming', duration: 8, status: 'Completed' }
  ];

  renderCalls(calls);

  // Add/filter functionality is disabled as it requires a backend.
  // addCallBtn.addEventListener('click', showAddCallModal);
  // typeFilter.addEventListener('change', () => filterCalls(calls));
}

function renderCalls(calls) {
  const callsList = document.getElementById('calls-list');
  callsList.innerHTML = '';

  calls.forEach(call => {
    const row = document.createElement('tr');
    const date = new Date(call.createdAt).toLocaleString();
    row.innerHTML = `
      <td>${date}</td>
      <td>${call.employeeName}</td>
      <td>${call.type}</td>
      <td>${call.duration} min</td>
      <td>${call.status}</td>
      <td>
        <button class="view-btn" data-id="${call.id}">View</button>
        <button class="delete-btn" data-id="${call.id}">Delete</button>
      </td>
    `;
    callsList.appendChild(row);
  });
}