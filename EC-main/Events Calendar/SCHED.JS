document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const scheduleBody = document.getElementById('schedule-body');
    const addCourseBtn = document.getElementById('add-course-btn');
    const editCourseBtn = document.getElementById('edit-course-btn');
    const deleteCourseBtn = document.getElementById('delete-course-btn');
    const courseModal = document.getElementById('course-modal');
    const modalTitle = document.getElementById('modal-title');
    const courseForm = document.getElementById('course-form');
    const cancelCourseBtn = document.getElementById('cancel-course-btn');

    // Input fields
    const courseIdInput = document.getElementById('course-id');
    const cellIdInput = document.getElementById('cell-id');
    const courseCodeInput = document.getElementById('course-code');
    const courseDayInput = document.getElementById('course-day');
    const courseTimeInput = document.getElementById('course-time');
    const courseLocationInput = document.getElementById('course-location');

    // Variables
    let currentAction = null;
    let selectedCell = null;
    let selectedCourse = null;
    let isAddModeActive = false;

    // Event Listeners
    addCourseBtn.addEventListener('click', () => setActionMode('add'));
    editCourseBtn.addEventListener('click', () => setActionMode('edit'));
    deleteCourseBtn.addEventListener('click', () => setActionMode('delete'));
    cancelCourseBtn.addEventListener('click', closeModal);
    courseForm.addEventListener('submit', handleFormSubmit);

    // Initialize
    loadCourses();
    initializeSchedule();

    function initializeSchedule() {
        document.querySelectorAll('.add-tooltip').forEach(tooltip => {
            tooltip.remove();
        });

        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', handleCellClick);

            if (!cell.querySelector('.schedule-class') && !cell.querySelector('.add-tooltip')) {
                addPlusIconToCell(cell);
            }
        });
    }

    function addPlusIconToCell(cell) {
        const plusIcon = document.createElement('div');
        plusIcon.className = 'add-tooltip absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 text-xl cursor-pointer';
        plusIcon.innerHTML = '+';
        plusIcon.style.display = isAddModeActive ? 'block' : 'none';
        cell.appendChild(plusIcon);

        cell.addEventListener('mouseenter', () => {
            if (isAddModeActive && !cell.querySelector('.schedule-class')) {
                plusIcon.style.display = 'block';
            }
        });

        cell.addEventListener('mouseleave', () => {
            plusIcon.style.display = 'none';
        });
    }

    function handleCellClick(e) {
        const cell = e.currentTarget;
        const courseDiv = cell.querySelector('.schedule-class');

        if (currentAction === 'add') {
            if (!courseDiv) {
                selectedCell = cell;
                selectedCourse = null;
                openAddModal(cell);
            }
        } else if (currentAction === 'edit' && courseDiv) {
            selectedCell = cell;
            selectedCourse = courseDiv;
            openEditModal(courseDiv);
        } else if (currentAction === 'delete' && courseDiv) {
            selectedCell = cell;
            selectedCourse = courseDiv;
            deleteCourse(courseDiv);
        }
    }

    function openAddModal(cell) {
        modalTitle.textContent = 'Add Course';
        selectedCell = cell;
        
        // Reset form
        courseIdInput.value = '';
        cellIdInput.value = cell.dataset.cellId || '';
        courseCodeInput.value = '';
        courseDayInput.value = cell.dataset.day ? cell.dataset.day.charAt(0).toUpperCase() + cell.dataset.day.slice(1) : '';
        
        // Set time from row if available
        const rowTime = cell.closest('.row')?.dataset.time;
        courseTimeInput.value = rowTime ? (rowTime.includes(':') ? rowTime : `${rowTime}:00`) : '';
        
        courseLocationInput.value = '';
        courseModal.classList.remove('hidden');
    }

    function openEditModal(courseDiv) {
        modalTitle.textContent = 'Edit Course';
        
        // Fill form with existing data
        courseIdInput.value = courseDiv.dataset.courseId;
        cellIdInput.value = courseDiv.closest('.cell').dataset.cellId || '';
        courseCodeInput.value = courseDiv.querySelector('.class-name').textContent;
        courseDayInput.value = courseDiv.closest('.cell').dataset.day.charAt(0).toUpperCase() + 
                              courseDiv.closest('.cell').dataset.day.slice(1);
        courseTimeInput.value = courseDiv.querySelector('.class-time').textContent;
        courseLocationInput.value = courseDiv.querySelector('.class-location').textContent;
        
        courseModal.classList.remove('hidden');
    }

    function closeModal() {
        courseModal.classList.add('hidden');
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('course_code', courseCodeInput.value);
        formData.append('day', courseDayInput.value.toLowerCase());
        formData.append('start_time', courseTimeInput.value);
        formData.append('location', courseLocationInput.value);
        formData.append('cell_id', cellIdInput.value);
        
        let url, method;
        if (currentAction === 'add') {
            url = 'includes/formhandlerSchedAdd.php';
            method = 'POST';
        } else {
            url = 'includes/formhandlerSchedEdit.php';
            method = 'POST';
            formData.append('id', courseIdInput.value);
        }
        
        try {
            const response = await fetch(url, {
                method: method,
                body: formData
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Operation failed');
            }
            
            if (currentAction === 'add') {
                addCourseToCell(data.course);
            } else {
                updateCourseInCell(data.course);
            }
            
            closeModal();
            initializeSchedule(); // Reinitialize to update UI
            alert(data.message || 'Operation successful');
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        }
    }

    function addCourseToCell(course) {
        const cell = document.querySelector(`.cell[data-cell-id="${course.cell_id}"]`);
        if (cell) {
            cell.innerHTML = createCourseHTML(course);
        }
    }

    function updateCourseInCell(course) {
        const courseDiv = document.querySelector(`.schedule-class[data-course-id="${course.id}"]`);
        if (courseDiv) {
            courseDiv.innerHTML = `
                <div class="class-name">${course.course_code}</div>
                <div class="class-time">${course.start_time}</div>
                <div class="class-location">${course.location}</div>
                <button class="edit-course-btn" style="display: none;">✏️</button>
                <button class="delete-course-btn" style="display: none;">🗑️</button>
            `;
            courseDiv.dataset.courseId = course.id;
        }
    }

    async function deleteCourse(courseDiv) {
        if (!confirm('Are you sure you want to delete this course?')) return;
        
        const courseId = courseDiv.dataset.courseId;
        
        try {
            const response = await fetch('includes/formhandlerSchedDelete.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `id=${courseId}`
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Delete failed');
            }
            
            courseDiv.remove();
            const cell = selectedCell;
            if (cell && !cell.querySelector('.schedule-class')) {
                addPlusIconToCell(cell);
            }
            alert('Course deleted successfully');
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        }
    }

    function createCourseHTML(course) {
        return `
        <div class="schedule-class" data-course-id="${course.id}">
            <div class="class-name">${course.course_code}</div>
            <div class="class-time">${course.start_time}</div>
            <div class="class-location">${course.location}</div>
            <button class="edit-course-btn" style="display: none;">✏️</button>
            <button class="delete-course-btn" style="display: none;">🗑️</button>
        </div>`;
    }

    async function loadCourses() {
        try {
            const response = await fetch('includes/fetchCourses.php');
            const courses = await response.json();
            
            // Clear existing courses
            document.querySelectorAll('.schedule-class').forEach(el => el.remove());
            
            // Add courses to their cells
            courses.forEach(course => {
                const cell = document.querySelector(`.cell[data-cell-id="${course.cell_id}"]`);
                if (cell) {
                    cell.innerHTML = createCourseHTML(course);
                }
            });
            initializeSchedule();
        } catch (error) {
            console.error('Error loading courses:', error);
        }
    }

    function setActionMode(action) {
        currentAction = action;
        isAddModeActive = (action === 'add');
        
        // Update UI based on mode
        document.querySelectorAll('.cell').forEach(cell => {
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
});