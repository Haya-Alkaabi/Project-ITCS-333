<?php 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Campus Hub | Course Notes</title>
    <link href="notes.css" rel="stylesheet" />
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
</head>
<body>
    <header>
        <div>
            <img src="uobp.png" alt="UOB Logo" />
            <h1>UoB Students' Hub</h1>
        </div>
        <div class="mobile-menu-button md:hidden">
            <button class="menu-icon">
                <svg stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
        </div>
        <div class="hidden md:block flex-1 px-10">
            <nav>
                <div>
                    <div class="flex gap-3 mr-auto">
                        <a href="#" class="flex flex-col items-center py-2 px-4 lg:py-3 lg:px-10 relative group overflow-hidden">
                            <span>Home</span><div></div><span></span>
                        </a>
                        <div class="relative group">
                            <a href="#" class="flex flex-col items-center py-2 px-4 lg:py-3 lg:px-10 relative group overflow-hidden">
                                <span>Menu</span><div></div><span></span>
                            </a>
                            <div id="MN">
                                <a href="#">Events Calendar</a>
                                <a href="#">Study Group Finder</a>
                                <a href="#">Course Reviews</a>
                                <a href="#">Course Notes</a>
                                <a href="#">Campus News</a>
                                <a href="#">Club Activities</a>
                                <a href="#">Student Marketplace</a>
                            </div>
                        </div>
                        <a href="#" class="flex flex-col items-center py-2 px-4 lg:py-3 lg:px-10 relative group overflow-hidden">
                            <span>Setting</span><div></div><span></span>
                        </a>
                        <a href="#" class="flex flex-col items-center py-2 px-4 lg:py-3 lg:px-10 relative group overflow-hidden">
                            <span>Help</span><div></div><span></span>
                        </a>
                    </div>
                    <div class="flex items-center gap-4">
                        <button class="btn">
                            <svg class="icon" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24">
                                <path d="M12 2.5a5.5 5.5 0 0 1 3.096 10.047 9.005 9.005 0 0 1 5.9 8.181.75.75 0 1 1-1.499.044 7.5 7.5 0 0 0-14.993 0 .75.75 0 0 1-1.5-.045 9.005 9.005 0 0 1 5.9-8.18A5.5 5.5 0 0 1 12 2.5ZM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 py-10">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div class="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <input type="text" placeholder="Search items..." class="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <select class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>All Categories</option>
                </select>
            </div>
            <div class="flex gap-2 items-center">
                <span class="text-sm font-medium">Sort by:</span>
                <select class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Newest</option>
                    <option>Oldest</option>
                </select>
            </div>
        </div>

        <!-- Dynamically populated notes go here -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- JS will insert note cards here -->
        </div>

        <!-- Pagination -->
        <div class="mt-10 flex justify-center items-center space-x-2 text-sm">
            <!-- JS will populate pagination buttons -->
        </div>
    </main>

    <!-- Details Page -->
    <section id="detailsPage" class="hidden bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto mt-10">
        <h2 class="text-2xl font-bold mb-6">Comments</h2>
        <div id="comments" class="space-y-4 mb-6"></div>
        <div>
            <h3 class="text-lg font-semibold mb-2">Add a comment</h3>
            <textarea id="commentInput" rows="3" class="w-full border rounded-md p-2 mb-4" placeholder="Write a comment..."></textarea>
            <button id="postComment" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Post Comment</button>
        </div>
        <button id="backButton" class="text-blue-600 hover:underline block mt-6">&larr; Back to Notes</button>
    </section>

    <!-- Create Note Form -->
    <section id="item-form" class="mt-16 bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
        <h2 class="text-2xl font-bold mb-4">Create New Note</h2>
        <form class="space-y-4">
            <div>
                <label class="block font-medium">Course Name <span class="text-red-500">*</span></label>
                <input type="text" required class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter the item title" />
            </div>
            <div>
                <label class="block font-medium">Description <span class="text-red-500">*</span></label>
                <textarea required rows="4" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Briefly describe the item"></textarea>
            </div>
            <div>
                <label class="block font-medium">Date <span class="text-red-500">*</span></label>
                <input type="date" required class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="flex justify-between items-center mt-6">
                <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Submit</button>
            </div>
        </form>
    </section>

    <!-- Footer -->
    <footer class="text-white p-6">
        <div class="container mx-auto">
            <div class="flex flex-col md:flex-row gap-8 mb-6">
                <div class="md:w-1/3" id="TTL">
                    <img src="uobp.png" alt="UOB logo" class="footer-logo" />
                    <h2 class="text-xl font-bold mb-4">Campus Hub - Connecting Students</h2>
                </div>
                <div class="md:w-1/3" id="TTL">
                    <h2 class="text-xl font-bold mb-4">Quick Links</h2>
                    <ul class="space-y-2">
                        <li><a href="#" class="hover:text-[#f80000]">Home</a></li>
                        <li><a href="https://www.uob.edu.bh/admission-requirements/" target="_blank" class="hover:text-[#f80000]">Join UOB</a></li>
                        <li><a href="https://www.uob.edu.bh/current-students/" target="_blank" class="hover:text-[#f80000]">Current Students</a></li>
                        <li><a href="https://www.uob.edu.bh/future-students/" target="_blank" class="hover:text-[#f80000]">Future Students</a></li>
                        <li><a href="https://ucs.uob.edu.bh/" target="_blank" class="hover:text-[#f80000]">Course Schedule</a></li>
                    </ul>
                </div>
                <div class="md:w-1/3" id="TTL">
                    <h2 class="text-xl font-bold mb-4">Resources</h2>
                    <ul class="space-y-2">
                        <li><a href="https://www.uob.edu.bh/students-service-center/" target="_blank" class="hover:text-[#f80000]">Help Center</a></li>
                        <li><a href="https://www.uob.edu.bh/contact/" target="_blank" class="hover:text-[#f80000]">Contact Us</a></li>
                        <li><a href="https://www.uob.edu.bh/privacy-policy/" target="_blank" class="hover:text-[#f80000]">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-700 pt-4 text-center text-sm">
                <p>&copy;2025 Campus Hub. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="cn.js"></script>
</body>
</html>
