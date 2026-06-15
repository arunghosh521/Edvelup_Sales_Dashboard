/* ================================================
   EDVELUP BATCH MANAGEMENT SYSTEM — SCRIPT
   Internal Sales Dashboard for Counselor Use
   ================================================ */

// ==========================================
// 1. DATA — Course Information
// ==========================================
const coursesData = [
  {
    id: 'stock-market',
    name: 'Stock Market Trading',
    regularFee: 30000,
    offerFee: 14499,
    discount: 51,
    seatsAllocated: 50,
    registered: 43,
    available: 7,
    status: 'Almost Full',
    statusColor: 'red',
    expectedClosure: 'Within 2 Days',
    offerCategory: 'First 50 Pre-Registered Students'
  },
  {
    id: 'forex',
    name: 'Forex Trading',
    regularFee: 30000,
    offerFee: 14499,
    discount: 51,
    seatsAllocated: 50,
    registered: 38,
    available: 12,
    status: 'Limited Availability',
    statusColor: 'orange',
    expectedClosure: 'Within 5 Days',
    offerCategory: 'First 50 Pre-Registered Students'
  },
  {
    id: 'integrated',
    name: 'Integrated Trading Program',
    regularFee: 40000,
    offerFee: 19999,
    discount: 50,
    seatsAllocated: 50,
    registered: 46,
    available: 4,
    status: 'Closing Soon',
    statusColor: 'red',
    expectedClosure: 'Within 1 Day',
    offerCategory: 'First 50 Pre-Registered Students'
  }
];

// ==========================================
// 2. DATA — Recent Admissions (20 entries)
// ==========================================
const recentAdmissions = [
  { name: 'Akhil Nair', location: 'Kochi', course: 'Stock Market Trading', time: 'Today 10:15 AM' },
  { name: 'Anjali Menon', location: 'Trivandrum', course: 'Forex Trading', time: 'Today 10:42 AM' },
  { name: 'Arun Krishnan', location: 'Kozhikode', course: 'Integrated Trading Program', time: 'Today 11:08 AM' },
  { name: 'Devika Nambiar', location: 'Thrissur', course: 'Stock Market Trading', time: 'Today 11:22 AM' },
  { name: 'Rahul Pillai', location: 'Kochi', course: 'Forex Trading', time: 'Today 11:35 AM' },
  { name: 'Meera Suresh', location: 'Alappuzha', course: 'Integrated Trading Program', time: 'Today 11:48 AM' },
  { name: 'Vishnu Kumar', location: 'Kannur', course: 'Stock Market Trading', time: 'Today 12:05 PM' },
  { name: 'Sreelakshmi R', location: 'Trivandrum', course: 'Forex Trading', time: 'Today 12:18 PM' },
  { name: 'Karthik Menon', location: 'Kochi', course: 'Stock Market Trading', time: 'Today 12:30 PM' },
  { name: 'Priya Warrier', location: 'Malappuram', course: 'Integrated Trading Program', time: 'Today 12:45 PM' },
  { name: 'Vivek Nair', location: 'Kollam', course: 'Forex Trading', time: 'Today 01:02 PM' },
  { name: 'Athira Raj', location: 'Kottayam', course: 'Stock Market Trading', time: 'Today 01:15 PM' },
  { name: 'Santhosh Kumar', location: 'Palakkad', course: 'Integrated Trading Program', time: 'Today 01:32 PM' },
  { name: 'Deepak Mohan', location: 'Kozhikode', course: 'Forex Trading', time: 'Today 01:48 PM' },
  { name: 'Renjith Thomas', location: 'Idukki', course: 'Stock Market Trading', time: 'Today 02:05 PM' },
  { name: 'Lakshmi Priya', location: 'Kochi', course: 'Integrated Trading Program', time: 'Today 02:20 PM' },
  { name: 'Nandana S', location: 'Trivandrum', course: 'Forex Trading', time: 'Today 02:38 PM' },
  { name: 'Jithin Joseph', location: 'Thrissur', course: 'Stock Market Trading', time: 'Today 02:55 PM' },
  { name: 'Arya Devi', location: 'Wayanad', course: 'Integrated Trading Program', time: 'Today 03:10 PM' },
  { name: 'Midhun Das', location: 'Kasaragod', course: 'Forex Trading', time: 'Today 03:28 PM' }
];

// ==========================================
// 3. UTILITY FUNCTIONS
// ==========================================

/** Format amount to ₹XX,XXX */
function formatCurrency(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

/** Get current time formatted as "Today HH:MM AM/PM" */
function formatTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `Today ${hours}:${minutes} ${ampm}`;
}

/** Extract initials from full name */
function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
}

/** Generate a consistent color from a name string */
function generateAvatarColor(name) {
  const colors = [
    '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
    '#1abc9c', '#e67e22', '#8BC500', '#16a085', '#c0392b',
    '#2980b9', '#27ae60', '#d35400', '#8e44ad', '#f1c40f'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/** Get progress bar color class based on occupancy percentage */
function getProgressColor(percentage) {
  if (percentage >= 80) return 'red';
  if (percentage >= 60) return 'orange';
  return 'green';
}

/** Animate a number counting up */
function animateCountUp(element, target, duration = 1200) {
  let start = 0;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    element.textContent = current;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = target;
    }
  }

  requestAnimationFrame(step);
}

// ==========================================
// 4. RENDER — Course Cards
// ==========================================
function renderCourseCards() {
  const grid = document.getElementById('course-cards-grid');
  if (!grid) return;

  grid.innerHTML = coursesData.map(course => {
    const percentage = Math.round((course.registered / course.seatsAllocated) * 100);
    const barColor = getProgressColor(percentage);
    const badgeClass = course.statusColor === 'red' ? 'badge-red' : 'badge-orange';

    return `
      <div class="course-card" id="card-${course.id}">
        <div class="course-card-header">
          <h3>${course.name}</h3>
        </div>
        <div class="course-card-body">
          <div class="fee-section">
            <span class="regular-fee">${formatCurrency(course.regularFee)}</span>
            <span class="offer-fee">${formatCurrency(course.offerFee)}</span>
            <span class="discount-badge">${course.discount}% OFF</span>
          </div>
          <div class="seat-progress-container">
            <div class="seat-progress-bar">
              <div class="seat-progress-fill ${barColor}" style="width: ${percentage}%"></div>
            </div>
            <div class="seat-numbers">
              <div class="seat-num-item">
                <span class="seat-num-value">${course.seatsAllocated}</span>
                <span class="seat-num-label">Allocated</span>
              </div>
              <div class="seat-num-item">
                <span class="seat-num-value">${course.registered}</span>
                <span class="seat-num-label">Registered</span>
              </div>
              <div class="seat-num-item">
                <span class="seat-num-value" style="color: ${course.available <= 7 ? '#e74c3c' : '#f39c12'}">${course.available}</span>
                <span class="seat-num-label">Available</span>
              </div>
            </div>
          </div>
        </div>
        <div class="course-card-footer">
          <span class="status-badge ${badgeClass}">${course.status}</span>
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================
// 5. RENDER — Recent Admissions
// ==========================================
function renderAdmissions() {
  const list = document.getElementById('admissions-list');
  if (!list) return;

  list.innerHTML = recentAdmissions.map(admission => {
    const initials = getInitials(admission.name);
    const avatarColor = generateAvatarColor(admission.name);

    return `
      <div class="admission-entry">
        <div class="admission-avatar" style="background: ${avatarColor}">${initials}</div>
        <div class="admission-info">
          <div class="admission-name">${admission.name} <span class="admission-location">– ${admission.location}</span></div>
          <div class="admission-course">${admission.course}</div>
        </div>
        <div class="admission-time">Registered: ${admission.time}</div>
      </div>
    `;
  }).join('');
}

// ==========================================
// 6. RENDER — Offer Eligibility Counters
// ==========================================
function renderEligibilityCounters() {
  const grid = document.getElementById('eligibility-grid');
  if (!grid) return;

  grid.innerHTML = coursesData.map(course => {
    const colorClass = course.available <= 7 ? 'red' : 'orange';
    const pulseClass = course.available < 10 ? 'pulse-anim' : '';

    return `
      <div class="eligibility-item">
        <div class="eligibility-number ${colorClass} ${pulseClass}">${course.available}</div>
        <div class="eligibility-course">${course.name.replace(' Trading', '').replace(' Program', '')}</div>
        <div class="eligibility-label">Remaining</div>
      </div>
    `;
  }).join('');
}

// ==========================================
// 7. RENDER — Batch Occupancy Chart
// ==========================================
function renderOccupancyChart() {
  const chart = document.getElementById('occupancy-chart');
  if (!chart) return;

  chart.innerHTML = coursesData.map(course => {
    const percentage = Math.round((course.registered / course.seatsAllocated) * 100);
    const barColor = getProgressColor(percentage);
    const heightPx = Math.round((percentage / 100) * 200);

    return `
      <div class="chart-bar-group">
        <div class="chart-bar-percent">${percentage}%</div>
        <div class="chart-bar-wrapper">
          <div class="chart-bar ${barColor}" style="height: ${heightPx}px"></div>
        </div>
        <div class="chart-bar-label">${course.name.replace(' Trading', '').replace(' Program', '')}</div>
      </div>
    `;
  }).join('');
}

// ==========================================
// 8. RENDER — Course Demand Ranking
// ==========================================
function renderDemandRanking() {
  const container = document.getElementById('demand-ranking');
  if (!container) return;

  const sorted = [...coursesData].sort((a, b) => b.registered - a.registered);
  const maxRegistered = sorted[0].registered;

  container.innerHTML = sorted.map((course, index) => {
    const percentage = Math.round((course.registered / course.seatsAllocated) * 100);
    const barWidth = Math.round((course.registered / maxRegistered) * 100);

    return `
      <div class="demand-item">
        <div class="demand-rank">#${index + 1}</div>
        <div class="demand-info">
          <div class="demand-name">${course.name}</div>
          <div class="demand-bar-bg">
            <div class="demand-bar-fill" style="width: ${barWidth}%"></div>
          </div>
        </div>
        <div class="demand-percent">${percentage}%</div>
      </div>
    `;
  }).join('');
}

// ==========================================
// 9. RENDER — Seat Utilization Circles
// ==========================================
function renderUtilization() {
  const grid = document.getElementById('utilization-grid');
  if (!grid) return;

  grid.innerHTML = coursesData.map(course => {
    const percentage = Math.round((course.registered / course.seatsAllocated) * 100);
    const color = percentage >= 80 ? '#e74c3c' : percentage >= 60 ? '#f39c12' : '#8BC500';

    return `
      <div class="utilization-item">
        <div class="utilization-circle" style="background: conic-gradient(${color} ${percentage}%, rgba(255,255,255,0.08) ${percentage}%)">
          <span class="utilization-circle-value">${percentage}%</span>
        </div>
        <div class="utilization-course-name">${course.name.replace(' Trading', '').replace(' Program', '')}</div>
      </div>
    `;
  }).join('');
}

// ==========================================
// 10. AVAILABILITY CHECKER — Dropdown + Dialog
// ==========================================
function populateDropdowns() {
  const select = document.getElementById('course-select');
  const svSelect = document.getElementById('sv-course-select');

  const options = coursesData.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

  if (select) {
    select.innerHTML = '<option value="">— Select Course —</option>' + options;
  }
  if (svSelect) {
    svSelect.innerHTML = '<option value="">— Select Course —</option>' + options;
  }
}

function openAvailabilityDialog(courseId) {
  const course = coursesData.find(c => c.id === courseId);
  if (!course) return;

  const dialog = document.getElementById('availability-dialog');
  const body = document.getElementById('availability-dialog-body');

  body.innerHTML = `
    <div class="modal-data-row">
      <span class="modal-data-label">Course</span>
      <span class="modal-data-value">${course.name}</span>
    </div>
    <div class="modal-data-row">
      <span class="modal-data-label">Total Seats</span>
      <span class="modal-data-value">${course.seatsAllocated}</span>
    </div>
    <div class="modal-data-row">
      <span class="modal-data-label">Seats Filled</span>
      <span class="modal-data-value">${course.registered}</span>
    </div>
    <div class="modal-data-row">
      <span class="modal-data-label">Seats Remaining</span>
      <span class="modal-data-value highlight-red">${course.available}</span>
    </div>
    <div class="modal-data-row">
      <span class="modal-data-label">Offer Eligibility</span>
      <span class="modal-data-value"><span class="status-badge badge-green">AVAILABLE</span></span>
    </div>
    <div class="modal-data-row">
      <span class="modal-data-label">Offer Category</span>
      <span class="modal-data-value">${course.offerCategory}</span>
    </div>
    <div class="modal-data-row">
      <span class="modal-data-label">Expected Closure</span>
      <span class="modal-data-value highlight-red">${course.expectedClosure}</span>
    </div>
    <div class="modal-recommendation">
      <div class="modal-data-label">💡 Recommendation</div>
      <div class="modal-data-value">Advise Student To Reserve Seat Immediately</div>
    </div>
  `;

  // Store current course for actions
  dialog.dataset.currentCourse = courseId;
  dialog.showModal();
}

// ==========================================
// 11. STUDENT VIEW — Screenshot Mode
// ==========================================
function openStudentView(courseId) {
  const course = courseId ? coursesData.find(c => c.id === courseId) : null;
  const dialog = document.getElementById('student-view-dialog');
  const body = document.getElementById('sv-data');
  const footer = document.getElementById('student-view-footer');
  const svSelect = document.getElementById('sv-course-select');

  if (course && svSelect) {
    svSelect.value = course.id;
  }

  if (course) {
    renderStudentViewData(course);
  } else {
    body.innerHTML = '<p style="text-align:center; color:#999; padding:20px;">Select a course above to view eligibility status.</p>';
  }

  footer.textContent = `Generated: ${formatTime()} | Edvelup Academy Internal System`;
  dialog.showModal();
}

function renderStudentViewData(course) {
  const body = document.getElementById('sv-data');
  if (!body) return;

  body.innerHTML = `
    <div class="sv-data-row">
      <span class="sv-data-label">Course</span>
      <span class="sv-data-value">${course.name}</span>
    </div>
    <div class="sv-data-row">
      <span class="sv-data-label">Offer Fee</span>
      <span class="sv-data-value sv-green">${formatCurrency(course.offerFee)}</span>
    </div>
    <div class="sv-data-row">
      <span class="sv-data-label">Regular Fee</span>
      <span class="sv-data-value" style="text-decoration: line-through; color: #999;">${formatCurrency(course.regularFee)}</span>
    </div>
    <div class="sv-data-row">
      <span class="sv-data-label">You Save</span>
      <span class="sv-data-value sv-green">${formatCurrency(course.regularFee - course.offerFee)} (${course.discount}%)</span>
    </div>
    <div class="sv-data-row">
      <span class="sv-data-label">Seats Remaining</span>
      <span class="sv-data-value sv-red">${course.available} of ${course.seatsAllocated}</span>
    </div>
    <div class="sv-data-row">
      <span class="sv-data-label">Offer Status</span>
      <span class="sv-data-value"><span class="sv-status-active">ACTIVE</span></span>
    </div>
    <div class="sv-data-row">
      <span class="sv-data-label">Eligibility</span>
      <span class="sv-data-value">Available Until First 50 Registrations</span>
    </div>
    <div class="sv-data-row">
      <span class="sv-data-label">Expected Closure</span>
      <span class="sv-data-value sv-red">${course.expectedClosure}</span>
    </div>
  `;

  // Update footer timestamp
  const footer = document.getElementById('student-view-footer');
  if (footer) {
    footer.textContent = `Generated: ${formatTime()} | Edvelup Academy Internal System`;
  }
}

// ==========================================
// 12. TOAST NOTIFICATIONS — Live Activity Feed
// ==========================================
let toastIndex = 0;

const activityMessages = recentAdmissions.map(a => ({
  name: a.name,
  course: a.course
}));

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  // Limit to 3 visible toasts
  while (container.children.length >= 3) {
    container.removeChild(container.firstChild);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast-icon">🔔</div>
    <div class="toast-content">
      <div class="toast-title">New Admission Recorded</div>
      <div class="toast-message">${message}</div>
      <div class="toast-time">Just now</div>
    </div>
  `;

  container.appendChild(toast);

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 400);
  }, 5000);
}

function startActivityFeed() {
  setInterval(() => {
    const activity = activityMessages[toastIndex % activityMessages.length];
    showToast(`${activity.name} reserved ${activity.course}`);
    toastIndex++;
  }, 10000);
}

// ==========================================
// 13. VIEWER COUNTER — Simulated
// ==========================================
let currentViewers = 24;

function updateViewerCounter() {
  // Fluctuate between 15 and 35
  const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
  currentViewers = Math.max(15, Math.min(35, currentViewers + change));

  const viewerCountEl = document.getElementById('viewer-count');
  const statViewersEl = document.getElementById('stat-viewers-count');

  if (viewerCountEl) viewerCountEl.textContent = currentViewers;
  if (statViewersEl) animateCountUp(statViewersEl, currentViewers, 600);
}

function startViewerCounter() {
  setInterval(updateViewerCounter, 30000);
}

// ==========================================
// 14. STATS — Animate on Load
// ==========================================
function animateStats() {
  const totalRemaining = coursesData.reduce((sum, c) => sum + c.available, 0);

  const elements = [
    { id: 'stat-viewers-count', target: currentViewers },
    { id: 'stat-daily-count', target: 23 },
    { id: 'stat-weekly-count', target: 87 },
    { id: 'stat-total-remaining', target: totalRemaining }
  ];

  elements.forEach(({ id, target }) => {
    const el = document.getElementById(id);
    if (el) {
      el.dataset.target = target;
      animateCountUp(el, target);
    }
  });
}

// ==========================================
// 15. ACTION HANDLERS
// ==========================================

/** Screenshot button — flash effect + alert */
function handleScreenshot() {
  const modalContent = document.querySelector('#availability-dialog .modal-content');
  if (modalContent) {
    modalContent.classList.add('flash-effect');
    setTimeout(() => modalContent.classList.remove('flash-effect'), 500);
  }
  // Use the Clipboard API if available
  alert('📸 Screenshot Ready!\n\nUse your system screenshot tool:\n• Mac: Cmd + Shift + 4\n• Windows: Win + Shift + S\n\nThe dialog is highlighted for easy capture.');
}

/** Print button */
function handlePrint() {
  window.print();
}

/** Download report as text file */
function handleDownload() {
  const dialog = document.getElementById('availability-dialog');
  const courseId = dialog?.dataset.currentCourse;
  const course = coursesData.find(c => c.id === courseId);

  if (!course) {
    alert('No course selected.');
    return;
  }

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = formatTime();

  const report = `
═══════════════════════════════════════════════
  EDVELUP ACADEMY — BATCH AVAILABILITY REPORT
═══════════════════════════════════════════════

Generated: ${timeStr}
Report Date: ${dateStr}
System: Edvelup Batch Management System

───────────────────────────────────────────────
  COURSE DETAILS
───────────────────────────────────────────────

Course Name:        ${course.name}
Course ID:          ${course.id.toUpperCase()}
Current Intake:     July 2026

───────────────────────────────────────────────
  FEE STRUCTURE
───────────────────────────────────────────────

Regular Fee:        ${formatCurrency(course.regularFee)}
Offer Fee:          ${formatCurrency(course.offerFee)}
Discount:           ${course.discount}%
Savings:            ${formatCurrency(course.regularFee - course.offerFee)}

───────────────────────────────────────────────
  SEAT AVAILABILITY
───────────────────────────────────────────────

Total Seats:        ${course.seatsAllocated}
Seats Filled:       ${course.registered}
Seats Remaining:    ${course.available}
Occupancy:          ${Math.round((course.registered / course.seatsAllocated) * 100)}%
Status:             ${course.status}

───────────────────────────────────────────────
  OFFER INFORMATION
───────────────────────────────────────────────

Offer Eligibility:  AVAILABLE
Offer Category:     ${course.offerCategory}
Expected Closure:   ${course.expectedClosure}

───────────────────────────────────────────────
  RECOMMENDATION
───────────────────────────────────────────────

Advise Student To Reserve Seat Immediately

═══════════════════════════════════════════════
  This is an internal report generated by
  Edvelup Batch Management System.
  For counselor use only.
═══════════════════════════════════════════════
`.trim();

  const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `batch_report_${course.id}_${dateStr}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ==========================================
// 16. EVENT LISTENERS — Setup
// ==========================================
function setupEventListeners() {
  // Availability Checker dropdown
  const courseSelect = document.getElementById('course-select');
  if (courseSelect) {
    courseSelect.addEventListener('change', (e) => {
      if (e.target.value) {
        openAvailabilityDialog(e.target.value);
        // Reset select after opening
        setTimeout(() => { e.target.value = ''; }, 300);
      }
    });
  }

  // Availability Dialog close button
  const availCloseBtn = document.getElementById('availability-dialog-close');
  const availDialog = document.getElementById('availability-dialog');
  if (availCloseBtn && availDialog) {
    availCloseBtn.addEventListener('click', () => availDialog.close());
  }

  // Click on backdrop to close availability dialog
  if (availDialog) {
    availDialog.addEventListener('click', (e) => {
      if (e.target === availDialog) availDialog.close();
    });
  }

  // Screenshot, Print, Download buttons
  const btnScreenshot = document.getElementById('btn-screenshot');
  const btnPrint = document.getElementById('btn-print');
  const btnDownload = document.getElementById('btn-download');

  if (btnScreenshot) btnScreenshot.addEventListener('click', handleScreenshot);
  if (btnPrint) btnPrint.addEventListener('click', handlePrint);
  if (btnDownload) btnDownload.addEventListener('click', handleDownload);

  // Generate Student View button
  const generateBtn = document.getElementById('generate-student-view');
  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      // Use whatever course was last selected, or default to first
      const select = document.getElementById('course-select');
      const courseId = select?.value || coursesData[0].id;
      openStudentView(courseId);
    });
  }

  // Student View Dialog close button
  const svCloseBtn = document.getElementById('student-view-close');
  const svDialog = document.getElementById('student-view-dialog');
  if (svCloseBtn && svDialog) {
    svCloseBtn.addEventListener('click', () => svDialog.close());
  }

  // Click on backdrop to close student view dialog
  if (svDialog) {
    svDialog.addEventListener('click', (e) => {
      if (e.target === svDialog) svDialog.close();
    });
  }

  // Student View course selector
  const svSelect = document.getElementById('sv-course-select');
  if (svSelect) {
    svSelect.addEventListener('change', (e) => {
      if (e.target.value) {
        const course = coursesData.find(c => c.id === e.target.value);
        if (course) renderStudentViewData(course);
      }
    });
  }
}

// ==========================================
// 17. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Render all components
  renderCourseCards();
  renderAdmissions();
  renderEligibilityCounters();
  renderOccupancyChart();
  renderDemandRanking();
  renderUtilization();

  // Populate dropdowns
  populateDropdowns();

  // Setup event listeners
  setupEventListeners();

  // Animate stat counters
  setTimeout(animateStats, 300);

  // Start live feeds
  startActivityFeed();
  startViewerCounter();

  // Show initial toast after 3 seconds
  setTimeout(() => {
    showToast('Akhil Nair reserved Stock Market Trading');
  }, 3000);

  console.log('✅ Edvelup Batch Management System loaded successfully.');
});
