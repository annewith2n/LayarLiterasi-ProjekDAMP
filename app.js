document.addEventListener('DOMContentLoaded', () => {
    // App State / Initial Values from the Design Mockup
    const state = {
        baseProgress: 40,      // Starting progress (matches the design mockup)
        currentProgress: 40,
        baseRead: 5,           // Starting read stat
        baseStars: 20,         // Starting stars stat
        baseStreaks: 4         // Starting streaks stat
    };

    // DOM Elements
    const checkboxes = document.querySelectorAll('.task-checkbox');
    const progressBarFill = document.getElementById('progressBarFill');
    const progressAvatarIndicator = document.getElementById('progressAvatarIndicator');
    const statRead = document.getElementById('statRead');
    const statStars = document.getElementById('statStars');
    const statStreaks = document.getElementById('statStreaks');
    const navItems = document.querySelectorAll('.nav-item');
    const dayCards = document.querySelectorAll('.day-card');

    // Initialize UI Position
    updateProgressUI();

    // 1. Task Checkbox Interactivity
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            const label = e.target.closest('.task-item-label');

            // Play a small click scale animation
            label.style.transform = 'scale(0.97)';
            setTimeout(() => {
                label.style.transform = '';
            }, 100);

            // Trigger Confetti if checked
            if (isChecked) {
                createConfetti(e.target);
            }

            // Recalculate stats and progress
            updateStatsAndProgress();
        });
    });

    // Function to calculate and update UI elements
    function updateStatsAndProgress() {
        let checkedCount = 0;
        checkboxes.forEach(cb => {
            if (cb.checked) checkedCount++;
        });

        // 1. Update Progress
        // Each task adds 20% to the base 40% (total 100% when all 3 completed)
        state.currentProgress = state.baseProgress + (checkedCount * 20);
        updateProgressUI();

        // 2. Update Stats with Animations
        // Update Read count (each task adds +1)
        const targetRead = state.baseRead + checkedCount;
        animateValue(statRead, parseInt(statRead.textContent), targetRead);

        // Update Stars count (each task adds +5 stars)
        const targetStars = state.baseStars + (checkedCount * 5);
        animateValue(statStars, parseInt(statStars.textContent), targetStars);

        // Update Streaks count (streaks increase by 1 only if ALL tasks are complete today)
        const targetStreaks = checkedCount === checkboxes.length ? state.baseStreaks + 1 : state.baseStreaks;
        animateValue(statStreaks, parseInt(statStreaks.textContent), targetStreaks);

        // Also light up Thursday status if all tasks are complete
        const thurDay = document.querySelector('.day-card.today');
        if (thurDay) {
            const flameIcon = thurDay.querySelector('.icon-flame');
            if (checkedCount === checkboxes.length) {
                thurDay.classList.add('checked');
                if (flameIcon) {
                    flameIcon.style.color = '#FFFFFF';
                    flameIcon.style.filter = 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.8))';
                }
            } else {
                thurDay.classList.remove('checked');
                if (flameIcon) {
                    flameIcon.style.color = 'var(--primary-color)';
                    flameIcon.style.filter = '';
                }
            }
        }
    }

    // Update Progress bar width & avatar location
    function updateProgressUI() {
        progressBarFill.style.width = `${state.currentProgress}%`;
        progressAvatarIndicator.style.left = `${state.currentProgress}%`;
    }

    // Number counting animator with bounce effect
    function animateValue(element, start, end) {
        if (start === end) return;
        
        element.classList.remove('animate-stat');
        void element.offsetWidth; // Trigger reflow to restart CSS animation
        element.classList.add('animate-stat');
        
        element.textContent = end;
    }

    // 2. Bottom Navigation Tab Indicator Toggle
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Add a subtle bubble pop effect
            item.style.transform = 'scale(0.85)';
            setTimeout(() => {
                item.style.transform = '';
            }, 150);
        });
    });

    // 3. Day Cards toggle check demo
    dayCards.forEach(card => {
        card.addEventListener('click', () => {
            // Only toggle for future/past days that aren't "Thur" (which responds to task completion)
            if (!card.classList.contains('today')) {
                card.classList.toggle('checked');
                
                // If checking, toggle status icon display
                const statusSpan = card.querySelector('.day-status');
                if (statusSpan) {
                    statusSpan.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        statusSpan.style.transform = 'scale(1)';
                    }, 150);
                }
            }
        });
    });

    // 4. Celebration Confetti Effect Creator
    function createConfetti(triggerElement) {
        const rect = triggerElement.getBoundingClientRect();
        const appScreen = document.getElementById('appScreen');
        const screenRect = appScreen.getBoundingClientRect();
        
        // Origin coordinates relative to the screen container
        const originX = rect.left - screenRect.left + rect.width / 2;
        const originY = rect.top - screenRect.top + rect.height / 2;

        const colors = ['#D8F55A', '#3E3275', '#E5FAC0', '#C9C7ED', '#FF5A79', '#FFD85A'];

        for (let i = 0; i < 20; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Random styling sizing
            const size = Math.random() * 6 + 5;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            
            // Place initially at click location
            confetti.style.left = `${originX}px`;
            confetti.style.top = `${originY}px`;
            
            appScreen.appendChild(confetti);

            // Calculate trajectory
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 8 + 4;
            const dx = Math.cos(angle) * velocity;
            const dy = Math.sin(angle) * velocity - 2; // slight upward drift bias

            let x = originX;
            let y = originY;
            let gravity = 0.25;
            let opacity = 1;

            // Frame animation
            function updateConfetti() {
                x += dx;
                y += dy + gravity;
                gravity += 0.08;
                opacity -= 0.025;

                confetti.style.left = `${x}px`;
                confetti.style.top = `${y}px`;
                confetti.style.opacity = opacity;

                if (opacity > 0) {
                    requestAnimationFrame(updateConfetti);
                } else {
                    confetti.remove();
                }
            }

            requestAnimationFrame(updateConfetti);
        }
    }
});
