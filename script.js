/**
 * Indian Sign Language Converter
 * Converts speech to text, splits into letters, and displays corresponding ISL GIFs
 */

// ===== Configuration =====
const CONFIG = {
    LETTER_DISPLAY_DURATION: 2000,  // 2 seconds per letter
    ANIMATION_DURATION: 500,  // Animation duration in ms
    API_LETTER_URL: '/api/letter',  // API endpoint for letter images
    API_PHRASE_URL: '/api/phrase',  // API endpoint for phrase/word GIFs
    USE_API: true,  // Use API endpoint instead of direct file access
    PHRASE_FIRST: true,  // Try to match phrases/words before splitting into letters
};

// ===== State Management =====
const state = {
    recognition: null,
    isListening: false,
    isProcessing: false,  // Track if text/letter display is in progress
    currentSentence: '',
    currentLetterIndex: 0,
    letters: [],
    displayTimeout: null,
    isDarkMode: localStorage.getItem('darkMode') === 'true' || false,
    history: JSON.parse(localStorage.getItem('islHistory') || '[]'),
};

// ===== DOM Elements =====
const elements = {
    startBtn: document.getElementById('startBtn'),
    stopBtn: document.getElementById('stopBtn'),
    statusText: document.getElementById('statusText'),
    statusDot: document.querySelector('.status-dot'),
    detectedText: document.getElementById('detectedText'),
    currentLetter: document.getElementById('currentLetter'),
    gifContainer: document.getElementById('gifContainer'),
    letterSequence: document.getElementById('letterSequence'),
    darkModeToggle: document.getElementById('darkModeToggle'),
    textInput: document.getElementById('textInput'),
    submitTextBtn: document.getElementById('submitTextBtn'),
    stopTextBtn: document.getElementById('stopTextBtn'),
    historyContainer: document.getElementById('historyContainer'),
    clearHistoryBtn: document.getElementById('clearHistoryBtn'),
};

// ===== Initialize Web Speech API =====
function initializeSpeechRecognition() {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        showError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
        return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;  // Stop after one result
    recognition.interimResults = false;  // Only final results
    recognition.lang = 'en-US';  // English language

    // Event handlers
    recognition.onstart = () => {
        state.isListening = true;
        updateStatus('Listening...', true);
        elements.startBtn.disabled = true;
        elements.stopBtn.disabled = false;
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleSpeechResult(transcript);
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        let errorMsg = 'Speech recognition error occurred.';
        
        if (event.error === 'no-speech') {
            errorMsg = 'No speech detected. Please try again.';
        } else if (event.error === 'audio-capture') {
            errorMsg = 'No microphone found. Please check your microphone.';
        } else if (event.error === 'not-allowed') {
            errorMsg = 'Microphone permission denied. Please allow microphone access.';
        }
        
        showError(errorMsg);
        resetRecognition();
    };

    recognition.onend = () => {
        resetRecognition();
    };

    return recognition;
}

// ===== Handle Text Input =====
function handleTextInput(text) {
    const trimmedText = text.trim();
    
    if (!trimmedText) {
        showError('Please enter some text.');
        return;
    }
    
    // Process the text (same as speech)
    processText(trimmedText);
}

// ===== Process Text (used by both speech and text input) =====
function processText(text) {
    console.log('Processing text:', text);
    
    // Set processing state
    state.isProcessing = true;
    elements.stopTextBtn.disabled = false;
    elements.submitTextBtn.disabled = true;
    
    // Update detected text
    state.currentSentence = text;
    elements.detectedText.textContent = state.currentSentence;
    
    // Clear previous display
    elements.gifContainer.innerHTML = '<div class="gif-loading">Searching for GIF...</div>';
    
    // Reset current letter display
    elements.currentLetter.textContent = '-';
    elements.currentLetter.classList.remove('has-letter');
    
    // Save to history
    addToHistory(text);
    
    // First, try to match as a phrase/word (this will show video-like GIF)
    if (CONFIG.PHRASE_FIRST) {
        checkPhraseMatch(state.currentSentence, (matched) => {
            if (matched) {
                // Phrase matched, GIF is already displayed in video format
                updateStatus(`Playing GIF for: ${state.currentSentence}`, false);
                // Reset processing state after a delay (phrase GIFs don't need stop)
                setTimeout(() => {
                    state.isProcessing = false;
                    elements.stopTextBtn.disabled = true;
                    elements.submitTextBtn.disabled = false;
                }, 1000);
                return;
            } else {
                // No phrase match, fall back to letter-by-letter
                processAsLetters(state.currentSentence);
            }
        });
    } else {
        processAsLetters(state.currentSentence);
    }
}

// ===== Handle Speech Recognition Result =====
function handleSpeechResult(transcript) {
    const text = transcript.trim();
    processText(text);
}

// ===== Process as Letters =====
function processAsLetters(sentence) {
    // Extract letters from the sentence (A-Z only, ignore numbers and special characters)
    state.letters = extractLetters(sentence);
    
    if (state.letters.length === 0) {
        showError('No letters found in the speech. Please speak words containing letters.');
        return;
    }
    
    // Display letter sequence
    displayLetterSequence(state.letters);
    
    // Start displaying letters and GIFs sequentially
    displayLettersSequentially(0);
}

// ===== Check Phrase Match =====
function checkPhraseMatch(phrase, callback) {
    const phraseClean = phrase.toLowerCase().trim();
    
    // Generate variations to try
    const variations = [
        phraseClean,  // Original
        phraseClean.replace(/[^\w\s]/g, ''),  // Remove punctuation
        phraseClean.replace(/\s+/g, ' ').trim(),  // Normalize spaces
        phraseClean.replace(/\s+/g, '_'),  // Spaces to underscores
        phraseClean.replace(/\s+/g, '-'),  // Spaces to hyphens
    ];
    
    // Remove duplicates
    const uniqueVariations = [...new Set(variations)];
    
    let currentIndex = 0;
    
    const tryVariation = () => {
        if (currentIndex >= uniqueVariations.length) {
            // No match found
            callback(false);
            return;
        }
        
        const variant = uniqueVariations[currentIndex];
        const apiUrl = `${CONFIG.API_PHRASE_URL}/${encodeURIComponent(variant)}`;
        
        fetch(apiUrl)
            .then(response => {
                if (response.ok) {
                    // Phrase GIF found!
                    return response.blob().then(blob => {
                        displayPhraseGIF(variant, blob);
                        callback(true);
                    });
                } else {
                    // Try next variation
                    currentIndex++;
                    tryVariation();
                }
            })
            .catch(error => {
                console.error(`Error checking variation "${variant}":`, error);
                currentIndex++;
                tryVariation();
            });
    };
    
    // Start trying variations
    tryVariation();
}

// ===== Display Phrase GIF (Video-like Format) =====
function displayPhraseGIF(phrase, blob) {
    elements.currentLetter.textContent = phrase.toUpperCase();
    elements.currentLetter.classList.add('has-letter');
    elements.letterSequence.innerHTML = `<div class="letter-badge active">${phrase}</div>`;
    
    // Create video-like container
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-like-container';
    
    // Create the GIF image (GIFs play automatically)
    const img = document.createElement('img');
    const blobUrl = URL.createObjectURL(blob);
    img.src = blobUrl;
    img.alt = `ISL sign for: ${phrase}`;
    img.className = 'phrase-gif-video';
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.maxHeight = '500px';
    img.style.objectFit = 'contain';
    
    // Add title/header
    const title = document.createElement('div');
    title.className = 'video-title';
    title.textContent = `Playing: "${phrase}"`;
    
    // Add controls container
    const controls = document.createElement('div');
    controls.className = 'video-controls';
    
    // Play/Pause button (for GIF restart)
    const playBtn = document.createElement('button');
    playBtn.className = 'control-btn play-btn';
    playBtn.innerHTML = '🔄 Restart';
    playBtn.title = 'Restart animation';
    playBtn.onclick = () => {
        // Restart GIF by reloading
        const currentSrc = img.src;
        img.src = '';
        setTimeout(() => {
            img.src = currentSrc;
        }, 10);
    };
    
    // Loop indicator
    const loopIndicator = document.createElement('span');
    loopIndicator.className = 'loop-indicator';
    loopIndicator.innerHTML = '🔁 Looping';
    loopIndicator.title = 'GIF is looping automatically';
    
    controls.appendChild(playBtn);
    controls.appendChild(loopIndicator);
    
    videoContainer.appendChild(title);
    videoContainer.appendChild(img);
    videoContainer.appendChild(controls);
    
    // Clear and add to container
    elements.gifContainer.innerHTML = '';
    elements.gifContainer.appendChild(videoContainer);
    
    // Add fade-in animation
    videoContainer.style.opacity = '0';
    setTimeout(() => {
        videoContainer.style.transition = 'opacity 0.5s ease-in';
        videoContainer.style.opacity = '1';
    }, 10);
    
    updateStatus(`Playing GIF: ${phrase}`, false);
    
    // Clean up blob URL when done (optional, for memory management)
    // Note: We keep it for the GIF to continue playing
}

// ===== Extract Letters from Text =====
function extractLetters(text) {
    // Convert to uppercase and extract only A-Z letters
    const letters = text.toUpperCase().match(/[A-Z]/g);
    return letters || [];
}

// ===== Display Letters Sequentially =====
function displayLettersSequentially(index) {
    // Check if processing was stopped
    if (!state.isProcessing) {
        updateStatus('Stopped', false);
        elements.stopTextBtn.disabled = true;
        elements.submitTextBtn.disabled = false;
        return;
    }
    
    if (index >= state.letters.length) {
        updateStatus('Display complete', false);
        state.isProcessing = false;
        elements.stopTextBtn.disabled = true;
        elements.submitTextBtn.disabled = false;
        return;
    }
    
    const letter = state.letters[index];
    state.currentLetterIndex = index;
    
    // Update current letter display
    elements.currentLetter.textContent = letter;
    // Ensure gradient text is applied
    elements.currentLetter.style.background = 'var(--gradient-primary)';
    elements.currentLetter.style.webkitBackgroundClip = 'text';
    elements.currentLetter.style.webkitTextFillColor = 'transparent';
    elements.currentLetter.style.backgroundClip = 'text';
    
    // Update letter sequence badges (highlight active)
    updateLetterSequenceBadges(index);
    
    // Load and display GIF for the letter
    loadAndDisplayGIF(letter, () => {
        // Check again if processing was stopped
        if (!state.isProcessing) {
            updateStatus('Stopped', false);
            elements.stopTextBtn.disabled = true;
            elements.submitTextBtn.disabled = false;
            return;
        }
        
        // After displaying this letter, move to next after delay
        state.displayTimeout = setTimeout(() => {
            displayLettersSequentially(index + 1);
        }, CONFIG.LETTER_DISPLAY_DURATION);
    });
}

// ===== Load and Display Letter Image =====
function loadAndDisplayGIF(letter, callback) {
    // Show loading state
    elements.gifContainer.innerHTML = '<div class="gif-loading">Loading letter image...</div>';
    
    if (CONFIG.USE_API) {
        // Use API endpoint for letters
        const apiUrl = `${CONFIG.API_LETTER_URL}/${letter}`;
        const img = document.createElement('img');
        img.src = apiUrl;
        img.alt = `Letter ${letter}`;
        
        img.onload = () => {
            elements.gifContainer.innerHTML = '';
            elements.gifContainer.appendChild(img);
            if (callback) callback();
        };
        
        img.onerror = () => {
            // Try to fetch error details from API
            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(data => {
                            throw new Error(data.error || 'Failed to load letter image');
                        });
                    }
                })
                .catch(error => {
                    elements.gifContainer.innerHTML = `
                        <div class="placeholder">
                            Failed to load letter image: ${letter}<br>
                            <small>Error: ${error.message}</small><br>
                            <small>API: ${apiUrl}</small>
                        </div>
                    `;
                    if (callback) callback();
                });
        };
    } else {
        // Fallback (shouldn't be used)
        elements.gifContainer.innerHTML = `
            <div class="placeholder">
                API not enabled. Please enable USE_API in config.
            </div>
        `;
        if (callback) callback();
    }
}

// ===== Find GIF Path =====
function findGIFPath(letter) {
    // Try .gif first, then .jpg (for backward compatibility with existing files)
    const gifPath = `${CONFIG.ISL_GIFS_DIR}/${letter}.gif`;
    const jpgPath = `${CONFIG.ISL_GIFS_DIR}/${letter}.jpg`;
    
    // Return GIF path first (preferred), will fallback to JPG in loadAndDisplayGIF if needed
    // The actual file existence will be checked when loading the image
    return gifPath;
}

// ===== Try Alternative Paths =====
function tryAlternativePaths(letter, onSuccess, onError) {
    if (CONFIG.USE_API) {
        // Use API endpoint for letters
        const apiUrl = `${CONFIG.API_LETTER_URL}/${letter}`;
        const img = new Image();
        
        img.onload = () => onSuccess(apiUrl);
        img.onerror = () => {
            console.error(`Failed to load letter via API: ${letter}`);
            onError();
        };
        img.src = apiUrl;
    } else {
        // Fallback to direct file access (shouldn't be used with new setup)
        onError();
    }
}

// ===== Display Letter Sequence =====
function displayLetterSequence(letters) {
    elements.letterSequence.innerHTML = '';
    
    letters.forEach((letter, index) => {
        const badge = document.createElement('div');
        badge.className = 'letter-badge';
        badge.textContent = letter;
        badge.dataset.index = index;
        elements.letterSequence.appendChild(badge);
    });
}

// ===== Update Letter Sequence Badges =====
function updateLetterSequenceBadges(activeIndex) {
    const badges = elements.letterSequence.querySelectorAll('.letter-badge');
    badges.forEach((badge, index) => {
        if (index === activeIndex && activeIndex >= 0) {
            badge.classList.add('active');
        } else {
            badge.classList.remove('active');
        }
    });
}

// ===== Start Speech Recognition =====
function startRecognition() {
    if (!state.recognition) {
        state.recognition = initializeSpeechRecognition();
        if (!state.recognition) {
            return;
        }
    }
    
    // Clear previous results
    state.currentSentence = '';
    state.letters = [];
    state.currentLetterIndex = 0;
    elements.detectedText.textContent = '-';
    elements.currentLetter.textContent = '-';
    elements.letterSequence.innerHTML = '';
    elements.gifContainer.innerHTML = '<div class="placeholder">No letter selected</div>';
    
    // Clear any existing timeout
    if (state.displayTimeout) {
        clearTimeout(state.displayTimeout);
        state.displayTimeout = null;
    }
    
    try {
        state.recognition.start();
    } catch (error) {
        console.error('Error starting recognition:', error);
        showError('Failed to start speech recognition. Please try again.');
        resetRecognition();
    }
}

// ===== Stop Speech Recognition =====
function stopRecognition() {
    if (state.recognition && state.isListening) {
        state.recognition.stop();
    }
    resetRecognition();
}

// ===== Stop Text Processing =====
function stopTextProcessing() {
    // Clear any pending timeouts
    if (state.displayTimeout) {
        clearTimeout(state.displayTimeout);
        state.displayTimeout = null;
    }
    
    // Stop processing
    state.isProcessing = false;
    elements.stopTextBtn.disabled = true;
    elements.submitTextBtn.disabled = false;
    
    // Update status
    updateStatus('Stopped', false);
    
    // Clear letter sequence highlight
    updateLetterSequenceBadges(-1);
}

// ===== Reset Recognition State =====
function resetRecognition() {
    state.isListening = false;
    updateStatus('Ready to start', false);
    elements.startBtn.disabled = false;
    elements.stopBtn.disabled = true;
}

// ===== Update Status =====
function updateStatus(message, isListening) {
    elements.statusText.textContent = message;
    if (isListening) {
        elements.statusDot.classList.add('listening');
    } else {
        elements.statusDot.classList.remove('listening');
    }
}

// ===== Show Error =====
function showError(message) {
    updateStatus(`Error: ${message}`, false);
    console.error(message);
    
    // Show error in detected text area temporarily
    const originalText = elements.detectedText.textContent;
    elements.detectedText.textContent = message;
    elements.detectedText.style.color = '#ff6b6b';
    
    setTimeout(() => {
        elements.detectedText.textContent = originalText;
        elements.detectedText.style.color = '';
    }, 3000);
}

// ===== Dark Mode Toggle =====
function toggleDarkMode() {
    state.isDarkMode = !state.isDarkMode;
    localStorage.setItem('darkMode', state.isDarkMode);
    
    if (state.isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        elements.darkModeToggle.innerHTML = '<span class="toggle-icon">☀️</span>';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        elements.darkModeToggle.innerHTML = '<span class="toggle-icon">🌙</span>';
    }
}

// ===== Initialize Dark Mode =====
function initializeDarkMode() {
    if (state.isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        elements.darkModeToggle.innerHTML = '<span class="toggle-icon">☀️</span>';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        elements.darkModeToggle.innerHTML = '<span class="toggle-icon">🌙</span>';
    }
}

// ===== History Management =====
function addToHistory(text) {
    const historyItem = {
        id: Date.now(),
        text: text,
        timestamp: new Date().toLocaleString(),
        date: new Date().toISOString()
    };
    
    // Add to beginning of history
    state.history.unshift(historyItem);
    
    // Limit history to last 50 items
    if (state.history.length > 50) {
        state.history = state.history.slice(0, 50);
    }
    
    // Save to localStorage
    localStorage.setItem('islHistory', JSON.stringify(state.history));
    
    // Update display
    displayHistory();
}

function deleteHistoryItem(id) {
    state.history = state.history.filter(item => item.id !== id);
    localStorage.setItem('islHistory', JSON.stringify(state.history));
    displayHistory();
}

function clearAllHistory() {
    if (confirm('Are you sure you want to clear all history?')) {
        state.history = [];
        localStorage.setItem('islHistory', JSON.stringify(state.history));
        displayHistory();
    }
}

function displayHistory() {
    if (state.history.length === 0) {
        elements.historyContainer.innerHTML = '<div class="history-empty">No history yet. Start typing or speaking!</div>';
        return;
    }
    
    elements.historyContainer.innerHTML = '';
    
    state.history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-item-content">
                <div class="history-text">${escapeHtml(item.text)}</div>
                <div class="history-timestamp">${item.timestamp}</div>
            </div>
            <div class="history-item-actions">
                <button class="history-use-btn" title="Use this text again" data-text="${escapeHtml(item.text)}">
                    <span>▶</span>
                </button>
                <button class="history-delete-btn" title="Delete this item" data-id="${item.id}">
                    <span>🗑️</span>
                </button>
            </div>
        `;
        
        // Add click handler for use button
        const useBtn = historyItem.querySelector('.history-use-btn');
        useBtn.addEventListener('click', () => {
            elements.textInput.value = item.text;
            handleTextInput(item.text);
        });
        
        // Add click handler for delete button
        const deleteBtn = historyItem.querySelector('.history-delete-btn');
        deleteBtn.addEventListener('click', () => {
            deleteHistoryItem(item.id);
        });
        
        elements.historyContainer.appendChild(historyItem);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== Event Listeners =====
elements.startBtn.addEventListener('click', startRecognition);
elements.stopBtn.addEventListener('click', stopRecognition);
elements.darkModeToggle.addEventListener('click', toggleDarkMode);
elements.clearHistoryBtn.addEventListener('click', clearAllHistory);

// Text input handlers
elements.submitTextBtn.addEventListener('click', () => {
    if (!state.isProcessing) {
        handleTextInput(elements.textInput.value);
        elements.textInput.value = ''; // Clear input after submission
    }
});

elements.textInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !state.isProcessing) {
        handleTextInput(elements.textInput.value);
        elements.textInput.value = ''; // Clear input after submission
    }
});

elements.stopTextBtn.addEventListener('click', stopTextProcessing);

// ===== Initialize on Page Load =====
document.addEventListener('DOMContentLoaded', () => {
    initializeDarkMode();
    updateStatus('Ready to start', false);
    displayHistory(); // Load and display history
    console.log('Indian Sign Language Converter initialized');
    console.log('ISL GIFs directory:', CONFIG.ISL_GIFS_DIR);
    console.log('History items:', state.history.length);
});

// ===== Cleanup on Page Unload =====
window.addEventListener('beforeunload', () => {
    if (state.displayTimeout) {
        clearTimeout(state.displayTimeout);
    }
    if (state.recognition && state.isListening) {
        state.recognition.stop();
    }
});

