document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const loading = document.getElementById('loading');
    const loadingText = document.getElementById('loading-text');
    const mainContent = document.getElementById('main-content');
    const confession = document.getElementById('confession');
    const muteBtn = document.getElementById('mute-btn');
    const audio = document.getElementById('backsound');

    // Create overlay for prompting user interaction
    const overlay = document.createElement('div');
    overlay.id = 'audio-overlay';
    overlay.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 hidden';
    overlay.innerHTML = `
        <div class="text-center text-white">
            <p class="text-xl font-light mb-4">Klik untuk memulai perasaan ini...</p>
            <button class="px-6 py-2 bg-pink-300 text-white rounded-full hover:bg-pink-400 transition">Mulai</button>
        </div>
    `;
    document.body.appendChild(overlay);

    // Loading screen messages
    const loadingMessages = [
        'Ngumpulin keberanian…',
        'Menyiapkan kata-kata…'
    ];
    let loadingIndex = 0;

    // Show loading messages with delay
    loadingText.textContent = loadingMessages[0];
    setTimeout(() => {
        loadingText.textContent = loadingMessages[1];
    }, 1500);

    // Hide loading screen and attempt audio playback
    setTimeout(() => {
        loading.classList.add('hidden');
        mainContent.classList.remove('hidden');
        startConfession();
        playAudio();
    }, 3000);

    // Function to play audio and handle autoplay restrictions
    function playAudio() {
        audio.muted = false;
        audio.volume = 0.5;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Audio started playing automatically');
                    muteBtn.textContent = 'Mute';
                    muteBtn.classList.add('bg-pink-300');
                    overlay.classList.add('hidden');
                })
                .catch(error => {
                    console.error('Autoplay failed:', error);
                    // Show overlay to prompt single click
                    overlay.classList.remove('hidden');
                    mainContent.classList.add('opacity-50'); // Dim main content
                    const startButton = overlay.querySelector('button');
                    startButton.addEventListener('click', () => {
                        audio.play().then(() => {
                            console.log('Audio started after user click');
                            overlay.classList.add('hidden');
                            mainContent.classList.remove('opacity-50');
                            muteBtn.textContent = 'Mute';
                            muteBtn.classList.remove('bg-red-300', 'animate-pulse');
                            muteBtn.classList.add('bg-pink-300');
                        }).catch(err => {
                            console.error('Manual play failed:', err);
                        });
                    }, { once: true });
                });
        }
    }

    // Confession messages
    const messages = [
        'Hai kamu...',
        'Aku gak tau gimana cara ngomong langsung...',
        'Jadi aku bikin ini.',
        'Aku suka kamu.',
        'Tapi baru berani sekarang buat ngungkapin.',
        'jadi mau ga kamu jadi pacar aku.'
    ];

    // Typing animation
    function startConfession() {
        let index = 0;
        function typeMessage() {
            if (index < messages.length) {
                let p = document.createElement('p');
                p.textContent = messages[index];
                p.classList.add('opacity-0', 'transition-opacity', 'duration-1000');
                confession.appendChild(p);
                setTimeout(() => {
                    p.classList.remove('opacity-0');
                    p.classList.add('opacity-100');
                }, 100);
                index++;
                setTimeout(typeMessage, 4000);
            }
        }
        typeMessage();
    }

    // Mute/Unmute audio
    muteBtn.addEventListener('click', () => {
        if (audio.muted) {
            audio.muted = false;
            muteBtn.textContent = 'Mute';
            muteBtn.classList.remove('bg-red-300', 'animate-pulse');
            muteBtn.classList.add('bg-pink-300');
        } else {
            audio.muted = true;
            muteBtn.textContent = 'Unmute';
            muteBtn.classList.remove('bg-red-300', 'animate-pulse');
            muteBtn.classList.add('bg-pink-300');
        }
    });

    // Falling hearts animation
    const canvas = document.getElementById('hearts-canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    function createHeart() {
        const heart = {
            x: Math.random() * canvas.width,
            y: -20,
            speed: 1 + Math.random() * 2,
            opacity: Math.random() * 0.5 + 0.5
        };
        return heart;
    }

    let hearts = [];
    for (let i = 0; i < 20; i++) {
        hearts.push(createHeart());
    }

    function animateHearts() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hearts.forEach((heart, index) => {
            ctx.font = '20px Arial';
            ctx.fillStyle = `rgba(255, 182, 193, ${heart.opacity})`;
            ctx.fillText('♥', heart.x, heart.y);
            heart.y += heart.speed;
            if (heart.y > canvas.height) {
                hearts[index] = createHeart();
            }
        });
        requestAnimationFrame(animateHearts);
    }
    animateHearts();
});
