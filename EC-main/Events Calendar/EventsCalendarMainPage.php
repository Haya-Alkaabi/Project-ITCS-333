<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Events Details Page</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="Styles.css" rel="stylesheet">
        <link href="Responsiveness.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossorigin="anonymous"
         referrerpolicy="no-referrer" />
         <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Ibarra+Real+Nova:ital,wght@0,400..700;1,400..700&family=Playfair+Display:wght@400..900&display=swap" rel="stylesheet">
</head>

    <body class="overflow-x-hidden ">
 
      <header class="bg-gradient-to-r from-[#053868] to-[#04437e] shadow-lg">

        <div class="flex items-center space-x-3 md:hidden">
          <img src="../Images/uob-logo.png" alt="UOB Logo" class="w-10 h-10 object-contain" />
          <h1 id="LOG" class="text-lg font-bold">UoB | Students' Hub</h1>
        </div>

        <div class="mobile-menu-button md:hidden">

            <button class="menu-icon .RR">
              <svg stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round"  stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg> </button>
        </div>

        <div class="hidden md:block flex-1 px-10 "> <nav >

                <div >
                  <div class="flex items-center space-x-3 ">
                    <img src="../Images/uob-logo.png" alt="UOB Logo" class="w-10 h-10 object-contain" />
                    <h1 id="LOG" class="text-lg font-bold">UoB | Students' Hub</h1>
                  </div>

                    <div class="flex gap-3 mr-auto"> 
                      
                    
                   

                   <a href="#" class="flex items-center py-2 px-4 lg:py-3 lg:px-10 relative group overflow-hidden" onclick="navigateTo('../../index.html')">
                   <span>Home</span>
                   <div></div>
                   <span></span>
                  </a>

                  <script>
                 function navigateTo(url) {
                 window.location.href = url;
                 return false; // Prevents default anchor behavior 
                 } </script>

                        <div class="relative group Dropdown">
                            <a href="#" class="flex items-center py-2 px-4 lg:py-3 lg:px-10 relative group overflow-hidden">
                                <span >Menu</span>
                                <div ></div>
                                <span ></span>
                            </a>

                             <!-- Dropdown Menu -->
                             <div id="MN" >
                              <a href="EventsCalendarMainPage.html">Events Calendar</a>
                              <a href="../../studyFinderFinal\index.html">Study Group Finder</a>
                              <a href="../../Reviews\rev.html">Course Reviews</a>
                              <a href="../../course-notes-work\coursenotes.html">Course Notes</a>
                              <a href="../../course-reviews\CampusNews.html">Campus News</a>
                              <a href="../../Club-Activities\club.html">Club Activities</a>
                              <a href="../../Student-MarketPlace\St_mkt_place.html">Student Marketplace</a>
                          </div>
                        </div>

                        <a href="#" id="loginLink" class="flex  items-center py-2 px-4 lg:py-3 lg:px-10 relative group overflow-hidden">
                            <span >Login</span>
                            <div ></div>
                            <span ></span>
                        </a>

                        <a href="#"  id="signupLink"  class="flex flex-col items-center py-2 px-4 lg:py-3 lg:px-10 relative group overflow-hidden">
                            <span>Sign-up</span>
                            <div ></div>
                            <span ></span>
                        </a>
<a href="#" id="logoutLink" class="flex items-center py-2 px-4 lg:py-3 lg:px-10 relative group overflow-hidden hidden">
    <span>Logout</span>
    <div></div>
    <span></span>
</a>
                        <div id="overlay" class="fixed inset-0 bg-black bg-opacity-50 z-40 hidden"></div>

<!-- Login Modal -->
<div id="loginModal" class="fixed text-black z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-80 hidden">
  <h2 class="text-xl font-semibold mb-4">Login</h2>
  <form id="loginForm" class="space-y-4" action="includes/auth.php" method="POST">
    <input type="email" name="email" placeholder="Email" required class="w-full px-3 py-2 text-black border rounded focus:outline-none focus:ring focus:border-blue-300">
    <input type="password" name="password" placeholder="Password" required class="w-full px-3 text-black  py-2 border rounded focus:outline-none focus:ring focus:border-blue-300">
    <button type="submit" class="w-full bg-[#04437e] text-white py-2 rounded hover:bg-blue-800">Login</button>
  </form>
</div>

<!-- Register Modal -->
<div id="registerModal" class="fixed text-black z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-80 hidden">
  <h2 class="text-xl font-semibold mb-4">Sign Up</h2>
  <form id="registerForm" class="space-y-4" action="includes/auth.php" method="POST">
    <input type="text" name="academic_id" placeholder="Academic ID" required 
           class="w-full px-3 py-2 text-black  border rounded focus:outline-none focus:ring focus:border-blue-300">
    <input type="text" name="username" placeholder="Username" required 
           class="w-full px-3 py-2 border text-black  rounded focus:outline-none focus:ring focus:border-blue-300">
    <input type="email" name="email" placeholder="Email" required 
           class="w-full px-3 py-2 border text-black rounded focus:outline-none focus:ring focus:border-blue-300">
    <input type="password" name="password" placeholder="Password" required 
           class="w-full px-3 py-2 border text-black  rounded focus:outline-none focus:ring focus:border-blue-300">
    <button type="submit" class="w-full bg-[#04437e] text-white py-2 rounded hover:bg-blue-800">
      Register
    </button>
  </form>
  <button class="close-modal mt-4 text-[#04437e] hover:underline w-full">Close</button>
</div>





                    </div>


                    <div class="search @870:mt-10"> <input type="text" placeholder="search" />
                    </div>

                    <div class="flex items-center gap-4">
                      <button class="btn">
                        <svg class="icon" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z"></path>
                         </svg>
                         </button>

                         <button class="btn">
                          <svg class="icon" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2.5a5.5 5.5 0 0 1 3.096 10.047 9.005 9.005 0 0 1 5.9 8.181.75.75 0 1 1-1.499.044 7.5 7.5 0 0 0-14.993 0 .75.75 0 0 1-1.5-.045 9.005 9.005 0 0 1 5.9-8.18A5.5 5.5 0 0 1 12 2.5ZM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z"
                            ></path>
                          </svg>
                        </button>
                    </div>


                </div>
            </nav>

        </div>
    </header>

    <main class="content">
    <section class="content__left ">
     <section class="mx-7 my-2 mt-7 ">
        <div class="main-container shadow-lg ">
            <div class=' calendar-header text-sm md:text-base'>
                <h4 id="calendar-month">T <em>25th</em> </h4>
                <div>
                    <button id="prev-month">
                        <span class="font-bold text-xl btn  "> <svg class="w-4 h-4" stroke="#000080"  viewBox="0 0 24 24">
                            <path  stroke-width="3" d="M15 19l-7-7 7-7"/>
                          </svg></span>
                    </button>
                    <button id="next-month">
                          <span class="font-bold text-xl btn  "> <svg class="w-4 h-4"  stroke="#000080"  viewBox="0 0 24 24">
                            <path  stroke-width="3" d="M9 5l7 7-7 7"/>
                          </svg></span>
                        
                        </button>

                 </div>    
            </div>
   
            <div class="calendar-body">
                <ul class='weekdays text-xs md:text-sm'>
                    <li>M</li>
                    <li>T</li>
                    <li>W</li>
                    <li>T</li>
                    <li>F</li>
                    <li>S</li>
                    <li>S</li>
                </ul>
               
                <ul id="calendar-days" class='days text-xs md:text-sm'>
                    <li class='previous-month'>27</li>
                    <li class='previous-month'>28</li>
                    <li class='previous-month'>29</li>
                    <li class='previous-month'>30</li>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                    <li>4</li>
                    <li>5</li>
                    <li>6</li>
                    <li>7</li>
                    <li>8</li>
                    <li>9</li>
                    <li>10</li>
                    <li>11</li>
                    <li><span class=>12</span><span >3</span></li>
                    <li>13</li>
                    <li>14</li>
                    <li>15</li>
                    <li>16</li>
                    <li>17</li>
                    <li><span >18</span></li>
                    <li>19</li>
                    <li>20</li>
                    <li>21</li>
                    <li>22</li>
                    <li>23</li>
                    <li>24</li>
                    <li>25</li>
                    <li>26</li>
                    <li>27</li>
                    <li><span >28</span><span ></span></li>
                    <li>29</li>
                    <li>30</li>
                    <li>31</li>
                </ul>
            </div>
        </div>
    </section>
 
    <section class="comment-sec flex justify-center" id="commentSection">
      <div class="max-w-2xl md:w-[90%] lg:w-[80%] mx-3 mt-2 p-6 bg-[#fcfbf6] text-[1rem] rounded-lg shadow-md">
          <h2 class="font-semibold mb-2 text-[black]">Comments</h2>
  
          <div class="mb-1 max-h-32 overflow-y-auto custom-scrollbar" id="commentsContainer">
              <!-- Comment 1 -->
              <div class="mb-1 mt-0" id="comment-1">
                  <div class="flex items-start mx-auto">
                      <img src="../Images/pfp.png" class="w-8 h-8 rounded-full object-cover mr-3 mt-1">
                      <div class="flex-1">
                          <div class="flex items-center justify-between">
                              <h3 class="text-[0.87em] text-[black]" id="comment-1-user">202203297</h3>
                              <span class="text-xs text-[#bda887]" id="comment-1-time">2 hours ago</span>
                          </div>
                          <p class="mt-0.59 text-[black] text-[0.8em]" id="comment-1-text">I have an exam at 20th, change the event date!</p>
                          <div class="flex justify-between items-center mt-2">
                              <div class="flex items-center">
                                  <button class="flex items-center text-xs text-[#04437e] hover:text-[#C80000] mr-3" id="comment-1-like">
                                      <svg class="w-3.5 h-3.5 mr-1 fill-none stroke-current stroke-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                                          <path d="M12 21s-6-5.5-9-9c-2.5-3.5-1.5-7.5 2-9 2.5-1.5 5.5-.5 7 2 1.5-2.5 4.5-3.5 7-2 3.5 1.5 4.5 5.5 2 9-3 3.5-9 9-9 9z"></path>
                                      </svg>
                                      <span class="text-[#C80000]"><small id="comment-1-like-count">5</small></span>
                                  </button>
                                  <button class="text-xs text-[#bda887] hover:text-[#C80000]" id="comment-1-reply">
                                      Reply
                                  </button>
                              </div>
                              <button class="text-xs text-[#bda887] hover:text-[#C80000]" id="comment-1-read-more">
                                  Read more
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="border-t border-black my-2"></div>
  
              <!-- Comment 2 -->
              <div class="mb-1 mt-4" id="comment-2">
                  <div class="flex items-start mx-auto">
                      <img src="../Images/pfp.png" class="w-8 h-8 rounded-full object-cover mr-3 mt-1">
                      <div class="flex-1">
                          <div class="flex items-center justify-between">
                              <h3 class="text-[0.87em] text-[black]" id="comment-2-user">202208680</h3>
                              <span class="text-xs text-[#bda887]" id="comment-2-time">10 hours ago</span>
                          </div>
                          <p class="mt-0.59 text-[black] text-[0.8em]" id="comment-2-text">Six midterms right next to each other! Please be more considerate!!</p>
                          <div class="flex justify-between items-center mt-4">
                              <div class="flex items-center">
                                  <button class="flex items-center text-xs text-[#04437e] hover:text-[#C80000] mr-3" id="comment-2-like">
                                      <svg class="w-3.5 h-3.5 mr-1 fill-none stroke-current stroke-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                                          <path d="M12 21s-6-5.5-9-9c-2.5-3.5-1.5-7.5 2-9 2.5-1.5 5.5-.5 7 2 1.5-2.5 4.5-3.5 7-2 3.5 1.5 4.5 5.5 2 9-3 3.5-9 9-9 9z"></path>
                                      </svg>
                                      <span class="text-[#C80000]"><small id="comment-2-like-count">50</small></span>
                                  </button>
                                  <button class="text-xs text-[#bda887] hover:text-[#C80000]" id="comment-2-reply">
                                      Reply
                                  </button>
                              </div>
                              <button class="text-xs text-[#bda887] hover:text-[#C80000]" id="comment-2-read-more">
                                  Read more
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="border-t border-black my-2"></div>

           
          </div>
               <!-- Comment Input Area -->
               <div class="flex items-start" id="commentInputArea">
                <img src="../Images/pfp.png" class="w-8 h-8 rounded-full object-cover mx-0.4 mr-3 mt-0.6">
                <div class="flex-1">
                    <div class="flex items-center border-b border-black pb-3 focus-within:border-blue-500 transition-colors">
                        <input type="text" placeholder="Add a comment..." 
                               class="w-full px-2 py-1 text-sm focus:outline-none placeholder-gray-400" id="commentInput">
                        <button class="ml-2 text-xs px-2 py-1 text-[#bda887] hover:text-[#C80000] transition-colors" id="postComment">
                            Post
                        </button>
                    </div>
                </div>
        
          </div>
      </div>
  </section>

<div class="flex justify-center">
    <section class="sched-temp mt-3 md:w-[90%] lg:w-[80%] flex justify-center shadow-lg">
    <div class="w-full max-w-4xl overflow-x-auto">
      <table class="table-oc" id="course-schedule-table">
        <!-- Table Header -->
        <thead>
          <tr class="shdr">
            <th scope="col" class="sday" data-day="sunday">U</th>
            <th scope="col" class="sday" data-day="monday">M</th>
            <th scope="col" class="sday" data-day="tuesday">T</th>
            <th scope="col" class="sday" data-day="wednesday">W</th>
            <th scope="col" class="sday" data-day="thursday">H</th>
          </tr>
        </thead>
       
        <!-- Table Body - 8 empty rows -->
        <tbody id="schedule-body">
          <!-- Rows 1-8 -->
          <?php for($i=1; $i<=8; $i++): ?>
          <tr class="row" data-row-id="<?= $i ?>">
            <td class="cell" data-day="sunday" data-cell-id="U<?= $i ?>"></td>
            <td class="cell" data-day="monday" data-cell-id="M<?= $i ?>"></td>
            <td class="cell" data-day="tuesday" data-cell-id="T<?= $i ?>"></td>
            <td class="cell" data-day="wednesday" data-cell-id="W<?= $i ?>"></td>
            <td class="cell" data-day="thursday" data-cell-id="H<?= $i ?>"></td>
          </tr>
          <?php endfor; ?>
        </tbody>
      </table>
    </div>
  </section>
</div>
    
<!-- Buttons -->
<section class="mt-4 mb-6 px-3">
  <div class="flex flex-wrap gap-2 justify-center">
    <button title="Add course" class="design-btn mx-3 my-2 courseTablebtn" id="add-course-btn" data-action="add">
      <span>Add</span>
    </button>
    <button title="Delete course" class="design-btn mx-3 my-2 courseTablebtn" id="delete-course-btn" data-action="delete">
      <span>Delete</span>
    </button>
    <button title="Edit course information" class="design-btn mx-3 my-2 courseTablebtn" id="edit-course-btn" data-action="edit">
      <span>Edit</span>
    </button>
  </div>
</section>

<!-- Course Modal -->
<div id="course-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg p-6 w-96">
    <h2 class="text-xl font-bold mb-4" id="modal-title">Add Course</h2>
    <form id="course-form">
      <input type="hidden" id="course-id">
      <input type="hidden" id="cell-id">

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Course Code</label>
        <input type="text" id="course-code" name="course_code" class="w-full px-3 py-2 border rounded" required>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Day</label>
        <input type="text" id="course-day" class="w-full px-3 py-2 border rounded bg-gray-100" readonly>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Start Time</label>
        <input type="time" id="course-time" name="start_time" class="w-full px-3 py-2 border rounded" required>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Location</label>
        <input type="text" id="course-location" name="location" class="w-full px-3 py-2 border rounded" required>
      </div>
      <div class="flex justify-end space-x-3">
        <button type="button" id="cancel-course-btn" class="px-4 py-2 bg-gray-200 rounded">Cancel</button>
        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
      </div>
    </form>
  </div>
</div>

  <!--We added data actiopn for js-->
 
    </section>
   
    <section class="middle"id="eventList">
      <div class="schedule-container" >
        <div class="schedule-header ">
          <div class="month-navigation">
            <h2>April 2024</h2>
            <div class="nav-buttons">
              <button class="text-[#bda887] btn ">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </button>
              <button class="text-[#bda887] btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>

          <section class="relative group">
            <button class="design-btn ml-6" id="monthsDropdown">
              <i class="fas fa-calendar-alt mr-1"></i> Months
            </button>
            <div class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 hidden overflow-hidden" id="monthsDropdownMenu">
              <div class="px-4 py-2 border-b border-gray-200">
                <h4 class="text-sm font-medium text-gray-700">Select a Month</h4>
              </div>
              <div class="overflow-y-auto custom-scrollbar max-h-60"> <!-- Scrollable container -->
                <ul>
                  <li class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center month-option" data-month="0">
                    <i class="fas fa-calendar-alt mr-2 text-xs"></i> January
                  </li>
                  <li class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center month-option" data-month="1">
                    <i class="fas fa-calendar-alt mr-2 text-xs"></i> February
                  </li>
                  <li class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center month-option" data-month="2">
                    <i class="fas fa-calendar-alt mr-2 text-xs"></i> March
                  </li>
                  <li class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center month-option" data-month="3">
                    <i class="fas fa-calendar-alt mr-2 text-xs"></i> April
                  </li>
                  <li class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center month-option" data-month="4">
                    <i class="fas fa-calendar-alt mr-2 text-xs"></i> May
                  </li>
                  <li class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center month-option" data-month="5">
                    <i class="fas fa-calendar-alt mr-2 text-xs"></i> June
                  </li>
                  <li class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center month-option" data-month="6">
                    <i class="fas fa-calendar-alt mr-2 text-xs"></i> July
                  </li>
                  <li class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center month-option" data-month="7">
                    <i class="fas fa-calendar-alt mr-2 text-xs"></i> August
                  </li>
                  <li class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center month-option" data-month="8">
                    <i class="fas fa-calendar-alt mr-2 text-xs"></i> September
                  </li>
                  <li class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center month-option" data-month="9">
                    <i class="fas fa-calendar-alt mr-2 text-xs"></i> October
                  </li>
                  <li class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center month-option" data-month="10">
                    <i class="fas fa-calendar-alt mr-2 text-xs"></i> November
                  </li>
                  <li class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center month-option" data-month="11">
                    <i class="fas fa-calendar-alt mr-2 text-xs"></i> December
                  </li>
                </ul>
              </div>
            </div>
          </section>
        
          <section class="relative group sort-container">
            <button class="design-btn ml-6" id="sb">
              <i class="fa-solid fa-sort mr-1"></i>Sort
            </button>
            <div class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 hidden" id="sortDropdown">
              <div class="px-4 py-2 border-b border-gray-200">
                  <h4 class="text-sm font-medium text-gray-700">Date</h4>
              </div>
              <ul class="py-1">
                  <li class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center sort-option" data-sort="date-asc">
                      <i class="fas fa-arrow-up mr-2 text-xs"></i> Oldest First
                  </li>
                  <li class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center sort-option" data-sort="date-desc">
                      <i class="fas fa-arrow-down mr-2 text-xs"></i> Newest First
                  </li>
              </ul>
              
          </section>

          <section class="relative group mr-auto">
            <button class="design-btn" id="filterb">
              <i class="fa-solid fa-filter mr-1"></i>Filter
            </button>
            <div class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 hidden" id="filterDropdown">
              <div class="px-4 py-2 border-b border-gray-200">
                <h4 class="text-sm font-medium text-gray-700">Filters</h4>
              </div>
              <ul class="py-1">
                <li class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" data-filter="none">
                  <i class="fas fa-times-circle mr-2 text-xs"></i> None (Show All)
                </li>
              </ul>
              
              <div class="px-4 py-2 border-t border-b border-gray-200">
                <h4 class="text-sm font-medium text-gray-700">Academic</h4>
              </div>
              <ul class="py-1">
                <li class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" data-filter="drop-due-dates">
                  <i class="fas fa-calendar-times mr-2 text-xs"></i> Drop Due Dates
                </li>
                <li class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" data-filter="registration-periods">
                  <i class="fas fa-user-plus mr-2 text-xs"></i> Registration Periods
                </li>
                <li class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" data-filter="lectures">
                  <i class="fas fa-chalkboard-teacher mr-2 text-xs"></i> Lectures
                </li>
              </ul>
              
              <div class="px-4 py-2 border-t border-b border-gray-200">
                <h4 class="text-sm font-medium text-gray-700">Events</h4>
              </div>
              <ul class="py-1">
                <li class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" data-filter="workshops">
                  <i class="fas fa-chalkboard-user mr-2 text-xs"></i> Workshops
                </li>
                <li class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" data-filter="seminars">
                  <i class="fas fa-microphone mr-2 text-xs"></i> Seminars
                </li>
              </ul>
              
              <div class="px-4 py-2 border-t border-b border-gray-200">
                <h4 class="text-sm font-medium text-gray-700">Other</h4>
              </div>
              <ul class="py-1">
                <li class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" data-filter="holidays">
                  <i class="fas fa-umbrella-beach mr-2 text-xs"></i> Holidays
                </li>
              </ul>
            </div>
          </section>
          
<section class="relative group">  
  <button class="design-btn" id="eForm">+ Add Event</button>
  <div class="absolute right-0 mt-2 z-10 bg-white rounded-lg shadow-xl p-6 w-80 hidden" id="eForm1">
    <h2 class="text-xl font-bold text-black mb-4">Add New Event</h2>
    
    <form id="addEventForm" class="space-y-2" action="includes/formhandlerMiddle.php" method="POST">
      <div>
        <label class="block text-sm font-medium text-[#001f3f] mb-1">Event Date:</label>
        <input type="date" required id="eventDate" name="EventDate"
               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#bda887]" placeholder="DD/MM/YYYY">
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-[#001f3f] mb-1">Start Time:</label>
          <input type="time" required id="eventStartTime" name="EventStartTime"
                 class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#bda887]">
        </div>
        <div>
          <label class="block text-sm font-medium text-[#001f3f] mb-1">End Time:</label>
          <input type="time" required id="eventEndTime"  name="EventEndTime"
                 class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#bda887]">
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-[#001f3f] mb-1">Event Title:</label>
        <input type="text" required id="eventTitle" name="EventTitle"
               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#bda887]" placeholder="Enter event title">
      </div>
      
      <div>
        <label class="block text-sm font-medium text-[#001f3f] mb-1">Location:</label>
        <input type="text"  id="eventLocation" name="EventLocation"
               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#bda887]" placeholder="e.g. S40-2086">
      </div>
      
      <div>
        <label class="block text-sm font-medium text-[#001f3f] mb-1">Description (Optional):</label>
        <textarea id="eventDescription" name="EventDes" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#bda887] h-20" placeholder="Add any additional details"></textarea>
      </div>
      
      <div class="flex justify-end space-x-3 pt-2">
        <button type="button" id="closeEventForm" class="px-4 py-2 text-gray-600 hover:text-gray-800">Close</button>
        <button type="submit" class="px-4 py-2 bg-[#bda887] text-white rounded hover:bg-[#a9926a]">Submit</button>
      </div>
    </form>
  </div>
</section>
        </div>

        
        
        <div id="delete-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
          <div class="bg-white rounded-lg shadow-xl p-6 w-80">
            <h2 class="text-xl font-bold text-black mb-4">Delete Course</h2>
            <p class="text-gray-700 mb-4">Are you sure you want to delete this course?</p>
            <div class="flex justify-end space-x-3 pt-4">
              <button type="button" id="delete-cancel-btn" class="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
              <button type="button" id="delete-confirm-btn" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
        
        <div class="date-header custom-scrollbar">
          <div class="mrg"></div>
          <div class="date-card">
            <div class="date-square">
              <div class="date-number">13</div>
              <div class="date-day">Sunday</div>
            </div>
            <div class="date-square">
              <div class="date-number">14</div>
              <div class="date-day">Monday</div>
            </div>
            <div class="date-square">
              <div class="date-number">15</div>
              <div class="date-day">Tuesday</div>
            </div>
            <div class="date-square">
              <div class="date-number">16</div>
              <div class="date-day">Wednesday</div>
            </div>
            <div class="date-square">
              <div class="date-number">17</div>
              <div class="date-day">Thursday</div>
            </div>
            <div class="date-square">
              <div class="date-number">16</div>
              <div class="date-day">Friday</div>
            </div>
            <div class="date-square">
              <div class="date-number">17</div>
              <div class="date-day">Saturday</div>
            </div>

          </div>
        </div>
     
        <div class="time-chart ">
          <div class="time-axis">
            <div class="time-label mt-3">8 AM</div>
            <div class="time-label">9 AM</div>
            <div class="time-label">10 AM</div>
            <div class="time-label">11 AM</div>
            <div class="time-label">12 PM</div>
            <div class="time-label">1 PM</div>
            <div class="time-label">2 PM</div>
            <div class="time-label">3 PM</div>
            <div class="time-label">4 PM</div>
            <div class="time-label">5 PM</div>
            <div class="time-label">6 PM</div>
            <div class="time-label">7 PM</div>
            <div class="time-label">8 PM</div>
            <div class="time-label">9 PM</div>
          </div>
          <div class="overflow-x-auto w-full custom-scrollbar"> <!--The events card were making the whole page overflow thus we needed to somehow keep the cards inside the table and shrinking
            was difficult so I opted to enable overflow for the grid chart that contains the cells hence when the cells are about to move outside of their cells overflow occurs
            and the scrolling is triggered -->
            <div class="chart-grid min-w-[800px] relative grid grid-cols-7 gap-2 ">
            <div class="grid-line"></div>
            <div class="grid-line"></div>
            <div class="grid-line"></div>
            <div class="grid-line"></div>
            <div class="grid-line"></div>
            <div class="grid-line"></div>
            <div class="grid-line"></div>
   
    </div></div>
          </div>
        </div>
      </div>
    </section>
</main>
 
<footer class=" text-white p-6 ">
    <div class="container mx-auto ">
        <div class="flex flex-col md:flex-row gap-8 mb-6">
            <div class="md:w-1/3" id="TTL">
                <img src="../Images/uob-logo.png" alt="UOB logo" class="footer-logo">
                <h2 class="text-xl font-bold mb-4">Campus Hub - Connecting Students</h2>
            </div>
 
            <!-- Useful Links -->
            <div class="md:w-1/3" id="TTL">
                <h2 class="text-xl font-bold mb-4">Quick Links</h2>
                <ul class="space-y-2">
                <li><a href="../index.html" class="hover:text-[#f80000]">Home</a></li>
                <li><a href="https://www.uob.edu.bh/admission-requirements/" target="_blank" class="hover:text-[#f80000]">Join UOB</a></li>
                <li><a href="https://www.uob.edu.bh/current-students/" target="_blank" class="hover:text-[#f80000]">Current Students</a></li>
                <li><a href="https://www.uob.edu.bh/future-students/" target="_blank"class="hover:text-[#f80000]">Future Students</a></li>
                <li><a href="https://ucs.uob.edu.bh/" target="_blank"class="hover:text-[#f80000]">Course Schedule</a></li>
                </ul>
            </div>
 
            <div class="md:w-1/3" id="TTL">
                <h2 class="text-xl font-bold mb-4">Resources</h2>
                <ul class="space-y-2">
                    <li><a href="https://www.uob.edu.bh/students-service-center/" target="_blank"class="hover:text-[#f80000]">Help Center</a></li>
                    <li><a href="https://www.uob.edu.bh/contact/" target="_blank"class="hover:text-[#f80000]">Contact Us</a></li>
                    <li><a href="https://www.uob.edu.bh/privacy-policy/" target="_blank"class="hover:text-[#f80000]">Privacy Policy</a></li>
                </ul>
            </div>
        </div>
 
        <!-- Footer Bottom -->
        <div class="border-t border-gray-700 pt-4 text-center text-sm">
            <p>&copy;2025 Campus Hub. All rights reserved.</p>
        </div>
    </div>
</footer>








<script src="MIDDLESEC.js" defer></script>
<script src="../Events Calendar/COMMENTS.js" defer></script>
<script src="../Events Calendar/SCHED.JS" defer></script>
<script src="../Events Calendar/loginSign.js" defer></script>

</body>
</html>