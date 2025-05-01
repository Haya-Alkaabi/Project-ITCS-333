document.addEventListener('DOMContentLoaded', () => {
  //  You've got the basic idea of assigning variables, which is good!

  const clubListContainer = document.querySelector('.list');
  const searchInput = document.querySelector('.search-bar');
  const filterDropdown = document.querySelector('.filter-dropdown');

  // error and loading messages
  const loadmsg = document.createElement('p');
  loadmsg.textContent = 'Loading clubs...';
  const errorMessage = document.createElement('p');
  errorMessage.textContent = 'Error loading clubs.';
  errorMessage.style.color = 'red';

  //  so the loading message before the list
  clubListContainer.before(loadmsg);

  //  an array for the list of arrays  <-  Correction:  array for the list of clubs (objects)
  let allClubs = [];
  //  to respond to users request async
  const fetchClubs = async () => {
    try {
      //  await to pause execution
      const response = await fetch('clubs1.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      allClubs = data;
      displayClubs(allClubs); // Corrected function name to displayClubs
      loadmsg.style.display = 'none';
    } catch (error) {
      console.error('Error fetching clubs:', error);
      loadmsg.style.display = 'none';
      clubListContainer.before(errorMessage);
    }
  };
  const displayClubs = (clubs) => { // Corrected function name to displayClubs
    clubListContainer.innerHTML = '';
    if (clubs.length === 0) {
      clubListContainer.innerHTML = '<p>No clubs found matching your criteria.</p>';
      return;
    }
    clubs.forEach(club => {
      const clubDiv = document.createElement('div');
      clubDiv.classList.add('list-content');
      const imgContainer = document.createElement('div');
      imgContainer.classList.add('image-container');
      const image = document.createElement('img'); // Corrected from document.add to document.createElement
      image.classList.add('picturelist');
      image.src = club.image;
      image.alt = club.name;
      imgContainer.appendChild(image);

      const nameParagraph = document.createElement('p');
      nameParagraph.textContent = club.name;
      const descriptionParagraph = document.createElement('p');
      descriptionParagraph.textContent = club.description;

      const learnMoreButton = document.createElement('button');
      learnMoreButton.classList.add('list-button');
      learnMoreButton.textContent = 'Learn More';

      learnMoreButton.addEventListener('click', () => {
        alert(`Learn more about ${club.name}!  Description: ${club.description}`);
      })
      clubDiv.appendChild(imgContainer);
      clubDiv.appendChild(nameParagraph);
      clubDiv.appendChild(learnMoreButton);
      clubListContainer.appendChild(clubDiv); // corrected from clubDiv.appendChild(clubDiv);
    });
  };
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredClub = allClubs.filter(club =>  // Corrected from filteredClubs to filteredClub and allClubs.filter
      club.name.toLowerCase().includes(searchTerm) || club.description.toLowerCase().includes(searchTerm) // added .includes
    );
    displayClubs(filteredClub); // Corrected to displayClubs
  });
  filterDropdown.addEventListener('change', (e) => { // Changed 'range' to 'change'
    const selectedC = e.target.value;
    const filteredByCategory = selectedC
      ? allClubs.filter(club => club.category === selectedC)
      : allClubs;
    displayClubs(filteredByCategory); // Corrected to displayClubs
  });
  fetchClubs();
})