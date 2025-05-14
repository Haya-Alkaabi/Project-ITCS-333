document.addEventListener('DOMContentLoaded', function() {
    // Utility functions
    function showLoadingSpinner() {
        const spinner = document.createElement('div');
        spinner.id = 'loading-spinner';
        spinner.className = 'fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50';
        spinner.innerHTML = '<div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>';
        document.body.appendChild(spinner);
    }

    function hideLoadingSpinner() {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) spinner.remove();
    }

    // Configuration
    const API_URL = 'includes/formhandlerMiddleRead.php';
    const SUBMIT_URL = 'includes/formhandlerMiddle.php';
    
    // DOM elements
    const monthsDropdown = document.getElementById('monthsDropdown');
    const monthsDropdownMenu = document.getElementById('monthsDropdownMenu');
    const monthOptions = document.querySelectorAll('.month-option');
    const Monheader = document.querySelector('.month-navigation h2');
    const prevBtn = document.querySelector('.month-navigation .nav-buttons button:first-child');
    const nextBtn = document.querySelector('.month-navigation .nav-buttons button:last-child');
    const dateSquares = document.querySelectorAll('.date-square');
    const filterButton = document.getElementById('filterb');
    const filterDropdown = document.getElementById('filterDropdown');
    const filterli = filterDropdown.querySelectorAll('li');
    const sortBtn = document.getElementById('sb');
    const sortDropdown = document.getElementById('sortDropdown');
    const sortOptions = document.querySelectorAll('.sort-option');
    const eventForm = document.getElementById('eForm1');
    const addEventBtn = document.getElementById('eForm');
    const closeEventFormBtn = document.getElementById('closeEventForm');
    const eventFormElement = document.getElementById('addEventForm');

    // State variables
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    let currentFilter = 'none';
    let currentSort = 'date-asc';
    let isReverseOrder = false;
    const events = [];
    let markedDates = [];
    
    // Initialize calendar
    initCalendar();

    function initCalendar() {
        updateCalendar(currentDate);
        fetchEvents();
        setupEventListeners();
    }

    function setupEventListeners() {
        // Month navigation
        prevBtn.addEventListener('click', function() {
            currentDate.setDate(currentDate.getDate() - 7);
            updateCalendar(currentDate, isReverseOrder);
            renderEvents();
        });
        
        nextBtn.addEventListener('click', function() {
            currentDate.setDate(currentDate.getDate() + 7);
            updateCalendar(currentDate, isReverseOrder);
            renderEvents();
        });

        // Month dropdown
        monthsDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
            monthsDropdownMenu.classList.toggle('hidden');
        });

        monthOptions.forEach(option => {
            option.addEventListener('click', function() {
                const selectedMonth = parseInt(this.getAttribute('data-month'));
                navigateToMonth(selectedMonth);
                monthsDropdownMenu.classList.add('hidden');
            });
        });

        // Filter and sort
        filterButton.addEventListener('click', function(e) {
            e.stopPropagation();
            filterDropdown.classList.toggle('hidden');
            sortDropdown.classList.add('hidden');
        });

        sortBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            sortDropdown.classList.toggle('hidden');
            filterDropdown.classList.add('hidden');
        });

        filterli.forEach(li => {
            li.addEventListener('click', function() {
                currentFilter = this.getAttribute('data-filter');
                renderEvents();
                filterDropdown.classList.add('hidden');
            });
        });

        sortOptions.forEach(option => {
            option.addEventListener('click', function() {
                currentSort = this.getAttribute('data-sort');
                isReverseOrder = (currentSort === 'date-desc');
                updateCalendar(currentDate, isReverseOrder);
                renderEvents();
                sortDropdown.classList.add('hidden');
                sortOptions.forEach(opt => opt.classList.remove('bg-gray-100'));
                this.classList.add('bg-gray-100');
            });
        });

        // Event form
        addEventBtn.addEventListener('click', function() {
            eventForm.classList.remove('hidden');
        });

        closeEventFormBtn.addEventListener('click', function() {
            eventForm.classList.add('hidden');
        });

        eventFormElement.addEventListener('submit', handleEventFormSubmit);
    }

    // Calendar functions
    function updateCalendar(date, reverseOrder = false) {
        Monheader.textContent = getMonthName(date.getMonth()) + ' ' + date.getFullYear();
    
        let startOfWeek = date.getDate() - date.getDay();
        let weekDates = [];
        
        for (let i = 0; i < dateSquares.length; i++) {
            let dayDate = new Date(date);
            dayDate.setDate(startOfWeek + i);
            weekDates.push(dayDate);
        }
        
        if (reverseOrder) {
            weekDates.reverse();
        }
        
        for (let i = 0; i < dateSquares.length; i++) {
            let dayDate = weekDates[i];
            dateSquares[i].dataset.date = dayDate.toISOString();
            
            let dayNumber = dateSquares[i].querySelector('.date-number');
            let dayName = dateSquares[i].querySelector('.date-day');
            
            dayNumber.textContent = dayDate.getDate();
            dayName.textContent = getShortDayName(dayDate.getDay());
            
            if (dayDate.getMonth() !== date.getMonth()) {
                dateSquares[i].classList.add('text-gray-400');
            } else {
                dateSquares[i].classList.remove('text-gray-400');
            }
            
            if (isSameDay(dayDate, new Date())) {
                dateSquares[i].classList.add('bg-blue-100');
            } else {
                dateSquares[i].classList.remove('bg-blue-100');
            }
        }
    }

    function getMonthName(monthIndex) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        return months[monthIndex];
    }

    function getShortDayName(dayIndex) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[dayIndex];
    }

    function isSameDay(date1, date2) {
        if (!date1 || !date2) return false;
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }

    function formatTime(timeStr) {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const hourNum = parseInt(hours, 10);
        const period = hourNum >= 12 ? 'PM' : 'AM';
        const displayHour = hourNum % 12 || 12;
        return `${displayHour}:${minutes} ${period}`;
    }

    function navigateToMonth(monthIndex) {
        const now = new Date();
        let targetYear = now.getFullYear();
        let targetMonth = monthIndex;
        
        if (monthIndex < now.getMonth()) {
            targetYear++;
        }
        
        currentDate = new Date(targetYear, targetMonth, 1);
        updateCalendar(currentDate);
        renderEvents();
        
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        monthsDropdown.innerHTML = `<i class="fas fa-calendar-alt mr-1"></i> ${monthNames[monthIndex]}`;
    }

    // Event processing
    function processEvents() {
        let processedEvents = [...events];
        
        if (currentFilter && currentFilter !== 'none') {
            processedEvents = processedEvents.filter(event => {
                const title = event.title.toLowerCase();
                const description = (event.description || '').toLowerCase();
                
                switch (currentFilter) {
                    case 'drop-due-dates':
                        return title.includes('drop') || description.includes('drop') || 
                               title.includes('deadline') || description.includes('deadline');
                    case 'registration-periods':
                        return title.includes('registration') || description.includes('registration') ||
                               title.includes('enroll') || description.includes('enroll');
                    case 'lectures':
                        return title.includes('lecture') || description.includes('lecture');
                    case 'workshops':
                        return title.includes('workshop') || description.includes('workshop');
                    case 'seminars':
                        return title.includes('seminar') || description.includes('seminar');
                    case 'holidays':
                        return title.includes('holiday') || description.includes('holiday');
                    default:
                        return true;
                }
            });
        }
        
        processedEvents.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            const timeA = a.startTime || '00:00';
            const timeB = b.startTime || '00:00';
            const titleA = a.title.toLowerCase();
            const titleB = b.title.toLowerCase();
            
            const timeToMinutes = (time) => {
                const [hours, minutes] = time.split(':').map(Number);
                return hours * 60 + minutes;
            };
            
            switch (currentSort) {
                case 'date-asc':
                    if (dateA - dateB !== 0) return dateA - dateB;
                    return timeToMinutes(timeA) - timeToMinutes(timeB);
                case 'date-desc':
                    if (dateB - dateA !== 0) return dateB - dateA;
                    return timeToMinutes(timeB) - timeToMinutes(timeA);
                case 'title-asc':
                    if (titleA.localeCompare(titleB) !== 0) return titleA.localeCompare(titleB);
                    return dateA - dateB;
                case 'title-desc':
                    if (titleB.localeCompare(titleA) !== 0) return titleB.localeCompare(titleA);
                    return dateA - dateB;
                default:
                    return 0;
            }
        });
        
        return processedEvents;
    }

    //handling form submission

async function handleEventFormSubmit(event) {
    event.preventDefault();

    const title = document.getElementById('eventTitle').value;
    const dateStr = document.getElementById('eventDate').value;
    const startTime = document.getElementById('eventStartTime').value;
    const endTime = document.getElementById('eventEndTime').value;
    const location = document.getElementById('eventLocation').value;
    const description = document.getElementById('eventDescription').value;

    if (!title || !dateStr || !startTime || !endTime) {
        alert('Please fill all required fields');
        return;
    }

    const [year, month, day] = dateStr.split('-');
    const eventDate = new Date(year, month - 1, day);
    eventDate.setHours(0, 0, 0, 0);

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    if (eventDate.getMonth() !== currentMonth || eventDate.getFullYear() !== currentYear) {
        currentDate = new Date(eventDate);
        updateCalendar(currentDate);
    }

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startDateTime = new Date(eventDate);
    startDateTime.setHours(startHour, startMinute);

    const endDateTime = new Date(eventDate);
    endDateTime.setHours(endHour, endMinute);

    const duration = (endDateTime - startDateTime) / (1000 * 60);
    if (startHour < 8 || endHour > 21 || (endHour === 21 && endMinute > 50) || duration > 600) {
        alert('Events must be within working hours (8:00 AM - 9:50 PM) and less than 10 hours.');
        return;
    }

    // Create the event object first
    const newEvent = {
        id: Date.now(), // Temporary ID
        title,
        date: eventDate,
        startTime,
        endTime,
        duration,
        location: location || 'Not specified',
        description: description || 'No description',
        type: 'custom',
        marked: false
    };

    // Add to UI immediately
    events.push(newEvent);
    renderEvents();

    try {
        // Prepare form data
        const formData = new FormData(eventFormElement);
        
        // Submit to server
        const response = await fetch(eventFormElement.action, {
            method: 'POST',
            body: formData
        });

        // Handle both JSON and text responses
        let result;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            result = await response.json();
        } else {
            result = { success: true, message: await response.text() };
        }

        if (!response.ok) {
            throw new Error(result.message || 'Failed to save event');
        }

        // If successful, update the event with the database ID if available
        if (result.eventId) {
            const eventIndex = events.findIndex(e => e.id === newEvent.id);
            if (eventIndex !== -1) {
                events[eventIndex].id = result.eventId;
                events[eventIndex].type = 'database';
            }
        }

        console.log('Event saved successfully:', result);
    } catch (error) {
        console.error('Error saving event:', error);
        // Optionally remove the event from UI if save failed
        const eventIndex = events.findIndex(e => e.id === newEvent.id);
        if (eventIndex !== -1) {
            events.splice(eventIndex, 1);
            renderEvents();
        }
        alert('Error saving event: ' + error.message);
    } finally {
        eventFormElement.reset();
        eventForm.classList.add('hidden');
    }
}






    function calculateDuration(startTime, endTime) {
        const [startH, startM] = startTime.split(':').map(Number);
        const [endH, endM] = endTime.split(':').map(Number);
        return (endH * 60 + endM) - (startH * 60 + startM);
    }

    // Data fetching
    async function fetchEvents() {
        try {
            showLoadingSpinner();
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data || !data.success) {
                throw new Error(data?.message || 'Invalid data format from server');
            }
            
            // Clear existing events but keep local ones
            const localEvents = events.filter(e => e.type === 'local');
            events.length = 0;
            events.push(...localEvents);
            markedDates.length = 0;
            
            // Process database events with more flexible time parsing
            data.events.forEach(dbEvent => {
                try {
                    const eventDate = new Date(dbEvent.date);
                    if (isNaN(eventDate.getTime())) {
                        console.warn(`Invalid date for event ${dbEvent.id}: ${dbEvent.date}`);
                        return;
                    }
                    eventDate.setHours(0, 0, 0, 0);
                    
                    // Normalize time format (HH:MM)
                    const normalizeTime = (time) => {
                        if (!time) return '00:00';
                        // Handle various time formats including AM/PM
                        const timeStr = time.toString().toUpperCase();
                        const hasAM = timeStr.includes('AM');
                        const hasPM = timeStr.includes('PM');
                        
                        let [hours, minutes] = timeStr.replace(/[AP]M/, '').split(':').map(part => parseInt(part.trim()) || 0);
                        
                        if (hasPM && hours < 12) hours += 12;
                        if (hasAM && hours === 12) hours = 0;
                        
                        hours = Math.min(23, Math.max(0, hours));
                        minutes = Math.min(59, Math.max(0, minutes));
                        
                        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                    };
                    
                    const startTime = normalizeTime(dbEvent.startTime);
                    const endTime = normalizeTime(dbEvent.endTime);
                    const duration = calculateDuration(startTime, endTime);
                    
                    events.push({
                        id: dbEvent.id,
                        title: dbEvent.title,
                        date: eventDate,
                        startTime: startTime,
                        endTime: endTime,
                        duration: duration,
                        location: dbEvent.location || 'Not specified',
                        description: dbEvent.description || 'No description',
                        marked: Boolean(dbEvent.marked),
                        type: 'database'
                    });
                    
                    if (dbEvent.marked) {
                        const markedDate = new Date(eventDate);
                        markedDate.setHours(0, 0, 0, 0);
                        markedDates.push(markedDate);
                    }
                } catch (e) {
                    console.error('Error processing event:', dbEvent, e);
                }
            });
            
            updateCalendar(currentDate, isReverseOrder);
            renderEvents();
            updateSmallCalendar();
            
        } catch (error) {
            console.error('Fetch error:', {
                error: error,
                message: error.message,
                stack: error.stack
            });
            alert(`Failed to load events: ${error.message}`);
        } finally {
            hideLoadingSpinner();
        }
    }

    // Rendering functions
    function renderEvents() {
        const existingEvents = document.querySelectorAll('.event-card, .event-cardlarge');
        existingEvents.forEach(event => event.remove());
    
        const displayedDates = [];
        for (let i = 0; i < dateSquares.length; i++) {
            const squareDate = new Date(dateSquares[i].dataset.date);
            squareDate.setHours(0, 0, 0, 0);
            displayedDates.push(squareDate);
        }
    
        const processedEvents = processEvents();
        
        // Filter events that match any of the displayed dates
        const eventsToShow = processedEvents.filter(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            return displayedDates.some(displayedDate => isSameDay(displayedDate, eventDate));
        });
    
        eventsToShow.forEach(event => createTimeChartEvent(event));
    }

    function createTimeChartEvent(event) {
        const timeChart = document.querySelector('.chart-grid');
        if (!timeChart) return;

        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        
        let gridColumn = 0;
        for (let i = 0; i < dateSquares.length; i++) {
            const squareDate = new Date(dateSquares[i].dataset.date);
            squareDate.setHours(0, 0, 0, 0);
            
            if (isSameDay(squareDate, eventDate)) {
                gridColumn = i + 1;
                break;
            }
        }
        
        if (gridColumn === 0) return;
        
        const [startHour, startMinute] = event.startTime.split(':').map(Number);
        const [endHour, endMinute] = event.endTime.split(':').map(Number);
        
        const startMinutes = (startHour * 60 + startMinute) - (8 * 60);
        const endMinutes = (endHour * 60 + endMinute) - (8 * 60);
        const durationMinutes = endMinutes - startMinutes;
        
        const gridRowStart = Math.floor(startMinutes / 30) + 2;
        const rowSpan = Math.max(1, Math.ceil(durationMinutes / 30));
        
        const totalRows = 28;
        if (gridRowStart + rowSpan > totalRows) {
            rowSpan = totalRows - gridRowStart;
        }

        const isShortEvent = durationMinutes <= 60;
        const eventElement = document.createElement('div');
        eventElement.className = `${isShortEvent ? 'event-card group' : 'event-cardlarge'} ${
            event.type === 'database' ? 'database-event' : 'local-event'
        }`;
        
        eventElement.style.gridColumn = gridColumn;
        eventElement.style.gridRow = `${gridRowStart} / span ${rowSpan}`;
        eventElement.style.minHeight = `${rowSpan * 30}px`;

        eventElement.innerHTML = `
            <div class="event-title">${event.title}</div>
            <div class="event-time">${formatTime(event.startTime)} - ${formatTime(event.endTime)}</div>
            <button class="bbnlarge ${isShortEvent ? 'opacity-0 group-hover:opacity-100 transition-opacity' : ''}"
                    data-event-id="${event.id}">Details</button>
        `;

        const detailsButton = eventElement.querySelector('.bbnlarge');
        detailsButton?.addEventListener('click', function(e) {
            e.stopPropagation();
            showEventDetails(event);
        });

        timeChart.appendChild(eventElement);
    }

    // Event details popup
    const detailsPopup = document.createElement('div');
    detailsPopup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden';
    detailsPopup.innerHTML = `
        <div class="bg-white rounded-lg p-6 w-96">
            <h2 class="text-xl font-bold mb-4" id="details-title">Event Details</h2>
            <div class="space-y-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Date:</label>
                    <p id="details-date" class="mt-1"></p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Time:</label>
                    <p id="details-time" class="mt-1"></p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Title:</label>
                    <p id="details-title-text" class="mt-1 font-medium"></p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Location:</label>
                    <p id="details-location" class="mt-1"></p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Description:</label>
                    <p id="details-description" class="mt-1"></p>
                </div>
            </div>
            <div class="mt-6 flex justify-end space-x-3">
                <button id="close-details" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Close</button>
                <button id="delete-event" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                <button id="mark-event" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Mark Event</button>
            </div>
        </div>
    `;
    document.body.appendChild(detailsPopup);

    function showEventDetails(event) {
        document.getElementById('details-title').textContent = event.title;
        document.getElementById('details-date').textContent = event.date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const timeDisplay = event.startTime === '23:59' && event.endTime === '23:59' 
            ? 'All day' 
            : `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`;
        document.getElementById('details-time').textContent = timeDisplay;
        
        document.getElementById('details-title-text').textContent = event.title;
        document.getElementById('details-location').textContent = event.location || 'Not specified';
        document.getElementById('details-description').textContent = event.description || 'No description';
        
        const deleteBtn = document.getElementById('delete-event');
        const markBtn = document.getElementById('mark-event');
        
        // Setup delete button
        deleteBtn.onclick = function() {
            if (confirm('Are you sure you want to delete this event?')) {
                deleteEvent(event);
            }
        };
        
        // Setup mark button
        markBtn.textContent = event.marked ? 'Unmark Event' : 'Mark Event';
        markBtn.classList.toggle('bg-green-500', !event.marked);
        markBtn.classList.toggle('bg-yellow-500', event.marked);
        markBtn.onclick = function() {
            toggleEventMark(event);
        };

        document.getElementById('close-details').onclick = function() {
            detailsPopup.classList.add('hidden');
        };

        detailsPopup.classList.remove('hidden');
    }

async function deleteEvent(event) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
        showLoadingSpinner();
        
        let response;
        if (event.type === 'database') {
            response = await fetch('includes/formhandlerMiddleDelete.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `id=${encodeURIComponent(event.id)}`
            });
            
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error('Server returned non-JSON response');
            }
            
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Delete failed');
            }
        }
        
        // Remove from local state
        const index = events.findIndex(e => e.id === event.id);
        if (index !== -1) {
            events.splice(index, 1);
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            markedDates = markedDates.filter(d => {
                const markedDate = new Date(d);
                markedDate.setHours(0, 0, 0, 0);
                return markedDate.getTime() !== eventDate.getTime();
            });
            renderEvents();
            updateSmallCalendar();
        }
        
        detailsPopup.classList.add('hidden');
    } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete event: ' + error.message);
    } finally {
        hideLoadingSpinner();
    }
}
async function toggleEventMark(event) {
    try {
        showLoadingSpinner();
        const newMarkedStatus = !event.marked;
        
        // Update the event's marked status immediately
        event.marked = newMarkedStatus;
        
        // Get the normalized date (time set to 00:00:00 for comparison)
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        
        // Update markedDates array
        if (newMarkedStatus) {
            // Add to markedDates if not already present
            if (!markedDates.some(d => {
                const markedDate = new Date(d);
                markedDate.setHours(0, 0, 0, 0);
                return markedDate.getTime() === eventDate.getTime();
            })) {
                markedDates.push(eventDate);
            }
        } else {
            // Remove from markedDates
            markedDates = markedDates.filter(d => {
                const markedDate = new Date(d);
                markedDate.setHours(0, 0, 0, 0);
                return markedDate.getTime() !== eventDate.getTime();
            });
        }
        
        // For database events, update on server
        if (event.type === 'database') {
            const response = await fetch('includes/formhandlerMiddleMARK.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `id=${encodeURIComponent(event.id)}&marked=${newMarkedStatus ? '1' : '0'}`
            });
            
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error('Server returned non-JSON response');
            }
            
            const result = await response.json();
            if (!response.ok || !result.success) {
                // Revert changes if server update failed
                event.marked = !newMarkedStatus;
                if (newMarkedStatus) {
                    markedDates = markedDates.filter(d => {
                        const markedDate = new Date(d);
                        markedDate.setHours(0, 0, 0, 0);
                        return markedDate.getTime() !== eventDate.getTime();
                    });
                } else {
                    markedDates.push(eventDate);
                }
                throw new Error(result.message || 'Update failed');
            }
        }
        
        // Update UI
        updateSmallCalendar();
        renderEvents();
        detailsPopup.classList.add('hidden');
    } catch (error) {
        console.error('Mark error:', error);
        alert('Failed to update event: ' + error.message);
    } finally {
        hideLoadingSpinner();
    }
}

    // Small calendar functions

    function updateSmallCalendar() {
    const dayElements = document.querySelectorAll('#calendar-days li:not(.previous-month)');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    dayElements.forEach(dayElement => {
        // Reset classes
        dayElement.className = 'day';
        
        const dayNumber = parseInt(dayElement.textContent.trim());
        if (isNaN(dayNumber)) return;
        
        const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
        dayDate.setHours(0, 0, 0, 0);
        
        // Highlight current day (light blue)
        if (dayDate.getTime() === today.getTime()) {
            dayElement.classList.add('bg-blue-200');
        }
        
        // Check if this date is in markedDates
        const isMarked = markedDates.some(markedDate => {
            const d = new Date(markedDate);
            d.setHours(0, 0, 0, 0);
            return d.getTime() === dayDate.getTime();
        });
        
        // Only apply marked styling if explicitly marked
        if (isMarked) {
            dayElement.classList.add('bg-[#bda887]', 'text-black', 'rounded-full');
        }
    });
}


});