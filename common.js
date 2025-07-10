const STORAGE_KEY = "hunt2025_progress";
const SALT = "--ShireMint2025";

function generateHash(password) {
    const hash = CryptoJS.SHA256(password + SALT).toString(CryptoJS.enc.Hex);
    return hash.slice(0, 24);
}

function loadProgress() {
    try { 
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; 
    } catch { 
        return []; 
    }
}

function saveProgress(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function jumpTo(lastPassword) {
    if (lastPassword === "ribosome") {
        window.location.href = "../final.html";
    } else {
        const hash = generateHash(lastPassword);
        window.location.href = hash + ".html";
    }
}

function showFeedback(message, isSuccess) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.className = isSuccess ? 'feedback success' : 'feedback error';
    feedback.style.display = 'block';
    
    if (!isSuccess) {
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 3000);
    }
}

function initializeClue(currentClueAnswer, expectedAnswer, isMultiWord = false) {
    const progress = loadProgress();
    const continueSection = document.getElementById('continueSection');
    const continueBtn = document.getElementById('continueBtn');
    const resetBtn = document.getElementById('resetBtn');

    if (progress.length > 0 && progress.at(-1) !== currentClueAnswer) {
        continueSection.style.display = 'block';
        continueBtn.onclick = () => jumpTo(progress.at(-1));
        resetBtn.onclick = () => {
            if (confirm('Are you sure you want to reset all progress?')) {
                localStorage.removeItem(STORAGE_KEY);
                window.location.href = '../index.html';
            }
        };
    }

    document.getElementById('passwordForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        let answer;
        if (isMultiWord) {
            const words = [];
            let i = 1;
            while (document.getElementById(`word${i}`)) {
                const word = document.getElementById(`word${i}`).value.toLowerCase().trim();
                if (!word) {
                    showFeedback(`Please fill in all ${isMultiWord} words!`, false);
                    return;
                }
                words.push(word);
                i++;
            }
            answer = words.join('-');
        } else {
            const input = document.getElementById('passwordInput');
            answer = input.value.toLowerCase().trim();
        }
        
        if (answer === expectedAnswer) {
            const currentProgress = loadProgress();
            if (!currentProgress.includes(answer)) {
                currentProgress.push(answer);
                saveProgress(currentProgress);
            }
            
            showFeedback('Correct! Redirecting to next clue...', true);
            setTimeout(() => {
                if (answer === "ribosome") {
                    window.location.href = "../final.html";
                } else {
                    const hash = generateHash(answer);
                    window.location.href = hash + ".html";
                }
            }, 1500);
        } else {
            showFeedback('Not quite right. Try again!', false);
            if (isMultiWord) {
                let i = 1;
                while (document.getElementById(`word${i}`)) {
                    document.getElementById(`word${i}`).value = '';
                    i++;
                }
                document.getElementById('word1').focus();
            } else {
                document.getElementById('passwordInput').value = '';
            }
        }
    });
}