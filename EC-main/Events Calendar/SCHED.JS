document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const scheduleBody = document.getElementById('schedule-body');
  const addCourseBtn = document.getElementById('add-course-btn');
  const editCourseBtn = document.getElementById('edit-course-btn');
  const deleteCourseBtn = document.getElementById('delete-course-btn');
  const courseModal = document.getElementById('course-modal');
  const modalTitle = document.getElementById('modal-title');
  const courseForm = document.getElementById('course-form');
  const cancelCourseBtn = document.getElementById('cancel-course-btn');

  // Form inputs
  const courseIdInput = document.getElementById('course-id');
  const courseCodeInput = document.getElementById('course-code');
  const courseDayInput = document.getElementById('course-day');
  const courseTimeInput = document.getElementById('course-time');
  const courseLocationInput = document.getElementById('course-location');

  // State variables
  let currentAction = null;
  let selectedCell = null;
  let selectedCourse = null;
  let isAddModeActive = false;


  // Initialize the schedule
  function initializeSchedule() {
    // Clear all existing tooltips first
    document.querySelectorAll('.add-tooltip').forEach(tooltip => {
      tooltip.remove();
    });

    // Set up cell click handlers
    document.querySelectorAll('.cell:not(.time-cell)').forEach(cell => {
      cell.addEventListener('click', handleCellClick);

      // Add plus icon to empty cells
      if (!cell.querySelector('.schedule-class') && !cell.querySelector('.add-tooltip')) {
        addPlusIconToCell(cell);
      }
    });
  }

  // Add plus icon to empty cell
  function addPlusIconToCell(cell) {
    const plusIcon = document.createElement('div');
    plusIcon.className = 'add-tooltip absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 text-xl cursor-pointer';
    plusIcon.innerHTML = '+';
    plusIcon.style.display = isAddModeActive ? 'block' : 'none';
    cell.appendChild(plusIcon);

    // Show/hide plus icon based on add mode
    cell.addEventListener('mouseenter', () => {
      if (isAddModeActive && !cell.querySelector('.schedule-class')) {
        plusIcon.style.display = 'block';
      }
    });

    cell.addEventListener('mouseleave', () => {
      plusIcon.style.display = 'none';
    });
  }

  // Handle cell clicks
  function handleCellClick(e) {
    const cell = e.currentTarget;
    const courseDiv = cell.querySelector('.schedule-class');

    if (currentAction === 'add') {
      // For adding, select an empty cell
      if (!courseDiv) {
        selectedCell = cell;
        selectedCourse = null;
        openAddModal(cell);
      }
    } else if (currentAction === 'edit' && courseDiv) {
      // For editing, select a cell with a course
      selectedCell = cell;
      selectedCourse = courseDiv;
      openEditModal(courseDiv);
    } else if (currentAction === 'delete' && courseDiv) {
      // For deleting, just remove the course
      selectedCell = cell;
      selectedCourse = courseDiv;
      deleteCourse(courseDiv);
    }
  }

  // Open modal for adding a course
  function openAddModal(cell) {
    modalTitle.textContent = 'Add Course';
    courseIdInput.value = '';
    courseCodeInput.value = '';
    courseDayInput.value = cell.dataset.day;

    // Set time based on row
    const rowTime = cell.closest('.row').dataset.time;
    courseTimeInput.value = `${rowTime}:00`;

    courseLocationInput.value = '';
    courseModal.classList.remove('hidden');
  }

  // Open modal for editing
  function openEditModal(courseDiv) {
    modalTitle.textContent = 'Edit Course';
    courseIdInput.value = courseDiv.dataset.courseId;
    courseCodeInput.value = courseDiv.querySelector('.class-name').textContent;
    courseDayInput.value = selectedCell.dataset.day;

    const classTime = courseDiv.querySelector('.class-time').textContent;
    courseTimeInput.value = `${classTime}:00`;

    courseLocationInput.value = courseDiv.querySelector('.class-location').textContent;
    courseModal.classList.remove('hidden');
  }

  // Delete a course
  function deleteCourse(courseDiv) {
    if (confirm('Are you sure you want to delete this course?')) {
      const cell = courseDiv.closest('.cell');
      cell.removeChild(courseDiv);

      // Add plus icon back to empty cell
      addPlusIconToCell(cell);

      // Check if entire row (excluding time cell) is empty
      const row = cell.closest('.row');
      const cellsInRow = Array.from(row.querySelectorAll('.cell:not(.time-cell)'));
      const allCellsEmpty = cellsInRow.every(
        cell => !cell.querySelector('.schedule-class')
      );

      // Keep at least one data row (after header)
      if (allCellsEmpty && !row.classList.contains('header-row') && scheduleBody.children.length > 2) {
        scheduleBody.removeChild(row);
      }
    }
  }

  // Set action mode (add, edit, delete)
  function setActionMode(action) {
    currentAction = action;
    isAddModeActive = (action === 'add');
    selectedCell = null;
    selectedCourse = null;

    // Update UI to show current mode
    document.querySelectorAll('.cell:not(.time-cell)').forEach(cell => {
      const plusIcon = cell.querySelector('.add-tooltip');
      if (plusIcon) {
        plusIcon.style.display = (isAddModeActive && !cell.querySelector('.schedule-class')) ? 'block' : 'none';
      }

      const courseDiv = cell.querySelector('.schedule-class');
      if (courseDiv) {
        const editBtn = courseDiv.querySelector('.edit-course-btn');
        const deleteBtn = courseDiv.querySelector('.delete-course-btn');

        if (editBtn && deleteBtn) {
          editBtn.style.display = (action === 'edit') ? 'block' : 'none';
          deleteBtn.style.display = (action === 'delete') ? 'block' : 'none';
        }
      }
    });
  }

  // Handle form submission
  function handleFormSubmit(e) {
    e.preventDefault();

    const courseId = courseIdInput.value || `course-${Date.now()}`;
    const courseCode = courseCodeInput.value.trim();
    const day = courseDayInput.value;
    const time = courseTimeInput.value.slice(0, 5); // Get HH:MM format
    const location = courseLocationInput.value.trim();

    if (!courseCode || !time || !location) {
      alert('Please fill in all fields');
      return;
    }

    if (currentAction === 'edit' && selectedCourse) {
      // Update existing course
      selectedCourse.dataset.courseId = courseId;
      selectedCourse.querySelector('.class-name').textContent = courseCode;
      selectedCourse.querySelector('.class-time').textContent = time;
      selectedCourse.querySelector('.class-location').textContent = location;
    } else if (currentAction === 'add' && selectedCell) {
      // Create new course in the selected cell
      const courseDiv = document.createElement('div');
      courseDiv.className = 'schedule-class';
      courseDiv.dataset.courseId = courseId;
      courseDiv.innerHTML = `
        <div class="class-name">${courseCode}</div>
        <div class="class-time">${time}</div>
        <div class="class-location">${location}</div>
        <button class="edit-course-btn" style="display: none;">✏️</button>
        <button class="delete-course-btn" style="display: none;">🗑️</button>
      `;

      // Clear the selected cell and add the new course
      selectedCell.innerHTML = '';
      selectedCell.appendChild(courseDiv);

      // Get current row time
      const currentRow = selectedCell.closest('.row');
      const timeNum = parseInt(time.replace(':', ''));

      // Create new row below (later time) if it doesn't exist
      const newRowTimeBelow = timeNum + 100; // 1 hour later
      createRowIfNeeded(newRowTimeBelow, currentRow, false);
    }

    // Close the modal
    courseModal.classList.add('hidden');

    // Reinitialize event listeners
    initializeSchedule();
    setActionMode(currentAction);
  }

  // Helper function to create a new row if it doesn't exist
  function createRowIfNeeded(timeNum, referenceRow, insertAbove) {
    const rowExists = Array.from(document.querySelectorAll('.row:not(.empty-row-template)'))
      .some(row => parseInt(row.dataset.time) === timeNum);

    if (!rowExists) {
      // Create new row
      const newRow = document.querySelector('.empty-row-template').cloneNode(true);
      newRow.classList.remove('empty-row-template', 'hidden');
      newRow.dataset.time = timeNum.toString().padStart(4, '0');

      // Update time display
      const timeCell = newRow.querySelector('.time-cell');
      timeCell.textContent = formatTimeForDisplay(timeNum);

      // Insert in correct position
      if (insertAbove) {
        scheduleBody.insertBefore(newRow, referenceRow);
      } else {
        scheduleBody.insertBefore(newRow, referenceRow.nextSibling);
      }

      // Add event listeners to the new cells
      newRow.querySelectorAll('.cell:not(.time-cell)').forEach(cell => {
        cell.addEventListener('click', handleCellClick);
        if (!cell.querySelector('.schedule-class')) {
          addPlusIconToCell(cell);
        }
      });
    }
  }

  // Helper function to format time for display
  function formatTimeForDisplay(timeNum) {
    const hours = Math.floor(timeNum / 100);
    const minutes = timeNum % 100;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  // Event listeners
  addCourseBtn.addEventListener('click', () => setActionMode('add'));
  editCourseBtn.addEventListener('click', () => setActionMode('edit'));
  deleteCourseBtn.addEventListener('click', () => setActionMode('delete'));

  cancelCourseBtn.addEventListener('click', () => {
    courseModal.classList.add('hidden');
  });

  courseForm.addEventListener('submit', handleFormSubmit);

  // Initialize the schedule
  initializeSchedule();
});