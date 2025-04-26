// Get all HTML elements
const wordInput = document.getElementById('word-input');
const searchBtn = document.getElementById('search-btn');
const result = document.getElementById('result');
const errorMsg = document.getElementById('error-msg');
const word = document.getElementById('word');
const phonetic = document.getElementById('phonetic');
const partOfSpeech = document.querySelector('.pos-value');
const definitionsList = document.getElementById('definitions-list');
const examplesList = document.getElementById('examples-list');
const synonymsList = document.getElementById('synonyms-list');

// Event listeners
searchBtn.addEventListener('click', searchWord);
wordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchWord();
});

// Main search function
function searchWord() {
    const searchTerm = wordInput.value.trim();
    
    if (!searchTerm) {
        showError('Please enter a word');
        return;
    }

    // Show loading state
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
    searchBtn.disabled = true;

    // API request using axios
    axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`)
        .then(response => {
            errorMsg.classList.remove('show');
            displayResult(response.data[0]);
        })
        .catch(error => {
            if (error.response && error.response.status === 404) {
                showError('Word not found. Please try another word.');
            } else {
                showError('An error occurred. Please try again.');
            }
        })
        .finally(() => {
            // Reset search button
            searchBtn.innerHTML = '<i class="fas fa-search"></i> Search';
            searchBtn.disabled = false;
        });
}

// Display the word data
function displayResult(data) {
    clearAllResults();
    displayBasicInfo(data);
    displayDefinitions(data.meanings[0]);
    displaySynonyms(data.meanings[0]);
    result.classList.add('show');
}

// Helper functions
function clearAllResults() {
    [definitionsList, examplesList, synonymsList].forEach(list => {
        list.innerHTML = '';
    });
}

function displayBasicInfo(data) {
    word.textContent = data.word;
    phonetic.textContent = data.phonetic || '';
    partOfSpeech.textContent = data.meanings[0].partOfSpeech;
}

function displayDefinitions(meaning) {
    let hasExamples = false;
    
    meaning.definitions.forEach(def => {
        addListItem(definitionsList, 'li', def.definition);
        if (def.example) {
            addListItem(examplesList, 'li', def.example);
            hasExamples = true;
        }
    });

    
    if (!hasExamples) {
        addListItem(examplesList, 'li', 'No examples found');
    }
}

function displaySynonyms(meaning) {
    displayWordList(synonymsList, meaning.synonyms, 'No synonyms found');
}

function displayWordList(container, words, emptyMsg) {
    const items = words.length > 0 ? words.slice(0, 5) : [emptyMsg];
    items.forEach(item => addListItem(container, 'span', item));
}
f
function addListItem(container, tagName, text) {
    const element = document.createElement(tagName);
    element.textContent = text;
    container.appendChild(element);
}

function showError(message) {
    errorMsg.querySelector('p').textContent = message;
    errorMsg.classList.add('show');
    result.classList.remove('show');
}