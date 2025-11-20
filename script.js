// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('navMenu');
const navToggle = document.getElementById('navToggle');
const themeSwitch = document.getElementById('themeSwitch');
const backToTop = document.getElementById('backToTop');
const subjectForm = document.getElementById('subjectForm');
const subjectsList = document.getElementById('subjectsList');
const timerMinutes = document.getElementById('timerMinutes');
const timerSeconds = document.getElementById('timerSeconds');
const timerProgress = document.getElementById('timerProgress');
const startTimerBtn = document.getElementById('startTimer');
const pauseTimerBtn = document.getElementById('pauseTimer');
const resetTimerBtn = document.getElementById('resetTimer');
const timerModeBtns = document.querySelectorAll('.timer-mode-btn');
const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const newQuoteBtn = document.getElementById('newQuote');
const contactForm = document.getElementById('contactForm');

// App State
let subjects = JSON.parse(localStorage.getItem('subjects')) || [];
let timerInterval;
let timerMode = 'study'; // 'study' or 'break'
let timerRunning = false;
let timeLeft = 25 * 60; // 25 minutes in seconds
let totalTime = 25 * 60;

// Motivational Quotes
const quotes = [
    {
        text: "Education is the most powerful weapon which you can use to change the world.",
        author: "Nelson Mandela"
    },
    {
        text: "The beautiful thing about learning is that no one can take it away from you.",
        author: "B.B. King"
    },
    {
        text: "The expert in anything was once a beginner.",
        author: "Helen Hayes"
    },
    {
        text: "Don't let what you cannot do interfere with what you can do.",
        author: "John Wooden"
    },
    {
        text: "Success is the sum of small efforts, repeated day in and day out.",
        author: "Robert Collier"
    },
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt"
    },
    {
        text: "It does not matter how slowly you go as long as you do not stop.",
        author: "Confucius"
    },
    {
        text: "You are never too old to set another goal or to dream a new dream.",
        author: "C.S. Lewis"
    },
    {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
    }
];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after 1.5 seconds
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 1500);
    
    // Initialize subjects from localStorage
    renderSubjects();
    
    // Initialize timer
    updateTimerDisplay();
    
    // Initialize random quote
    displayRandomQuote();
    
    // Set up event listeners
    setupEventListeners();
    
    // Set up scroll animations
    setupScrollAnimations();
});

// Event Listeners
function setupEventListeners() {
    // Nav toggle for mobile
    navToggle.addEventListener('click', toggleNavMenu);
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleNavMenu();
            }
        });
    });
    
    // Theme toggle
    themeSwitch.addEventListener('change', toggleTheme);
    
    // Back to top button
    backToTop.addEventListener('click', scrollToTop);
    
    // Subject form submission
    subjectForm.addEventListener('submit', addSubject);
    
    // Timer controls
    startTimerBtn.addEventListener('click', startTimer);
    pauseTimerBtn.addEventListener('click', pauseTimer);
    resetTimerBtn.addEventListener('click', resetTimer);
    
    // Timer mode buttons
    timerModeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            setTimerMode(this.dataset.mode);
        });
    });
    
    // New quote button
    newQuoteBtn.addEventListener('click', displayRandomQuote);
    
    // Contact form submission
    contactForm.addEventListener('submit', handleContactSubmit);
    
    // Scroll events
    window.addEventListener('scroll', handleScroll);
}

// Scroll Animations
function setupScrollAnimations() {
    // Use Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements to animate
    document.querySelectorAll('.section-title, .section-subtitle, .subject-card, .floating-card').forEach(el => {
        observer.observe(el);
    });
}

// Scroll Handler
function handleScroll() {
    // Navbar background on scroll
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to top button visibility
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

// Navigation Functions
function toggleNavMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

// Theme Functions
function toggleTheme() {
    if (themeSwitch.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

// Check for saved theme preference
function checkThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        themeSwitch.checked = true;
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

// Scroll to Top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Subject Functions
function addSubject(e) {
    e.preventDefault();
    
    const subjectName = document.getElementById('subjectName').value;
    const studyGoal = parseInt(document.getElementById('studyGoal').value);
    
    const newSubject = {
        id: Date.now(),
        name: subjectName,
        goal: studyGoal,
        progress: 0
    };
    
    subjects.push(newSubject);
    saveSubjects();
    renderSubjects();
    
    // Reset form
    subjectForm.reset();
    document.getElementById('studyGoal').value = 10;
}

function deleteSubject(id) {
    subjects = subjects.filter(subject => subject.id !== id);
    saveSubjects();
    renderSubjects();
}

function updateProgress(id, amount) {
    const subject = subjects.find(subject => subject.id === id);
    if (subject) {
        subject.progress = Math.max(0, Math.min(subject.goal, subject.progress + amount));
        saveSubjects();
        renderSubjects();
    }
}

function saveSubjects() {
    localStorage.setItem('subjects', JSON.stringify(subjects));
}

function renderSubjects() {
    if (subjects.length === 0) {
        subjectsList.innerHTML = `
            <div class="no-subjects">
                <p>No subjects added yet. Add your first subject to get started!</p>
            </div>
        `;
        return;
    }
    
    subjectsList.innerHTML = subjects.map(subject => `
        <div class="subject-card">
            <div class="subject-header">
                <h3 class="subject-name">${subject.name}</h3>
                <div class="subject-actions">
                    <button class="action-btn edit-btn" onclick="editSubject(${subject.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteSubject(${subject.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="subject-goal">
                Weekly Goal: ${subject.goal} hours
            </div>
            <div class="progress-container">
                <div class="progress-info">
                    <span>Progress: ${subject.progress} / ${subject.goal} hours</span>
                    <span>${Math.round((subject.progress / subject.goal) * 100)}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(subject.progress / subject.goal) * 100}%"></div>
                </div>
            </div>
            <div class="progress-controls">
                <button class="progress-btn" onclick="updateProgress(${subject.id}, 1)">+1 Hour</button>
                <button class="progress-btn" onclick="updateProgress(${subject.id}, -1)">-1 Hour</button>
            </div>
        </div>
    `).join('');
}

function editSubject(id) {
    const subject = subjects.find(subject => subject.id === id);
    if (subject) {
        const newName = prompt('Enter new subject name:', subject.name);
        if (newName && newName.trim() !== '') {
            subject.name = newName.trim();
            saveSubjects();
            renderSubjects();
        }
        
        const newGoal = prompt('Enter new weekly goal (hours):', subject.goal);
        if (newGoal && !isNaN(newGoal) && parseInt(newGoal) > 0) {
            subject.goal = parseInt(newGoal);
            // Adjust progress if it exceeds the new goal
            if (subject.progress > subject.goal) {
                subject.progress = subject.goal;
            }
            saveSubjects();
            renderSubjects();
        }
    }
}

// Timer Functions
function setTimerMode(mode) {
    timerMode = mode;
    
    // Update active button
    timerModeBtns.forEach(btn => {
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Reset timer with new mode
    resetTimer();
    
    if (mode === 'study') {
        timeLeft = 25 * 60;
        totalTime = 25 * 60;
    } else {
        timeLeft = 5 * 60;
        totalTime = 5 * 60;
    }
    
    updateTimerDisplay();
}

function startTimer() {
    if (timerRunning) return;
    
    timerRunning = true;
    startTimerBtn.disabled = true;
    pauseTimerBtn.disabled = false;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerRunning = false;
            startTimerBtn.disabled = false;
            pauseTimerBtn.disabled = true;
            
            // Play sound and show notification
            playTimerSound();
            showTimerNotification();
        }
    }, 1000);
}

function pauseTimer() {
    if (!timerRunning) return;
    
    clearInterval(timerInterval);
    timerRunning = false;
    startTimerBtn.disabled = false;
    pauseTimerBtn.disabled = true;
}

function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    
    if (timerMode === 'study') {
        timeLeft = 25 * 60;
        totalTime = 25 * 60;
    } else {
        timeLeft = 5 * 60;
        totalTime = 5 * 60;
    }
    
    updateTimerDisplay();
    startTimerBtn.disabled = false;
    pauseTimerBtn.disabled = true;
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    timerMinutes.textContent = minutes.toString().padStart(2, '0');
    timerSeconds.textContent = seconds.toString().padStart(2, '0');
    
    // Update progress circle
    const progress = (totalTime - timeLeft) / totalTime;
    const circumference = 283; // 2 * π * r (r = 45)
    const offset = circumference - (progress * circumference);
    timerProgress.style.strokeDashoffset = offset;
}

function playTimerSound() {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
}

function showTimerNotification() {
    const message = timerMode === 'study' 
        ? 'Study session complete! Time for a break.' 
        : 'Break time over! Ready to study again?';
    
    // Create a simple notification
    if (Notification.permission === 'granted') {
        new Notification('StudySync Timer', {
            body: message,
            icon: '/favicon.ico'
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('StudySync Timer', {
                    body: message,
                    icon: '/favicon.ico'
                });
            }
        });
    }
    
    // Also show an alert as fallback
    alert(message);
}

// Quote Functions
function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    
    quoteText.textContent = quote.text;
    quoteAuthor.textContent = `- ${quote.author}`;
}

// Contact Form Handler
function handleContactSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;
    
    // In a real application, you would send this data to a server
    // For this demo, we'll just show a success message
    alert(`Thank you, ${name}! Your message has been sent. We'll get back to you soon.`);
    
    // Reset form
    contactForm.reset();
}

// Initialize theme preference
checkThemePreference();

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .no-subjects {
        text-align: center;
        padding: 40px;
        color: var(--text-light);
        grid-column: 1 / -1;
    }
`;
document.head.appendChild(style);
