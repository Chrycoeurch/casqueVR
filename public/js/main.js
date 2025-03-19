document.addEventListener('DOMContentLoaded', () => {
    const answers = {};
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    const errorMessage = document.getElementById('error-message');
    const questionsContainer = document.getElementById('questions-container');
    const mainContent = document.querySelector('.quiz-layout');
    const totalQuestions = document.querySelectorAll('.question-card').length;
    let answeredQuestions = 0;

    function resetQuiz() {
        // Réinitialiser les réponses
        Object.keys(answers).forEach(key => delete answers[key]);
        answeredQuestions = 0;
        
        // Réinitialiser l'interface
        document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
        document.querySelectorAll('.range-input').forEach(range => {
            range.value = range.min;
            const event = new Event('input');
            range.dispatchEvent(event);
        });
        
        // Réinitialiser la barre de progression
        progressBar.style.width = '0%';
        progressText.textContent = '0% complété';

        // Réinitialiser les avertissements
        document.querySelectorAll('.question-card').forEach(card => {
            card.classList.remove('unanswered');
        });
        errorMessage.style.display = 'none';

        // Afficher le questionnaire et cacher les résultats
        mainContent.style.display = 'grid';
        const resultContainer = document.getElementById('result-container');
        if (resultContainer) {
            resultContainer.remove();
        }

        // Scroll vers le haut
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function updateProgress() {
        if (progressBar && progressText) {
            const progress = Math.round((answeredQuestions / totalQuestions) * 100);
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${progress}% complété`;
        }
    }

    function handleRangeInput(event) {
        const range = event.target;
        const questionId = range.closest('.question-card').querySelector('h2').textContent;
        const value = range.value;
        const unit = range.dataset.unit;
        const valueDisplay = range.parentElement.querySelector('.range-value');
        
        // Update range background
        const percent = ((value - range.min) / (range.max - range.min)) * 100;
        range.style.background = `linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) ${percent}%, #ddd ${percent}%, #ddd 100%)`;
        
        if (valueDisplay) {
            valueDisplay.textContent = `${value}${unit}`;
        }
        
        if (!answers[questionId] && value !== range.min) {
            answeredQuestions++;
            updateProgress();
        } else if (answers[questionId] && value === range.min) {
            answeredQuestions--;
            updateProgress();
        }
        
        answers[questionId] = value !== range.min ? value : null;
        range.closest('.question-card').classList.remove('unanswered');
    }

    function handleOptionClick(event) {
        const card = event.target.closest('.question-card');
        const questionId = card.querySelector('h2').textContent;
        const isMultiple = card.dataset.multiple === 'true';
        
        if (isMultiple) {
            if (!answers[questionId]) {
                answers[questionId] = [];
                answeredQuestions++;
                updateProgress();
            }
            
            event.target.classList.toggle('selected');
            const selectedOptions = card.querySelectorAll('.option-btn.selected');
            answers[questionId] = Array.from(selectedOptions).map(btn => btn.textContent);

            if (answers[questionId].length === 0) {
                answeredQuestions--;
                updateProgress();
                delete answers[questionId];
            }
        } else {
            if (!answers[questionId]) {
                answeredQuestions++;
                updateProgress();
            }
            
            const buttons = card.querySelectorAll('.option-btn');
            buttons.forEach(btn => btn.classList.remove('selected'));
            event.target.classList.add('selected');
            answers[questionId] = event.target.textContent;
        }

        card.classList.remove('unanswered');
    }

    function validateAnswers() {
        const questions = document.querySelectorAll('.question-card');
        let allAnswered = true;
        let firstUnanswered = null;

        questions.forEach(question => {
            const questionId = question.querySelector('h2').textContent;
            const rangeInput = question.querySelector('.range-input');
            
            question.classList.remove('unanswered');
            
            let isUnanswered = false;
            if (rangeInput) {
                if (!answers[questionId] || answers[questionId] === null) {
                    isUnanswered = true;
                }
            } else if (!answers[questionId] || 
                (Array.isArray(answers[questionId]) && answers[questionId].length === 0)) {
                isUnanswered = true;
            }

            if (isUnanswered) {
                allAnswered = false;
                question.classList.add('unanswered');
                if (!firstUnanswered) {
                    firstUnanswered = question;
                }
            }
        });

        if (!allAnswered && firstUnanswered) {
            errorMessage.style.display = 'block';
            firstUnanswered.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
            return false;
        }

        errorMessage.style.display = 'none';
        return true;
    }

    function showResult(headsets) {
        // Cacher le contenu principal
        mainContent.style.display = 'none';

        // Créer et afficher le conteneur de résultats
        const resultContainer = document.createElement('div');
        resultContainer.id = 'result-container';
        resultContainer.className = 'results-card';

        const content = `
            <h2 class="results-title">Voici les casques VR recommandés pour vous</h2>
            <div class="recommendations-grid">
                ${headsets.map(headset => `
                    <div class="recommendation-card">
                        <img src="${headset.image}" alt="${headset.name}" class="logo">
                        <h3>${headset.name}</h3>
                        <p class="description">${headset.description}</p>
                        <div class="points-forts">
                            <h4>Points forts :</h4>
                            <ul>
                                ${headset.pointsForts.map(point => `<li>${point}</li>`).join('')}
                            </ul>
                        </div>
                        <p class="price">À partir de ${headset.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                        <a href="${headset.link}" target="_blank" class="view-offer-btn">En savoir plus</a>
                    </div>
                `).join('')}
            </div>
            <button class="restart-btn" onclick="resetQuiz()">Recommencer le questionnaire</button>
        `;

        resultContainer.innerHTML = content;
        document.body.appendChild(resultContainer);

        // Scroll vers le haut
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function submitAnswers() {
        if (!validateAnswers()) {
            return;
        }

        try {
            const response = await fetch('/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(answers)
            });
            
            const result = await response.json();
            showResult(result.headsets);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Initialize all range inputs
    document.querySelectorAll('.range-input').forEach(range => {
        range.value = range.min;
        const event = new Event('input');
        range.dispatchEvent(event);
    });

    // Add event listeners
    document.querySelectorAll('.option-btn').forEach(button => {
        button.addEventListener('click', handleOptionClick);
    });

    document.querySelectorAll('.range-input').forEach(range => {
        range.addEventListener('input', handleRangeInput);
    });

    // Add submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Voir ma recommandation';
    submitButton.className = 'submit-btn';
    submitButton.addEventListener('click', submitAnswers);
    questionsContainer.appendChild(submitButton);

    // Make resetQuiz function globally available
    window.resetQuiz = resetQuiz;
});