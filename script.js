// List of keywords for subject inference
const SUBJECT_KEYWORDS = {
  "Biology": ["photosynthesis", "cell", "organism", "genetics", "ecology"],
  "Physics": ["velocity", "force", "energy", "mass", "acceleration"],
  "Chemistry": ["atom", "molecule", "reaction", "acid", "base"],
  "Mathematics": ["integral", "derivative", "theorem", "equation", "algebra"]
};

// Utility functions
function getSubjectFromQuestion(question) {
  const lowerQ = question.toLowerCase();
  for (const [subject, keywords] of Object.entries(SUBJECT_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerQ.includes(keyword)) {
        return subject;
      }
    }
  }
  return "General"; // Default subject if no keywords match
}

function saveFlashcard(flashcard) {
  const flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
  flashcards.push(flashcard);
  localStorage.setItem('flashcards', JSON.stringify(flashcards));
}

function getFlashcardsByStudent(studentId) {
  const flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
  return flashcards.filter(f => f.student_id === studentId);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Event listener for adding flashcard
document.getElementById('flashcard-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const studentId = document.getElementById('studentId').value.trim();
  const question = document.getElementById('question').value.trim();
  const answer = document.getElementById('answer').value.trim();

  if (!studentId || !question || !answer) {
    alert('Please fill all fields.');
    return;
  }

  const subject = getSubjectFromQuestion(question);

  const newFlashcard = {
    student_id: studentId,
    question: question,
    answer: answer,
    subject: subject
  };

  saveFlashcard(newFlashcard);

  alert(`Flashcard added with inferred subject: ${subject}`);
  document.getElementById('flashcard-form').reset();
});

// Event listener for retrieving flashcards
document.getElementById('get-flashcards-btn').addEventListener('click', function() {
  const studentId = document.getElementById('studentId').value.trim();
  const limit = parseInt(document.getElementById('limit').value);

  if (!studentId) {
    alert('Please enter Student ID to retrieve flashcards.');
    return;
  }

  const allFlashcards = getFlashcardsByStudent(studentId);

  // Shuffle the flashcards
  shuffleArray(allFlashcards);

  // Limit the number of flashcards
  const selectedFlashcards = allFlashcards.slice(0, limit);

  // Display flashcards
  const container = document.getElementById('flashcards-container');
  container.innerHTML = '';

  if (selectedFlashcards.length === 0) {
    container.innerHTML = '<p>No flashcards found for this student.</p>';
    return;
  }

  selectedFlashcards.forEach(f => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'flashcard';

    cardDiv.innerHTML = `
      <h3>Subject: ${f.subject}</h3>
      <p><strong>Q:</strong> ${f.question}</p>
      <p><strong>A:</strong> ${f.answer}</p>
    `;
    container.appendChild(cardDiv);
  });
});