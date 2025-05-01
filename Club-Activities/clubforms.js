document.addEventListener('DOMContentLoaded', () => {
  const primaryClubSelect = document.getElementById('primaryClub');
  const secondaryClubSelect = document.getElementById('secondaryClub');
  const registrationForm = document.getElementById('registration-form');
  
  const fetchClubOptions = async () => {
    try {
      const response = await fetch('clubs.json'); // Make sure the path is correct
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const clubsData = await response.json();
      fillClubDropdowns(clubsData);
    } catch (error) {
      console.error('Error fetching club options:', error);
    }
  };


  const fillClubDropdowns = (clubs) => {
    clubs.forEach(club => {
      const primaryOption = document.createElement('option');
      primaryOption.value = club.id;  
      primaryOption.textContent = club.name;
      primaryClubSelect.appendChild(primaryOption);

      const secondaryOption = document.createElement('option');
      secondaryOption.value = club.id;
      secondaryOption.textContent = club.name;
      secondaryClubSelect.appendChild(secondaryOption);
    });
  };
  function resetErrors() {
    document.getElementById("firstName-error").textContent = "";
    document.getElementById("lastName-error").textContent = "";
    document.getElementById("studentId-error").textContent = "";
    document.getElementById("email-error").textContent = "";
    document.getElementById("primaryClub-error").textContent = "";
    document.getElementById("Join-error").textContent = "";
    document.getElementById("terms-error").textContent = "";
}
    function validateForm() {
      resetErrors();
      const firstName = document.getElementById('firstName').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      const studentId = document.getElementById('studentId').value.trim();
      const email = document.getElementById('email').value.trim();
      const primaryClub = document.getElementById('primaryClub').value;
      const Join = document.getElementById('Join').value.trim();
      const terms = document.getElementById('terms').checked;
  
      let isValid = true;
  
      if (!firstName) {
        document.getElementById('firstName-error').textContent = 'First Name is required.';
        isValid = false;
      }
  
      if (!lastName) {
        document.getElementById('lastName-error').textContent = 'Last Name is required.';
        isValid = false;
      }
  
      if (!studentId) {
        document.getElementById('studentId-error').textContent = 'Student ID is required.';
        isValid = false;
      }
  
      if (!email) {
        document.getElementById('email-error').textContent = 'University Email is required.';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('email-error').textContent = 'Invalid email format.';
        isValid = false;
      }
  
       if (primaryClub === "") {
        document.getElementById('primaryClub-error').textContent = 'Please select a primary club.';
        isValid = false;
      }
  
  
      if (!Join) {
        document.getElementById('Join-error').textContent = 'Reason for joining is required.';
        isValid = false;
      }
  
      if (!terms) {
        document.getElementById('terms-error').textContent = 'You must agree to the terms and conditions.';
        isValid = false;
      }
  
      return isValid;
    }
  
    registrationForm.addEventListener('submit', (event) => {
      event.preventDefault();
  
      if (validateForm()) {
        alert('Registration successful (form not actually submitted)!');
      } else {
        alert('Please correct the errors in the form.');
      }
    });
  
    
    fetchClubOptions();
  });
  