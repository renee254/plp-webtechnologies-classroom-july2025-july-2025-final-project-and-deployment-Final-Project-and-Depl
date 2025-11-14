// books.js - Book data and utility functions

const booksData = [
    {
        id: 1,
        title: "The Cosmic Symphony",
        author: "Elena Starweaver",
        category: "sci-fi",
        price: 24.99,
        rating: 4.8,
        description: "A breathtaking journey through parallel universes where music holds the key to reality itself. Follow protagonist Maya as she discovers her ability to manipulate the fabric of spacetime through harmonic frequencies.",
        emoji: "🎵",
        featured: true
    },
    {
        id: 2,
        title: "Whispers of the Ancient Forest",
        author: "Marcus Greenwood",
        category: "fantasy",
        price: 19.99,
        rating: 4.6,
        description: "An enchanting tale of a young druid who must save her homeland from encroaching darkness. Magic, mystery, and ancient secrets await in this captivating fantasy adventure.",
        emoji: "🌲",
        featured: true
    },
    {
        id: 3,
        title: "The Midnight Detective",
        author: "Sarah Blackwood",
        category: "mystery",
        price: 16.99,
        rating: 4.7,
        description: "In the shadows of London, a brilliant detective unravels a conspiracy that threatens to expose the city's darkest secrets. A gripping mystery that will keep you guessing until the very end.",
        emoji: "🔍",
        featured: true
    },
    {
        id: 4,
        title: "Hearts Across Time",
        author: "Isabella Rose",
        category: "romance",
        price: 14.99,
        rating: 4.5,
        description: "A touching love story that spans decades. When Emma discovers her grandmother's wartime letters, she embarks on a journey that will change her understanding of love forever.",
        emoji: "💕",
        featured: false
    },
    {
        id: 5,
        title: "Neon Dreams",
        author: "Alex Chen",
        category: "sci-fi",
        price: 22.99,
        rating: 4.9,
        description: "In a cyberpunk future where dreams can be hacked, one rebel fights to free humanity from corporate mind control. A stunning vision of tomorrow.",
        emoji: "🌃",
        featured: true
    },
    {
        id: 6,
        title: "The Last Library",
        author: "Dr. James Morrison",
        category: "fiction",
        price: 18.99,
        rating: 4.4,
        description: "Set in a dystopian future where books are banned, a secret librarian risks everything to preserve humanity's stories. A powerful meditation on the importance of literature.",
        emoji: "📖",
        featured: false
    },
    {
        id: 7,
        title: "Dragon's Promise",
        author: "Mei Lin",
        category: "fantasy",
        price: 21.99,
        rating: 4.8,
        description: "When dragons return to the mortal realm, a young warrior must forge an unlikely alliance to save both species from extinction. Epic fantasy at its finest.",
        emoji: "🐉",
        featured: true
    },
    {
        id: 8,
        title: "The Silent Witness",
        author: "Robert Kane",
        category: "mystery",
        price: 15.99,
        rating: 4.6,
        description: "A psychological thriller about a witness to a crime who loses the ability to speak. Can she communicate the truth before it's too late?",
        emoji: "🤐",
        featured: false
    },
    {
        id: 9,
        title: "Summer at Seabrook",
        author: "Catherine Mills",
        category: "romance",
        price: 13.99,
        rating: 4.3,
        description: "A heartwarming beach read about second chances and new beginnings. Perfect for anyone who believes in the power of love.",
        emoji: "🏖️",
        featured: false
    },
    {
        id: 10,
        title: "Quantum Entanglement",
        author: "Dr. Nina Patel",
        category: "sci-fi",
        price: 26.99,
        rating: 4.7,
        description: "A hard science fiction masterpiece exploring consciousness, quantum mechanics, and what it means to be human in an age of artificial intelligence.",
        emoji: "⚛️",
        featured: false
    },
    {
        id: 11,
        title: "The Painter's Secret",
        author: "Antonio Russo",
        category: "fiction",
        price: 17.99,
        rating: 4.5,
        description: "An art historian discovers a hidden message in a Renaissance painting that leads to an ancient treasure. History and mystery collide in this thrilling adventure.",
        emoji: "🎨",
        featured: true
    },
    {
        id: 12,
        title: "Shadows and Spells",
        author: "Morgana Black",
        category: "fantasy",
        price: 20.99,
        rating: 4.9,
        description: "A dark fantasy about a witch who must confront her past to save the future. Magic, betrayal, and redemption weave together in this spellbinding tale.",
        emoji: "🔮",
        featured: false
    },
    {
        id: 13,
        title: "The Vanishing Hour",
        author: "Thomas Wright",
        category: "mystery",
        price: 16.99,
        rating: 4.4,
        description: "Every day at 3 PM, people in a small town vanish for exactly one hour. A reporter investigates this supernatural phenomenon in this chilling mystery.",
        emoji: "⏰",
        featured: false
    },
    {
        id: 14,
        title: "Love in the City of Lights",
        author: "Sophie Laurent",
        category: "romance",
        price: 14.99,
        rating: 4.6,
        description: "A charming romance set in Paris. When an American baker and a French architect clash over a historic building, sparks fly in unexpected ways.",
        emoji: "🗼",
        featured: false
    },
    {
        id: 15,
        title: "Starship Horizon",
        author: "Captain Rex Taylor",
        category: "sci-fi",
        price: 23.99,
        rating: 4.8,
        description: "Humanity's first interstellar colony ship encounters an ancient alien artifact that challenges everything we know about the universe.",
        emoji: "🚀",
        featured: true
    }
];

// Utility function to get all books
function getAllBooks() {
    return booksData;
}

// Get featured books
function getFeaturedBooks() {
    return booksData.filter(book => book.featured);
}

// Get book by ID
function getBookById(id) {
    return booksData.find(book => book.id === parseInt(id));
}

// Filter books by category
function filterByCategory(category) {
    if (category === 'all') return booksData;
    return booksData.filter(book => book.category === category);
}

// Search books
function searchBooks(query) {
    const lowercaseQuery = query.toLowerCase();
    return booksData.filter(book => 
        book.title.toLowerCase().includes(lowercaseQuery) ||
        book.author.toLowerCase().includes(lowercaseQuery)
    );
}

// Get random books (for related books section)
function getRandomBooks(excludeId, count = 3) {
    const filtered = booksData.filter(book => book.id !== excludeId);
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}