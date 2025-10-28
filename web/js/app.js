// ========================================
// AI Muraqaba - JavaScript Application
// ========================================

// State Management
let answers = [];
let totalPoints = 0;
let maxPoints = 0;

// Hadith and Advice Database
const hadithDatabase = [
    {
        text: "حاسبوا أنفسكم قبل أن تُحاسبوا، وزِنوا أعمالكم قبل أن تُوزن عليكم",
        source: "الإمام علي بن أبي طالب (ع)"
    },
    {
        text: "من حاسب نفسه ربح، ومن غفل عنها خسر",
        source: "الإمام علي (ع)"
    },
    {
        text: "إنّ الله يحب العبد المفتش لعيوب نفسه",
        source: "الإمام جعفر الصادق (ع)"
    },
    {
        text: "ليس منّا من لم يحاسب نفسه في كل يوم",
        source: "الإمام محمد الباقر (ع)"
    },
    {
        text: "النفس إن لم تشغلها بالحق شغلتك بالباطل",
        source: "الإمام علي (ع)"
    }
];

const spiritualAdvice = {
    excellent: [
        "ما شاء الله! أنت على طريق النور الصحيح. استمر في هذا التألق الروحي 🌟",
        "بارك الله بك! نورك يضيء كالقمر في ليلة مظلمة. حافظ على هذا المستوى 💫",
        "ممتاز! قلبك متصل بأهل البيت (ع). هذا هو الطريق الحق ✨"
    ],
    good: [
        "أحسنت! لكن لا تزال هناك مساحة للتحسن. استمر في الجهاد الروحي 💪",
        "جيد جداً! أنت في الطريق الصحيح، فقط نحتاج لمزيد من الالتزام 🌙",
        "تقدم جميل! حافظ على هذا المستوى وارتقِ أكثر نحو الكمال 🙏"
    ],
    moderate: [
        "لا بأس، لكن يجب أن تبذل جهداً أكبر في محاسبة نفسك 🤲",
        "هناك مجال كبير للتحسن. تذكر أن كل خطوة صغيرة تقربك من الله 💭",
        "انتبه! نفسك تحتاج لمزيد من المراقبة والانضباط الروحي ⚠️"
    ],
    weak: [
        "تحذير: أنت بعيد عن الطريق الصحيح. عُد إلى الله قبل فوات الأوان 🚨",
        "يجب أن تستيقظ روحياً! الغفلة خطر كبير على مستقبلك الأخروي ⛔",
        "توبة الآن! لا تدع الشيطان يسيطر عليك. ارجع لربك بقلب صادق 🔴"
    ]
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    displayTodayDate();
    calculateMaxPoints();
    initializeCircleGradient();
});

// Display Today's Date in Arabic
function displayTodayDate() {
    const date = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const arabicDate = date.toLocaleDateString('ar-SA', options);
    document.getElementById('todayDate').textContent = arabicDate;
}

// Calculate Maximum Points
function calculateMaxPoints() {
    const questionCards = document.querySelectorAll('.question-card');
    questionCards.forEach(card => {
        maxPoints += parseInt(card.getAttribute('data-points'));
    });
}

// Create SVG Gradient for Circle
function initializeCircleGradient() {
    const svg = document.querySelector('.circle-progress svg');
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'gradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('style', 'stop-color:#d4af37;stop-opacity:1');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('style', 'stop-color:#6a4c93;stop-opacity:1');
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.insertBefore(defs, svg.firstChild);
}

// Handle Question Answer
function answerQuestion(button, isYes) {
    const card = button.closest('.question-card');
    const questionText = card.querySelector('h3').textContent;
    const points = parseInt(card.getAttribute('data-points'));
    const buttons = card.querySelectorAll('.answer-buttons button');
    
    // Remove previous selection
    buttons.forEach(btn => {
        btn.classList.remove('selected');
        btn.disabled = false;
    });
    
    // Mark selected button
    button.classList.add('selected');
    buttons.forEach(btn => btn.disabled = true);
    
    // Mark card as answered
    card.classList.add('answered');
    
    // Store answer
    const existingAnswer = answers.find(a => a.question === questionText);
    if (existingAnswer) {
        // Update existing answer
        if (existingAnswer.isYes) {
            totalPoints -= points;
        }
        existingAnswer.isYes = isYes;
        if (isYes) {
            totalPoints += points;
        }
    } else {
        // Add new answer
        answers.push({
            question: questionText,
            isYes: isYes,
            points: isYes ? points : 0
        });
        if (isYes) {
            totalPoints += points;
        }
    }
    
    // Update progress
    updateNoorCircle();
    
    // Check if all questions answered
    checkAllAnswered();
    
    // Add animation effect
    card.style.transform = 'scale(0.98)';
    setTimeout(() => {
        card.style.transform = 'scale(1)';
    }, 200);
}

// Update Noor Circle Progress
function updateNoorCircle() {
    const percentage = Math.round((totalPoints / maxPoints) * 100);
    const circleFill = document.getElementById('circleFill');
    const noorPercentage = document.getElementById('noorPercentage');
    
    // Calculate circle progress (534 is the circumference)
    const offset = 534 - (534 * percentage) / 100;
    
    // Animate circle
    circleFill.style.strokeDashoffset = offset;
    
    // Animate percentage number
    animateNumber(noorPercentage, 0, percentage, 1000);
}

// Animate Number
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (end - start) * progress);
        
        element.textContent = current + '%';
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Check if All Questions Answered
function checkAllAnswered() {
    const totalQuestions = document.querySelectorAll('.question-card').length;
    const submitBtn = document.getElementById('submitBtn');
    
    if (answers.length === totalQuestions) {
        submitBtn.disabled = false;
        submitBtn.style.animation = 'pulse 1.5s infinite';
    }
}

// Submit Day and Show Results
function submitDay() {
    const percentage = Math.round((totalPoints / maxPoints) * 100);
    
    // Get appropriate advice based on score
    let adviceCategory;
    if (percentage >= 80) {
        adviceCategory = 'excellent';
    } else if (percentage >= 60) {
        adviceCategory = 'good';
    } else if (percentage >= 40) {
        adviceCategory = 'moderate';
    } else {
        adviceCategory = 'weak';
    }
    
    // Select random advice and hadith
    const advice = spiritualAdvice[adviceCategory][
        Math.floor(Math.random() * spiritualAdvice[adviceCategory].length)
    ];
    const hadith = hadithDatabase[
        Math.floor(Math.random() * hadithDatabase.length)
    ];
    
    // Display advice section
    document.getElementById('adviceText').textContent = advice;
    document.getElementById('hadithText').textContent = hadith.text;
    document.getElementById('hadithSource').textContent = '- ' + hadith.source;
    document.getElementById('adviceSection').style.display = 'block';
    
    // Scroll to advice
    document.getElementById('adviceSection').scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
    
    // Disable submit button
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('submitBtn').textContent = '✅ تم إنهاء المحاسبة اليومية';
    
    // Disable all answer buttons
    document.querySelectorAll('.answer-buttons button').forEach(btn => {
        btn.disabled = true;
    });
    
    // Save to localStorage (for future AI analysis feature)
    saveDayData(percentage);
    
    // Update total noor count
    updateTotalNoor(totalPoints);
    
    // Show celebration if score is high
    if (percentage >= 80) {
        showCelebration();
    }
}

// Save Day Data to LocalStorage
function saveDayData(percentage) {
    const today = new Date().toISOString().split('T')[0];
    let history = JSON.parse(localStorage.getItem('muraqabaHistory') || '[]');
    
    history.push({
        date: today,
        percentage: percentage,
        answers: answers,
        totalPoints: totalPoints
    });
    
    localStorage.setItem('muraqabaHistory', JSON.stringify(history));
}

// Update Total Noor Count
function updateTotalNoor(points) {
    const totalNoorElement = document.getElementById('totalNoor');
    let currentTotal = parseInt(totalNoorElement.textContent);
    let newTotal = currentTotal + points;
    
    animateNumber(totalNoorElement, currentTotal, newTotal, 1500);
}

// Show Celebration Animation
function showCelebration() {
    // Create celebration overlay
    const celebration = document.createElement('div');
    celebration.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
    `;
    
    // Add emojis
    const emojis = ['✨', '🌟', '💫', '⭐', '🌙'];
    for (let i = 0; i < 30; i++) {
        const emoji = document.createElement('div');
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.cssText = `
            position: absolute;
            font-size: 2rem;
            animation: fall ${2 + Math.random() * 3}s linear;
            left: ${Math.random() * 100}%;
            top: -50px;
        `;
        celebration.appendChild(emoji);
    }
    
    document.body.appendChild(celebration);
    
    // Add fall animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
    `;
    document.head.appendChild(style);
    
    // Remove after animation
    setTimeout(() => {
        celebration.remove();
    }, 5000);
}

// Console Message
console.log('%c🌟 AI Muraqaba 🌟', 'font-size: 24px; color: #d4af37; font-weight: bold;');
console.log('%cمحاسبة النفس اليومية - حاسبوا أنفسكم قبل أن تُحاسبوا', 'font-size: 14px; color: #6a4c93;');