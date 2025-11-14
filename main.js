// main.js - Main JavaScript file for interactivity

// ===== FAVORITES MANAGEMENT =====
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function updateFavoritesCount() {
    const countElements = document.querySelectorAll('#favCount');
    countElements.forEach(el => {
        el.textContent = favorites.length;
    });
}

function toggleFavorite(bookId) {
    const index = favorites.indexOf(bookId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(bookId);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesCount();
    return favorites.includes(bookId);
}

function isFavorite(bookId) {
    return favorites.includes(bookId);
}

// ===== MOBILE MENU TOGGLE =====
document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.getElementById('mobileToggle');
    const nav = document.getElementById('nav');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav && nav.classList.contains('active')) {
            if (!nav.contains(e.target) && !mobileToggle.contains(e.target)) {
                nav.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        }
    });

    // Initialize favorites count
    updateFavoritesCount();

    // Initialize theme
    initializeTheme();

    // Page-specific initializations
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentPage === 'index.html' || currentPage === '') {
        initializeHomePage();
    } else if (currentPage === 'browse.html') {
        initializeBrowsePage();
    } else if (currentPage === 'details.html') {
        initializeDetailsPage();
    } else if (currentPage === 'about.html') {
        initializeAboutPage();
    }
});

// ===== DARK MODE TOGGLE =====
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.textContent = '☀️';
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark);
            themeToggle.textContent = isDark ? '☀️' : '🌙';
        });
    }
}

// ===== HOME PAGE =====
function initializeHomePage() {
    loadFeaturedBooks();
    initializeSubscribeForm();
    animateOnScroll();
}

function loadFeaturedBooks() {
    const container = document.getElementById('featuredBooks');
    if (!container) return;
    
    const featured = getFeaturedBooks();
    container.innerHTML = featured.map(book => createBookCard(book)).join('');
    
    // Add event listeners to book cards
    attachBookCardListeners();
}

function createBookCard(book) {
    const isFav = isFavorite(book.id);
    return `
        <article class="book-card" data-book-id="${book.id}">
            <div class="book-cover">${book.emoji}</div>
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">by ${book.author}</p>
            <span class="book-category">${book.category}</span>
            <p class="book-price">$${book.price}</p>
            <div class="book-actions">
                <button class="btn-favorite ${isFav ? 'active' : ''}" data-book-id="${book.id}">
                    ${isFav ? '❤️ Favorited' : '🤍 Add to Favorites'}
                </button>
            </div>
        </article>
    `;
}

function attachBookCardListeners() {
    // Book card clicks
    document.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn-favorite')) {
                const bookId = card.dataset.bookId;
                window.location.href = `details.html?id=${bookId}`;
            }
        });
    });
    
    // Favorite buttons
    document.querySelectorAll('.btn-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const bookId = parseInt(btn.dataset.bookId);
            const isNowFavorite = toggleFavorite(bookId);
            btn.textContent = isNowFavorite ? '❤️ Favorited' : '🤍 Add to Favorites';
            btn.classList.toggle('active', isNowFavorite);
        });
    });
}

function initializeSubscribeForm() {
    const form = document.getElementById('subscribeForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        alert(`Thank you for subscribing with ${email}! 🎉`);
        form.reset();
    });
}

// ===== BROWSE PAGE =====
function initializeBrowsePage() {
    loadAllBooks();
    initializeFilters();
    initializeSearch();
}

function loadAllBooks() {
    displayBooks(getAllBooks());
}

function displayBooks(books) {
    const container = document.getElementById('booksGrid');
    const noResults = document.getElementById('noResults');
    
    if (!container) return;
    
    if (books.length === 0) {
        container.style.display = 'none';
        noResults.style.display = 'block';
    } else {
        container.style.display = 'grid';
        noResults.style.display = 'none';
        container.innerHTML = books.map(book => createBookCard(book)).join('');
        attachBookCardListeners();
    }
}

function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter books
            const category = btn.dataset.category;
            const filtered = filterByCategory(category);
            displayBooks(filtered);
        });
    });
}

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    
    if (!searchInput) return;
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            const results = searchBooks(query);
            displayBooks(results);
            
            // Reset filter buttons
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        } else {
            loadAllBooks();
        }
    }
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Real-time search with debounce
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(performSearch, 300);
    });
}

// ===== DETAILS PAGE =====
function initializeDetailsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = parseInt(urlParams.get('id'));
    
    if (bookId) {
        loadBookDetails(bookId);
        loadRelatedBooks(bookId);
    } else {
        window.location.href = 'browse.html';
    }
}

function loadBookDetails(bookId) {
    const container = document.getElementById('bookDetails');
    if (!container) return;
    
    const book = getBookById(bookId);
    if (!book) {
        window.location.href = 'browse.html';
        return;
    }
    
    const isFav = isFavorite(bookId);
    
    container.innerHTML = `
        <div class="book-details-cover">${book.emoji}</div>
        <div class="book-details-info">
            <h1>${book.title}</h1>
            <div class="book-details-meta">
                <span class="book-author">by ${book.author}</span>
                <span class="book-category">${book.category}</span>
                <span>⭐ ${book.rating}/5</span>
            </div>
            <p class="book-details-description">${book.description}</p>
            <p class="book-price">$${book.price}</p>
            <div class="book-details-actions">
                <button class="btn btn-primary" id="addToCart">Add to Cart</button>
                <button class="btn-favorite ${isFav ? 'active' : ''}" id="detailsFavorite">
                    ${isFav ? '❤️ Favorited' : '🤍 Add to Favorites'}
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners
    document.getElementById('addToCart').addEventListener('click', () => {
        alert(`"${book.title}" added to cart! 🛒`);
    });
    
    document.getElementById('detailsFavorite').addEventListener('click', function() {
        const isNowFavorite = toggleFavorite(bookId);
        this.textContent = isNowFavorite ? '❤️ Favorited' : '🤍 Add to Favorites';
        this.classList.toggle('active', isNowFavorite);
    });
}

function loadRelatedBooks(excludeId) {
    const container = document.getElementById('relatedBooks');
    if (!container) return;
    
    const related = getRandomBooks(excludeId, 3);
    container.innerHTML = related.map(book => createBookCard(book)).join('');
    attachBookCardListeners();
}

// ===== ABOUT PAGE =====
function initializeAboutPage() {
    initializeContactForm();
}

function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        
        let isValid = true;
        
        // Validate name
        if (nameInput.value.trim().length < 2) {
            document.getElementById('nameError').textContent = 'Name must be at least 2 characters';
            isValid = false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            document.getElementById('emailError').textContent = 'Please enter a valid email address';
            isValid = false;
        }
        
        // Validate subject
        if (subjectInput.value.trim().length < 3) {
            document.getElementById('subjectError').textContent = 'Subject must be at least 3 characters';
            isValid = false;
        }
        
        // Validate message
        if (messageInput.value.trim().length < 10) {
            document.getElementById('messageError').textContent = 'Message must be at least 10 characters';
            isValid = false;
        }
        
        if (isValid) {
            document.getElementById('successMessage').style.display = 'block';
            form.reset();
            
            setTimeout(() => {
                document.getElementById('successMessage').style.display = 'none';
            }, 5000);
        }
    });
    
    // Real-time validation
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
        input.addEventListener('blur', () => {
            form.dispatchEvent(new Event('submit'));
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.book-card, .value-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== STARS ANIMATION (Hero Section) =====
const starsContainer = document.querySelector('.stars');
if (starsContainer) {
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: twinkle ${2 + Math.random() * 3}s infinite;
        `;
        starsContainer.appendChild(star);
    }
    
    // Add twinkle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes twinkle {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}