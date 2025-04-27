

   document.addEventListener('DOMContentLoaded', () => {
    /* ───────────────────────── CONSTANTS ───────────────────────── */
    const API_URL = 'https://jsonplaceholder.typicode.com/posts';
    const ITEMS_PER_PAGE = 6;
  
    /* ───────────────────── ELEMENT REFERENCES ──────────────────── */
    const grid            = document.querySelector('.grid');
    const searchInput     = document.querySelector('input[type="text"]');
    const sortSelect      = document.querySelector('select');
    const pagination      = ensurePaginationContainer();
    const subjectFilter   = addSubjectFilter();           // ⬅ dynamic dropdown
    const form            = document.querySelector('form');
  
    /* ───────────────────────── STATE ───────────────────────────── */
    let studyGroups = [];       // full list
    let filtered    = [];       // after search / filter
    let page        = 1;
  
    /* ──────────────────── INITIAL FETCH ───────────────────────── */
    fetchGroups();
  
    /* ──────────────────── EVENT LISTENERS ─────────────────────── */
    if (searchInput)   searchInput.addEventListener('input',  handleSearch);
    if (sortSelect)    sortSelect .addEventListener('change', handleSort);
    if (subjectFilter) subjectFilter.addEventListener('change', handleSearch);
  
    if (form) form.addEventListener('submit', handleFormSubmit);
  
    /* ══════════════════════  FUNCTIONS  ═════════════════════════ */
  
    /* ---------- fetchGroups ---------- */
    async function fetchGroups () {
      showLoading();
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Network response was not ok');
  
        const data = await res.json();
        /* Map placeholder schema → ours & slice to 24 posts for demo */
        studyGroups = data.slice(0, 24).map(p => ({
          id:        p.id,
          title:     p.title,
          body:      p.body,
          subject:   randomSubject(),      // mock subject
          location:  'Zoom',
          meeting:   'TBD',
          contact:   'contact@example.com'
        }));
      } catch (err) {
        console.error(err);
        /* Fallback: static demo data */
        studyGroups = demoData();
      }
      refreshDerivedState();
    }
  
    /* ---------- refreshDerivedState ---------- */
    function refreshDerivedState () {
      buildSubjectOptions();
      handleSearch();        // triggers render + pagination
    }
  
    /* ---------- handleSearch ---------- */
    function handleSearch () {
      const term    = searchInput ? searchInput.value.toLowerCase() : '';
      const subject = subjectFilter.value;
  
      filtered = studyGroups.filter(g => {
        const matchesTerm    = g.title.toLowerCase().includes(term) ||
                               g.body .toLowerCase().includes(term);
        const matchesSubject = subject === 'All' || g.subject === subject;
        return matchesTerm && matchesSubject;
      });
  
      page = 1;                       // reset to first page
      applySort();                    // keeps current sort choice
      renderPage();
    }
  
    /* ---------- handleSort / applySort ---------- */
    function handleSort () { applySort(); renderPage(); }
  
    function applySort () {
      const criterion = sortSelect ? sortSelect.value : 'Newest';
      if (criterion === 'Newest') {
        filtered.sort((a, b) => b.id - a.id);
      } else if (criterion === 'Most Members') {
        /* Fake member-count by string length 🙂 */
        filtered.sort((a, b) => b.body.length - a.body.length);
      }
    }
  
    /* ---------- renderPage ---------- */
    function renderPage () {
      /* slicing for pagination */
      const start = (page - 1) * ITEMS_PER_PAGE;
      const slice = filtered.slice(start, start + ITEMS_PER_PAGE);
  
      grid.innerHTML = '';
      slice.forEach(g => grid.appendChild(renderCard(g)));
  
      buildPagination();
    }
  
    /* ---------- renderCard ---------- */
    function renderCard (g) {
      const card = document.createElement('div');
      card.className =
        'bg-white p-5 rounded-lg shadow hover:shadow-md transition';
  
      card.innerHTML = `
        <span class="inline-block text-xs bg-gray-200 px-2 py-0.5 rounded
                     mb-2">${g.subject}</span>
        <h3 class="text-xl font-semibold mb-1">${g.title}</h3>
        <p  class="text-sm text-gray-600 mb-3">${g.body}</p>
        <a  href="studyDetail.html" data-id="${g.id}"
            class="text-blue-600 hover:underline text-sm">View Details</a>
      `;
  
      /* store selection → localStorage */
      card.querySelector('a').addEventListener('click', () => {
        localStorage.setItem('selectedGroup', JSON.stringify(g));
      });
  
      return card;
    }
  
    /* ---------- buildPagination ---------- */
    function buildPagination () {
      pagination.innerHTML = '';
  
      const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  
      /* Prev */
      pagination.appendChild(pageButton('Prev', page > 1, () => changePage(-1)));
  
      /* page numbers */
      for (let i = 1; i <= totalPages; i++) {
        pagination.appendChild(pageButton(i, true, () => setPage(i), i === page));
      }
  
      /* Next */
      pagination.appendChild(pageButton('Next', page < totalPages,
                                        () => changePage(1)));
  
      /* 🪄 animate! */
      animatePaginationButtons();
    }
  
    function pageButton (text, enabled, cb, active = false) {
      const btn = document.createElement('button');
      btn.textContent = text;
      btn.className = 'px-3 py-1 rounded transition ' +
        (active
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 hover:bg-gray-300');
      if (!enabled) {
        btn.classList.add('opacity-40', 'cursor-not-allowed');
        btn.disabled = true;
      } else {
        btn.addEventListener('click', cb);
      }
      return btn;
    }
  
    function setPage (p) { page = p; renderPage(); }
    function changePage (delta) { setPage(page + delta); }
  
    /* ---------- animation helper ---------- */
    function animatePaginationButtons () {
      pagination.querySelectorAll('button:not(.opacity-40)').forEach(btn => {
        btn.onmouseenter = () => btn.style.transform = 'scale(1.1) translateY(-2px)';
        btn.onmouseleave = () => btn.style.transform = 'scale(1) translateY(0)';
      });
    }
  
    /* ---------- buildSubjectOptions ---------- */
    function buildSubjectOptions () {
      const subjects = Array.from(new Set(studyGroups.map(g => g.subject))).sort();
      subjectFilter.innerHTML = '<option>All</option>' +
        subjects.map(s => `<option>${s}</option>`).join('');
    }
  
    /* ---------- showLoading ---------- */
    function showLoading () {
      grid.innerHTML =
        '<div class="col-span-full text-center py-10 font-semibold">Loading…</div>';
    }
  
    /* ---------- addSubjectFilter ---------- */
    function addSubjectFilter () {
      const select = document.createElement('select');
      select.className = 'px-4 py-2 border rounded-md shadow-sm';
      searchInput.parentNode.insertBefore(select, searchInput.nextSibling);
      return select;
    }
  
    /* ---------- ensurePaginationContainer ---------- */
    function ensurePaginationContainer () {
      let div = document.querySelector('.pagination');
      if (!div) {
        div = document.createElement('div');
        div.className = 'pagination mt-8 flex justify-center space-x-2';
        grid.parentNode.appendChild(div);
      }
      return div;
    }
  
    /* ---------- handleFormSubmit (studyForm.html) ---------- */
    function handleFormSubmit (e) {
      e.preventDefault();
      const inputs = form.querySelectorAll('input[required], textarea[required]');
      let valid = true;
  
      inputs.forEach(inp => {
        if (!inp.value.trim()) {
          valid = false;
          inp.classList.add('border-red-500');
        } else {
          inp.classList.remove('border-red-500');
        }
      });
  
      alert(valid
        ? '✅ Study group created successfully (mock).'
        : '❌ Please fill in all required fields.');
      if (valid) form.reset();
    }
  
    /* ---------- Utilities ---------- */
    function randomSubject () {
      return ['Physics','Math','Chemistry','CS','Biology','Economics']
        [Math.floor(Math.random()*6)];
    }
  
    function demoData () {                         // minimal offline demo
      return [
        { id: 1, title: 'Physics Final Prep', body: 'Solving past exams…',
          subject: 'Physics', meeting:'Thu 6 pm', location:'Zoom',
          contact:'phys@example.com' },
        { id: 2, title: 'Intro to Programming Jam', body: 'C++ help weekly',
          subject: 'CS',      meeting:'Sun 4 pm', location:'Library',
          contact:'cs@example.com' },
        /* …add more if you like … */
      ];
    }
  });
  
  /* ─────────────────── Detail-page population ─────────────────── */
  if (window.location.pathname.endsWith('studyDetail.html')) {
    document.addEventListener('DOMContentLoaded', () => {
      const g = JSON.parse(localStorage.getItem('selectedGroup'));
      if (!g) return;
  
      document.querySelector('h2').textContent              = g.title;
      document.querySelector('p:nth-of-type(1)').innerHTML  = `<strong>Subject:</strong> ${g.subject}`;
      document.querySelector('p:nth-of-type(2)').innerHTML  = `<strong>Meeting Time:</strong> ${g.meeting}`;
      document.querySelector('p:nth-of-type(3)').innerHTML  = `<strong>Location:</strong> ${g.location}`;
      document.querySelector('p:nth-of-type(4)').innerHTML  = `<strong>Contact:</strong> ${g.contact}`;
    });
  }
  