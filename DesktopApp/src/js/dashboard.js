// Dashboard JavaScript

// DOM elements
const employeeCountEl = document.getElementById('employee-count');
const callCountEl = document.getElementById('call-count');
const avgDurationEl = document.getElementById('avg-duration');
const todayCallsEl = document.getElementById('today-calls');
const activityListEl = document.getElementById('activity-list');

// Chart elements
const callDistributionChart = document.getElementById('call-distribution-chart');
const weeklyPerformanceChart = document.getElementById('weekly-performance-chart');

// Initialize dashboard data
function initDashboard() {
  // Static data, since the backend is removed
  const employees = [
    { id: '1', name: 'Alice Johnson' },
    { id: '2', name: 'Bob Williams' },
    { id: '3', name: 'Charlie Brown' },
    { id: '4', name: 'Diana Miller' }
  ];

  const calls = [
    { id: '1', employeeId: '1', customerName: 'Customer A', createdAt: new Date('2025-08-13T10:00:00Z').toISOString(), type: 'Inbound', duration: '5', status: 'Completed' },
    { id: '2', employeeId: '2', customerName: 'Customer B', createdAt: new Date('2025-08-12T11:30:00Z').toISOString(), type: 'Outbound', duration: '12', status: 'Completed' },
    { id: '3', employeeId: '1', customerName: 'Customer C', createdAt: new Date('2025-08-11T14:00:00Z').toISOString(), type: 'Support', duration: '15', status: 'Completed' },
    { id: '4', employeeId: '3', customerName: 'Customer D', createdAt: new Date('2025-08-14T09:00:00Z').toISOString(), type: 'Sales', duration: '8', status: 'Completed' },
    { id: '5', employeeId: '4', customerName: 'Customer E', createdAt: new Date('2025-08-14T11:00:00Z').toISOString(), type: 'Inbound', duration: '7', status: 'Completed' },
    { id: '6', employeeId: '2', customerName: 'Customer F', createdAt: new Date('2025-08-10T16:00:00Z').toISOString(), type: 'Outbound', duration: '20', status: 'Completed' }
  ];

  // Update statistics
  updateStatistics(employees, calls);

  // Initialize charts
  initializeCharts(calls);

  // Update recent activity
  updateRecentActivity(calls, employees);
}

// Update dashboard statistics
function updateStatistics(employees, calls) {
  // Update employee count
  employeeCountEl.textContent = employees.length;
  
  // Update call count
  callCountEl.textContent = calls.length;
  
  // Calculate average call duration
  if (calls.length > 0) {
    const totalDuration = calls.reduce((sum, call) => sum + (parseInt(call.duration) || 0), 0);
    const avgDuration = Math.round(totalDuration / calls.length);
    avgDurationEl.textContent = `${avgDuration} min`;
  } else {
    avgDurationEl.textContent = '0 min';
  }
  
  // Calculate today's calls
  const today = new Date().toISOString().split('T')[0];
  const todayCalls = calls.filter(call => {
    const callDate = new Date(call.createdAt).toISOString().split('T')[0];
    return callDate === today;
  });
  todayCallsEl.textContent = todayCalls.length;
}

// Initialize charts
function initializeCharts(calls) {
  // Call distribution chart (by type)
  const callTypes = ['Inbound', 'Outbound', 'Support', 'Sales'];
  const typeData = callTypes.map(type => {
    return calls.filter(call => call.type === type).length;
  });
  
  new Chart(callDistributionChart, {
    type: 'pie',
    data: {
      labels: callTypes,
      datasets: [{
        data: typeData,
        backgroundColor: [
          'rgba(52, 152, 219, 0.7)',
          'rgba(155, 89, 182, 0.7)',
          'rgba(46, 204, 113, 0.7)',
          'rgba(243, 156, 18, 0.7)'
        ],
        borderColor: [
          'rgba(52, 152, 219, 1)',
          'rgba(155, 89, 182, 1)',
          'rgba(46, 204, 113, 1)',
          'rgba(243, 156, 18, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: 'Call Distribution by Type'
        }
      }
    }
  });
  
  // Weekly performance chart (calls per day)
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayData = Array(7).fill(0);
  
  calls.forEach(call => {
    const date = new Date(call.createdAt);
    const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Adjust to make Monday index 0
    dayData[adjustedIndex]++;
  });
  
  new Chart(weeklyPerformanceChart, {
    type: 'bar',
    data: {
      labels: days,
      datasets: [{
        label: 'Number of Calls',
        data: dayData,
        backgroundColor: 'rgba(52, 152, 219, 0.7)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Calls per Day of Week'
        }
      }
    }
  });
}

// Update recent activity
function updateRecentActivity(calls, employees) {
  // Sort calls by date (newest first)
  const sortedCalls = [...calls].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  
  // Get the 5 most recent calls
  const recentCalls = sortedCalls.slice(0, 5);
  
  // Clear activity list
  activityListEl.innerHTML = '';
  
  if (recentCalls.length === 0) {
    activityListEl.innerHTML = '<p>No recent activity</p>';
    return;
  }
  
  // Add recent calls to activity list
  recentCalls.forEach(call => {
    const employee = employees.find(emp => emp.id === call.employeeId) || { name: 'Unknown' };
    const date = new Date(call.createdAt);
    const formattedDate = date.toLocaleString();
    
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    
    const iconClass = call.type === 'Inbound' ? 'call_received' : 'call_made';
    
    activityItem.innerHTML = `
      <div class="activity-icon">
        ${call.type === 'Inbound' ? '📥' : '📤'}
      </div>
      <div class="activity-content">
        <div class="activity-title">${employee.name} - ${call.customerName} (${call.type})</div>
        <div class="activity-time">${formattedDate}</div>
      </div>
    `;
    
    activityListEl.appendChild(activityItem);
  });
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', initDashboard);

// Refresh dashboard data every 5 minutes - REMOVED as data is static
// setInterval(initDashboard, 5 * 60 * 1000);