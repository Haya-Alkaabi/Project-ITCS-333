<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Campus hub| student MarketPlace </title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="St_mkt_place.css" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Ibarra+Real+Nova:ital,wght@0,400..700;1,400..700&family=Playfair+Display:wght@400..900&display=swap" rel="stylesheet">
</head>
    <body class="overflow-x-hidden">

        <header > 
            <div>
                <img src="img\uob-logo.png" 
                        alt="UOB Logo">
                <h1 >UoB Students' Hub</h1>
            </div>

            <div class="mobile-menu-button md:hidden">
                <button class="menu-icon">
                  <svg stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round"  stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg> 
                </button>
            </div>
        
            <div class="hidden md:block flex-1 px-10 "> 
                <nav >
                    <div >  
                        <div class="flex gap-3 mr-auto">  
                            <a href="..\index.php" class="flex flex-col items-center py-2 px-4 lg:py-3 lg:px-10 relative group overflow-hidden">
                                <span >Home</span>
                                <div ></div>
                                <span ></span>
                            </a>
        
                            <div class="relative group">
                                <a href="#" class="flex flex-col items-center py-2 px-4 lg:py-3 lg:px-10 relative group overflow-hidden">
                                    <span >Menu</span>
                                    <div ></div>
                                    <span ></span>
                                </a>
                                
                                <!-- Dropdown Menu -->
                                <div id="MN" >
                                    <a href="..\EC-main\Events Calendar\EventsCalendarMainPage.html">Events Calendar</a>
                                    <a href="..\studyFinderFinal\studyFinder.html">Study Group Finder</a>
                                    <a href="..\Reviews\rev.html">Course Reviews</a>
                                    <a href="..\course-notes-work\coursenotes.html">Course Notes</a>
                                    <a href="..\course-reviews\CampusNews.html">Campus News</a>
                                    <a href="..\Club-Activities\club.html">Club Activities</a>
                                    <a href="Student-MarketPlace/St_mkt_place.php">Student Marketplace</a>
                                </div>
                            </div>
        
                            <a href="#" class="flex flex-col items-center py-2 px-4 lg:py-3 lg:px-10 relative group overflow-hidden">
                                <span >Profile</span>
                                <div ></div>
                                <span ></span>
                            </a>
                            
                            <a href="#" class="flex flex-col items-center py-2 px-4 lg:py-3 lg:px-10 relative group overflow-hidden">
                                <span>Help</span>
                                <div ></div>
                                <span ></span>
                            </a>
                        </div>

                        <div class="flex items-center gap-4">
                          
                              
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
        
        <main class="main_container">

            <div class="rounded-lg shadow-md" id = "greeting_container">
                <div id="greeting">
                    <div class="mb-4">
                        <h1 id="greeting_h1">Welcome to Student Marketplace!</h1>
                        <p id="greeting_p">Your one-stop hub for buying, selling, and sharing used books, notes, and study resources. Save money, find what you need, and help fellow students!</p>
                    </div>
                    <div class="greeting_button_group">
                        <a href="itemform.php">
                            <button class="greeting_buttons" >Add an item</button>
                        </a>
                        <a href="#Search-bar">
                            <button class="greeting_buttons">Search for an item</button>
                        </a>
                    </div>
                </div>
                <img src="img/unistud-shre.png" class="w-88 h-auto">
            </div>

            <div class="container mx-auto p-6 flex-wrap my-3">
                <!-- Title -->
                <div class="gap-6 bg-white rounded-lg shadow-md py-1 my-3">
                    <h1 class="text-2xl font-bold  text-blue-900 text-center my-3">Items gallery</h1>
                    
                    <!-- search bar -->
                    <form class="flex flex-col md:flex-row gap-3 mx-3 my-3" id="control-gallery">
                        <div class="flex">
                            <input type="text" placeholder="Search for an item"
                                class="w-full md:w-80 px-3 h-10 rounded-l border-2 border-blue-900 focus:outline-none focus:border-sky-500" id="Search-bar"
                                >
                            <button type="submit" class="bg-blue-900 text-white rounded-r px-2 md:px-3 py-0 md:py-1">Search</button>
                        </div>

                        <!--filter option-->
                        <select id="filter" name="filter"
                            class="w-full h-10 border-2 border-blue-900 focus:outline-none focus:border-sky-500 text-blue-900 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider">
                            <option value="All" selected>All</option>
                            <option value="books">books</option>
                            <option value="notes">notes</option>
                            <option value="External">External Sources</option>
                        </select>

                        <!--sorting control-->
                        <select id="sort" name="sort"
                            class="w-full h-10 border-2 border-blue-900 focus:outline-none focus:border-sky-500 text-blue-900 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider">
                            <option value="All" selected="">Sort by </option>
                            <option value="P-Low">Price (lowest-highest)</option>
                            <option value="P-high">Price (highest-lowest
                            )</option>
                            <option value="review">mostly reviewed</option>
                        </select>
                    </form>
                    
                </div>      
                <div id="loading-indicator" class="hidden fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                    <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-900 border-opacity-75"></div>
                </div>
                <!-- Cards Container -->
                <div class="flex flex-wrap gap-6 bg-white rounded-lg shadow-md" id="cards-container">

                    <!-- items cards -->
                    <div class="p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5  card-wrapper">
                        <div class="card" data-category="books" data-price="15.00">
                            <div class="w-full h-48 flex items-center justify-center bg-gray-100">
                                    <img 
                                    src="img/calculus.jpeg" 
                                    alt="Book 1" 
                                    class="max-h-full max-w-full object-contain" 
                                    >
                            </div>
                          <div class="p-4">
                            <h3 class="font-bold text-lg mb-2">calculus Book</h3>
                            <p class="text-gray-600 mb-2">Nawraa</p>
                            <p class="text-green-600 font-bold">15.00 BD</p>
                          </div>
                        </div>
                      </div>
                      
                      <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-4 card-wrapper hover:cursor-pointer">
                        <div class="card"  data-category="notes" data-price="5.00" onclick="window.location.href='itemDetail.php'">
                            <div class="w-full h-48 flex items-center justify-center bg-gray-100">
                                    <img 
                                    src="img/NE341.png" 
                                    alt="Book 1" 
                                    class="max-h-full max-w-full object-contain" 
                                    >
                            </div>
                          <div class="p-4">
                            <h3 class="font-bold text-lg mb-2">ITNE341 NOTES</h3>
                            <p class="text-gray-600 mb-2">Israa</p>
                            <p class="text-green-600 font-bold">5.00 BD</p>
                          </div>
                        </div>
                      </div>

                      <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-4 card-wrapper">
                        <div class="card" data-category="books" data-price="10.00">
                            <div class="w-full h-48 flex items-center justify-center bg-gray-100">
                                    <img 
                                    src="img/net design.jpg" 
                                    alt="Book 1" 
                                    class="max-h-full max-w-full object-contain" 
                                    >
                            </div>
                          <div class="p-4">
                            <h3 class="font-bold text-lg mb-2">CISCO network design Book</h3>
                            <p class="text-gray-600 mb-2">Fatema</p>
                            <p class="text-green-600 font-bold">10.00 BD</p>
                          </div>
                        </div>
                      </div>

                      <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-4 card-wrapper">
                        <div class="card" data-category="books" data-price="7.00">
                            <div class="w-full h-48 flex items-center justify-center bg-gray-100">
                                    <img 
                                    src="img/marketing.jpg" 
                                    alt="Book 1" 
                                    class="max-h-full max-w-full object-contain" 
                                    >
                            </div>
                          <div class="p-4">
                            <h3 class="font-bold text-lg mb-2">Marketing principle Book</h3>
                            <p class="text-gray-600 mb-2">Walaa</p>
                            <p class="text-green-600 font-bold">7.00 BD</p>
                          </div>
                        </div>
                    </div>  
                    <div id="no-results-message" class="hidden w-full text-center py-8">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <h3 class="mt-2 text-lg font-medium text-gray-900">No items found</h3>
                        <p class="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                    </div>
                </div>
                  
                <!-- Pagination Controls -->
                <div class="flex justify-center items-center gap-4 mt-8">
                    <button id="prev-btn" class="px-4 py-2 bg-[#dec8a4] hover:text-[#c8102e] rounded-md disabled:opacity-50">
                      Previous
                    </button>
                    <div class="pagination flex gap-2"></div>
                    <button id="next-btn" class="px-4 py-2 bg-[#dec8a4] hover:text-[#c8102e] rounded-md disabled:opacity-50">
                      Next
                    </button>
                  </div>
            </div>  
  

        </main>

    <!--Footer-->
    <footer class=" text-white p-6">

        <div class="container mx-auto">
            
            <div class="flex flex-col md:flex-row gap-8 mb-6">

            <div class="md:w-1/3" id="TTL">
                <img src="img\uob-logo.png" alt="UOB logo" class="footer-logo">
                <h2 class="text-xl font-bold mb-4">Campus Hub - Connecting Students</h2>
            </div>
        
            <!-- Useful Links -->
            <div class="md:w-1/3" id="TTL">
                <h2 class="text-xl font-bold mb-4">Quick Links</h2>
                <ul class="space-y-2">
                <li><a href="..\index.php" class="hover:text-[#f80000]">Home</a></li>
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

    <script src="marketPlace-functions.js"></script>
    </body>
</html>