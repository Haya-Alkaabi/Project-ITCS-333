document.addEventListener('DOMContentLoaded', function() {
    // Loading Spinner Functions
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

    // Month Dropdown Functionality
    const monthsDropdown = document.getElementById('monthsDropdown');
    const monthsDropdownMenu = document.getElementById('monthsDropdownMenu');
    const monthOptions = document.querySelectorAll('.month-option');
    
    monthsDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
        monthsDropdownMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', function() {
        monthsDropdownMenu.classList.add('hidden');
    });

    monthsDropdownMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    monthOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedMonth = parseInt(this.getAttribute('data-month'));
            
            monthOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            navigateToMonth(selectedMonth);
            monthsDropdownMenu.classList.add('hidden');
        });
    });

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

    // Calendar Navigation
    let Monheader = document.querySelector('.month-navigation h2');
    let prevBtn = document.querySelector('.month-navigation .nav-buttons button:first-child');
    let nextBtn = document.querySelector('.month-navigation .nav-buttons button:last-child');
    let dateSquares = document.querySelectorAll('.date-square');
    const API_URL = 'https://681127853ac96f7119a3c427.mockapi.io/api/cal/events';
    
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
    }

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

    // Utility functions
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
        const [hours, minutes] = timeStr.split(':');
        const hourNum = parseInt(hours, 10);
        const period = hourNum >= 12 ? 'PM' : 'AM';
        const displayHour = hourNum % 12 || 12;
        return `${displayHour}:${minutes} ${period}`;
    }

    // Sort and Filter
    const filterButton = document.getElementById('filterb');
    const filterDropdown = document.getElementById('filterDropdown');
    const filterli = filterDropdown.querySelectorAll('li');
    const sortBtn = document.getElementById('sb');
    const sortDropdown = document.getElementById('sortDropdown');
    const sortOptions = document.querySelectorAll('.sort-option');

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

    document.addEventListener('click', function() {
        filterDropdown.classList.add('hidden');
        sortDropdown.classList.add('hidden');
    });

    filterDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    sortDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
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

    // Event Form
    const eventForm = document.getElementById('eForm1');
    const addEventBtn = document.getElementById('eForm');
    const closeEventFormBtn = document.getElementById('closeEventForm');
    const eventFormElement = document.getElementById('addEventForm');

    addEventBtn.addEventListener('click', function() {
        eventForm.classList.remove('hidden');
    });

    closeEventFormBtn.addEventListener('click', function() {
        eventForm.classList.add('hidden');
    });

  eventFormElement.addEventListener('submit', function(event) {
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

    // Check if the event date is in the current month view
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    if (eventDate.getMonth() !== currentMonth || eventDate.getFullYear() !== currentYear) {
        // If not, navigate to that month first
        currentDate = new Date(eventDate);
        updateCalendar(currentDate);
    }

    // Rest of your event creation logic...
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

    const newEvent = {
        id: Date.now(),
        title,
        date: eventDate,
        startTime,
        endTime,
        duration,
        location: location || 'Not specified',
        description: description || 'No description',
        type: 'custom',
        marked: false // Explicitly set to false
    };

    events.push(newEvent);
    renderEvents();
    eventFormElement.reset();
    eventForm.classList.add('hidden');
});

    // Fetch Events
    async function fetchEvents() {
        try {
            showLoadingSpinner();
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const apiEvents = await response.json();
            const existingIds = new Set(events.map(e => e.id));
            
            apiEvents.forEach(apiEvent => {
                try {
                    let eventDate;
                    if (apiEvent.Date.includes('T')) {
                        eventDate = new Date(apiEvent.Date);
                    } else {
                        const dateParts = apiEvent.Date.split('-');
                        eventDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                    }
                    
                    let startTime = apiEvent.StartTime;
                    let endTime = apiEvent.EndTime;
                    
                    if (startTime.includes(' ')) {
                        const [time, period] = startTime.split(' ');
                        let [hours, minutes] = time.split(':');
                        if (period === 'PM' && hours < 12) hours = parseInt(hours) + 12;
                        if (period === 'AM' && hours === '12') hours = '00';
                        startTime = `${hours}:${minutes}`;
                    }
                    
                    if (endTime.includes(' ')) {
                        const [time, period] = endTime.split(' ');
                        let [hours, minutes] = time.split(':');
                        if (period === 'PM' && hours < 12) hours = parseInt(hours) + 12;
                        if (period === 'AM' && hours === '12') hours = '00';
                        endTime = `${hours}:${minutes}`;
                    }
                    
                    const [startH, startM] = startTime.split(':').map(Number);
                    const [endH, endM] = endTime.split(':').map(Number);
                    const duration = (endH * 60 + endM) - (startH * 60 + startM);
                    
                    if (!existingIds.has(apiEvent.ID)) {
                        events.push({
                            id: apiEvent.ID,
                            title: apiEvent.EventTitle,
                            date: eventDate,
                            startTime: startTime,
                            endTime: endTime,
                            duration: duration,
                            location: apiEvent.Location || 'Not specified',
                            description: apiEvent.Description || 'No description',
                            marked: apiEvent.Marked || false,
                            type: 'api'
                        });
                        
                        if (apiEvent.Marked) {
                            const markedDate = new Date(eventDate);
                            markedDate.setHours(0, 0, 0, 0);
                            if (!markedDates.some(d => d.getTime() === markedDate.getTime())) {
                                markedDates.push(markedDate);
                            }
                        }
                    }
                } catch (e) {
                    console.error('Error processing API event:', apiEvent, e);
                }
            });
            
            renderEvents();
            updateSmallCalendar();
        } catch (error) {
            console.error('Error fetching events:', error);
            alert('Failed to load events from server');
        } finally {
            hideLoadingSpinner();
        }
    }

    function renderEvents() {
        const existingEvents = document.querySelectorAll('.event-card, .event-cardlarge');
        existingEvents.forEach(event => event.remove());
    
        // Get all dates that are currently displayed in the calendar
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
        eventElement.className = `${isShortEvent ? 'event-card group' : 'event-cardlarge'} ${event.type === 'api' ? 'api-event' : 'local-event'}`;
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

    // Event Details Popup
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
                <button id="mark-event" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-red-600">Mark Event</button>
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
        
        const existingSource = document.querySelector('#event-source');
        if (existingSource) existingSource.remove();
        
        const detailsSource = document.createElement('div');
        detailsSource.id = 'event-source';
        detailsSource.innerHTML = `
            <label class="block text-sm font-medium text-gray-700">Source:</label>
            <p class="mt-1 ${event.type === 'api' ? 'text-blue-500' : 'text-green-500'}">
                ${event.type === 'api' ? 'Server (API)' : 'Local (Browser)'}
            </p>
        `;
        document.querySelector('#details-description').after(detailsSource);
        
        const deleteBtn = document.getElementById('delete-event');
        if (event.type === 'api') {
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.replace('bg-red-500', 'bg-gray-400');
            deleteBtn.onclick = function() {
                alert('API events cannot be deleted');
            };
        } else {
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.replace('bg-gray-400', 'bg-red-500');
            deleteBtn.onclick = function() {
                if (confirm('Are you sure you want to delete this event?')) {
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
                        detailsPopup.classList.add('hidden');
                    }
                }
            };
        }
        
        const markBtn = document.getElementById('mark-event');
        if (event.type === 'api') {
            markBtn.textContent = event.marked ? 'Unmark Event' : 'Mark Event';
            markBtn.classList.toggle('bg-green-500', !event.marked);
            markBtn.classList.toggle('bg-yellow-500', event.marked);
            markBtn.onclick = function() {
                alert('API events cannot be marked/unmarked');
            };
        } else {
            markBtn.textContent = event.marked ? 'Unmark Event' : 'Mark Event';
            markBtn.classList.toggle('bg-green-500', !event.marked);
            markBtn.classList.toggle('bg-yellow-500', event.marked);
            markBtn.onclick = function() {
                const eventDate = new Date(event.date);
                eventDate.setHours(0, 0, 0, 0);
                
                if (event.marked) {
                    markedDates = markedDates.filter(d => {
                        const markedDate = new Date(d);
                        markedDate.setHours(0, 0, 0, 0);
                        return markedDate.getTime() !== eventDate.getTime();
                    });
                    event.marked = false;
                } else {
                    if (!markedDates.some(d => {
                        const markedDate = new Date(d);
                        markedDate.setHours(0, 0, 0, 0);
                        return markedDate.getTime() === eventDate.getTime();
                    })) {
                        markedDates.push(eventDate);
                    }
                    event.marked = true;
                }
                
                updateSmallCalendar();
                renderEvents();
                detailsPopup.classList.add('hidden');
            };
        }

        document.getElementById('close-details').onclick = function() {
            detailsPopup.classList.add('hidden');
        };

        detailsPopup.classList.remove('hidden');
    }

    detailsPopup.addEventListener('click', function(e) {
        if (e.target === detailsPopup) {
            detailsPopup.classList.add('hidden');
        }
    });

    // Small Calendar
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const calendarMonth = document.getElementById('calendar-month');
    const calendarDays = document.getElementById('calendar-days');
    const highlightBtn = document.getElementById('highlight-button');
    const currentDate2 = new Date();
    let displayedMonth = currentDate2.getMonth();
    let displayedYear = currentDate2.getFullYear();

    updateMonthDisplay();
    renderCalendar();

    prevMonthBtn.addEventListener('click', () => {
        displayedMonth--;
        if (displayedMonth < 0) {
            displayedMonth = 11;
            displayedYear--;
        }
        updateMonthDisplay();
        renderCalendar();
        updateSmallCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        displayedMonth++;
        if (displayedMonth > 11) {
            displayedMonth = 0;
            displayedYear++;
        }
        updateMonthDisplay();
        renderCalendar();
        updateSmallCalendar();
    });

    highlightBtn.addEventListener('click', function() {
        const eventDateElement = document.querySelector('.event-date');
        if (!eventDateElement) return;
        const eventDate = new Date(eventDateElement.textContent);
        if (isNaN(eventDate.getTime())) return;
        markedDates.push({
            date: eventDate.getDate(),
            month: eventDate.getMonth(),
            year: eventDate.getFullYear()
        });
        if (eventDate.getMonth() !== displayedMonth || eventDate.getFullYear() !== displayedYear) {
            displayedMonth = eventDate.getMonth();
            displayedYear = eventDate.getFullYear();
            updateMonthDisplay();
        }
        renderCalendar();
    });

    function updateMonthDisplay() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        calendarMonth.textContent = `${months[displayedMonth]} ${displayedYear}`;
    }

    function updateSmallCalendar() {
        const dayElements = document.querySelectorAll('#calendar-days li:not(.previous-month)');
        dayElements.forEach(dayElement => {
            dayElement.classList.remove('bg-[#bda887]', 'text-black', 'rounded-full');
            const dayNumber = parseInt(dayElement.textContent.trim());
            if (isNaN(dayNumber)) return;
            const dayDate = new Date(displayedYear, displayedMonth, dayNumber);
            dayDate.setHours(0, 0, 0, 0);
            const hasEvent = events.some(event => {
                const eventDate = new Date(event.date);
                eventDate.setHours(0, 0, 0, 0);
                return eventDate.getTime() === dayDate.getTime();
            });
            const isMarked = markedDates.some(d => {
                const markedDate = new Date(d);
                markedDate.setHours(0, 0, 0, 0);
                return markedDate.getTime() === dayDate.getTime();
            });
            if (hasEvent || isMarked) {
                dayElement.classList.add('bg-[#bda887]', 'text-black', 'rounded-full');
            }
        });
    }

    function renderCalendar() {
        const firstDayOfMonth = new Date(displayedYear, displayedMonth, 1);
        const daysInMonth = new Date(displayedYear, displayedMonth + 1, 0).getDate();
        const startDayOfWeek = firstDayOfMonth.getDay();
        const lastDayOfPrevMonth = new Date(displayedYear, displayedMonth, 0).getDate();

        calendarDays.innerHTML = '';

        for (let i = 0; i < startDayOfWeek; i++) {
            const day = lastDayOfPrevMonth - startDayOfWeek + i + 1;
            calendarDays.appendChild(createDayElement(day, true));
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const isCurrentDay = day === currentDate2.getDate() && 
                               displayedMonth === currentDate2.getMonth() && 
                               displayedYear === currentDate2.getFullYear();
            const isMarked = markedDates.some(event => 
                event.date === day && 
                event.month === displayedMonth && 
                event.year === displayedYear);
            calendarDays.appendChild(createDayElement(day, false, isCurrentDay, isMarked));
        }

        const totalCells = Math.ceil((daysInMonth + startDayOfWeek) / 7) * 7;
        const nextMonthDays = totalCells - (daysInMonth + startDayOfWeek);
        for (let i = 1; i <= nextMonthDays; i++) {
            calendarDays.appendChild(createDayElement(i, true));
        }
    }

    function createDayElement(day, isOtherMonth, isCurrentDay = false, isMarked = false) {
        const dayElement = document.createElement('li');
        dayElement.textContent = day;
        if (isOtherMonth) {
            dayElement.className = 'previous-month text-gray-400';
        } else {
            dayElement.className = 'day';
            if (isCurrentDay) {
                dayElement.classList.add('text-[#1d76c9]', 'font-bold');
            }
            if (isMarked) {
                dayElement.classList.add('bg-[#bda887]', 'text-black', 'rounded-full');
            }
        }
        return dayElement;
    }

    // Initialize
    updateSmallCalendar();
});