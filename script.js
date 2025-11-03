// Sample word list
const sampleWords = ["DREAM", "CREATE", "INSPIRE", "ACHIEVE", "EXPLORE", "INNOVATE"];

// Local Storage Helpers
function saveWordsToStorage(wordsArray) {
    localStorage.setItem('inspirationWords', JSON.stringify(wordsArray));
}

function loadWordsFromStorage() {
    const saved = localStorage.getItem('inspirationWords');
    return saved ? JSON.parse(saved) : null;
}

// State
let words = [...sampleWords];
let currentCards = [];

// DOM Elements
const cardsGrid = document.getElementById('cardsGrid');
const editorModal = document.getElementById('editorModal');
const wordInput = document.getElementById('wordInput');
const shuffleBtn = document.getElementById('shuffleBtn');
const editBtn = document.getElementById('editBtn');
const updateBtn = document.getElementById('updateBtn');
const cancelBtn = document.getElementById('cancelBtn');

// Initialize
function init() {
    const savedWords = loadWordsFromStorage();
    if (savedWords) {
        words = savedWords;
    }
    wordInput.value = words.join('\n');
    generateRandomCards();
    
    // Event listeners
    shuffleBtn.addEventListener('click', shuffleWords);
    editBtn.addEventListener('click', openEditor);
    updateBtn.addEventListener('click', handleWordUpdate);
    cancelBtn.addEventListener('click', closeEditor);
    editorModal.addEventListener('click', (e) => {
        if (e.target === editorModal) closeEditor();
    });
}


// Generate random cards
function generateRandomCards() {
    const diagonalPositions = ["top-left", "none", "bottom-right"];
    
    // Pick 3 random words without duplicates
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const selectedWords = shuffled.slice(0, 3);
    
    currentCards = selectedWords.map((word, index) => ({
        id: `A${index + 1}`,
        text: word,
        diagonalPosition: diagonalPositions[index % 3]
    }));
    
    renderCards();
}

// Render cards to DOM
function renderCards() {
    cardsGrid.innerHTML = currentCards.map(card => `
        <div class="card-wrapper">
            <div class="card-label">${card.id}</div>
            <div class="card">
                <div class="card-border"></div>
                
                <div class="corner-stripe top-right"></div>
                <div class="corner-stripe bottom-left"></div>
                
                <div class="thick-border-right"></div>
                <div class="thick-border-bottom"></div>
                
                ${card.diagonalPosition === "top-left" ? `
                    <svg class="diagonal-line">
                        <line x1="8%" y1="8%" x2="40%" y2="40%" stroke="#1A00FF" stroke-width="1.5" />
                    </svg>
                ` : ''}
                
                ${card.diagonalPosition === "bottom-right" ? `
                    <svg class="diagonal-line">
                        <line x1="60%" y1="60%" x2="92%" y2="92%" stroke="#1A00FF" stroke-width="1.5" />
                    </svg>
                ` : ''}
                
                <div class="card-text">
                    <div class="card-text-content">${card.text}</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Shuffle words
function shuffleWords() {
    generateRandomCards();
}

// Open editor modal
function openEditor() {
    editorModal.classList.add('show');
}

// Close editor modal
function closeEditor() {
    editorModal.classList.remove('show');
}

// Handle word update
function handleWordUpdate() {
    const newWords = wordInput.value
        .split('\n')
        .map(w => w.trim().toUpperCase()) // make all uppercase
        .filter(w => w !== '');

    // Remove duplicates while keeping order
    const uniqueWords = [...new Set(newWords)];

    if (uniqueWords.length === 0) {
        alert('Please enter at least one word');
        return;
    }

    words = uniqueWords;
    saveWordsToStorage(words);
    generateRandomCards();
    closeEditor();
}


// Start the app
init();
