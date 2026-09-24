/* =========================================
   I. CONFIGURATION
========================================= */
const CONFIG = {
    recipientName: "Cậu",
    senderName: "Một người bạn vẫn luôn chúc cậu những điều tốt đẹp",
    musicEnabled: true,
    letterText: "Trung Thu vui vẻ nhé.<br><br>Không cần phải là một người đặc biệt theo cách nào đó mới có thể gửi cho nhau một lời chúc. Chỉ đơn giản là mình vẫn trân trọng việc chúng ta có thể trở thành bạn của nhau sau tất cả.<br><br>Mong cậu luôn vui, luôn bình an và gặp được thật nhiều điều tốt đẹp.<br><br><span class='serif highlight' style='font-size: 1.5rem;'>Chúc cậu một mùa Trung Thu thật vui. 🌕</span>"
};

// Đổ dữ liệu Config vào HTML
document.querySelectorAll('.r-name').forEach(el => el.textContent = CONFIG.recipientName);
document.getElementById('s-name').textContent = CONFIG.senderName;

/* =========================================
   II. LOADER & BẮT ĐẦU
========================================= */
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loader').style.display = 'none';
        }, 1500);
    }, 1000);
});

const bgm = document.getElementById('bgm');
const musicControl = document.getElementById('music-control');
let isMusicPlaying = false;

document.getElementById('btn-start').addEventListener('click', () => {
    document.body.classList.remove('locked');
    
    if (CONFIG.musicEnabled) {
        musicControl.style.opacity = "1";
        bgm.volume = 0.5; // Âm lượng vừa phải
        bgm.play().then(() => {
            isMusicPlaying = true;
            musicControl.textContent = "🔊";
        }).catch(() => {
            isMusicPlaying = false;
            musicControl.textContent = "🔈";
        });
    }
    document.getElementById('s2-night').scrollIntoView({ behavior: 'smooth' });
});

musicControl.addEventListener('click', () => {
    if (isMusicPlaying) { bgm.pause(); musicControl.textContent = "🔈"; } 
    else { bgm.play(); musicControl.textContent = "🔊"; }
    isMusicPlaying = !isMusicPlaying;
});

/* =========================================
   III. SCROLL OBSERVER & TYPEWRITER
========================================= */
const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Stagger text (hiện từng câu)
            if(entry.target.classList.contains('stagger-text')) {
                const paras = entry.target.querySelectorAll('p');
                paras.forEach((p, index) => {
                    setTimeout(() => { p.style.opacity = '1'; p.style.transform = 'translateY(0)'; }, index * 800);
                });
            }
            
            // Trigger Typewriter cho Section 8
            if(entry.target.classList.contains('final-message') && !entry.target.dataset.typed) {
                entry.target.dataset.typed = "true";
                typeWriterEffect(CONFIG.letterText, document.getElementById('typewriter-text'), 50);
            }

            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.fade-in, .stagger-text').forEach(el => observer.observe(el));

// Hàm đánh chữ (hỗ trợ HTML tags)
function typeWriterEffect(text, element, speed) {
    element.innerHTML = "";
    let i = 0;
    let isTag = false;
    let textBuffer = "";
    
    function type() {
        if (i < text.length) {
            let char = text.charAt(i);
            if (char === '<') isTag = true;
            
            textBuffer += char;
            if (char === '>') isTag = false;
            
            if (!isTag) {
                element.innerHTML = textBuffer;
                setTimeout(type, speed);
            } else {
                type(); // Chạy nhanh qua HTML tags
            }
            i++;
        } else {
            document.getElementById('signature').style.display = 'block';
            document.getElementById('signature').classList.add('visible');
        }
    }
    setTimeout(type, 1000); // Đợi 1s sau khi scroll tới mới bắt đầu gõ
}

/* =========================================
   IV. INTERACTIVE LOGIC (Gift, Mooncakes, Wish)
========================================= */
document.getElementById('btn-open-gift').addEventListener('click', function() {
    document.getElementById('gift-box').classList.add('opened');
    this.style.display = 'none';
    createParticles(window.innerWidth/2, window.innerHeight/2, 40, '#F5D76E');
    setTimeout(() => {
        const msg = document.getElementById('gift-message');
        msg.innerHTML = "Quà không có gì to tát đâu.<br><br><span class='highlight'>Chỉ là một lời chúc được gói lại cho đẹp thôi.</span>";
        msg.style.opacity = 1;
    }, 1500);
});

const messages = {
    "1": "Mong những ngày bận rộn đến đâu,<br>cậu vẫn luôn có thời gian để nghỉ ngơi.",
    "2": "Mong những điều cậu cố gắng<br>đều gặp được một chút may mắn đúng lúc.",
    "3": "Mong cậu vẫn luôn giữ được<br>những điều khiến cậu cười thật lòng.",
    "4": "Điều ước cuối cùng...<br><span style='color:var(--text-accent)'>cậu tự ước nhé.</span>"
};

document.querySelectorAll('.mooncake-item').forEach(cake => {
    cake.addEventListener('click', () => {
        document.querySelectorAll('.mooncake-item').forEach(c => c.classList.remove('active'));
        cake.classList.add('active');
        const detail = document.getElementById('mooncake-detail');
        detail.style.opacity = 0;
        setTimeout(() => {
            detail.innerHTML = messages[cake.getAttribute('data-id')];
            detail.style.opacity = 1;
        }, 300);
    });
});

document.getElementById('btn-wish').addEventListener('click', function() {
    this.style.display = 'none';
    createParticles(window.innerWidth / 2, window.innerHeight / 2, 100, '#F5D76E', true);
    setTimeout(() => { document.getElementById('wish-result').style.opacity = 1; }, 2500);
});

document.getElementById('btn-restart').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =========================================
   V. CANVAS ADVANCED (Sao & Đom Đóm tương tác)
========================================= */
const canvas = document.getElementById('sky-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let stars = [], particles = [], fireflies = [];
let mouse = { x: null, y: null };

// Theo dõi con trỏ / ngón tay
window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });
window.addEventListener('touchmove', e => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; });
window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });
window.addEventListener('touchend', () => { mouse.x = null; mouse.y = null; });

function initCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    stars = []; fireflies = [];
    
    // Sao nền
    for(let i=0; i<150; i++) {
        stars.push({
            x: Math.random() * width, y: Math.random() * height,
            r: Math.random() * 1.5, alpha: Math.random(), speed: Math.random() * 0.02
        });
    }
    // Đom đóm (Ambient particles)
    for(let i=0; i<30; i++) {
        fireflies.push({
            x: Math.random() * width, y: Math.random() * height,
            r: Math.random() * 2 + 1, vx: (Math.random()-0.5)*0.5, vy: (Math.random()-0.5)*0.5
        });
    }
}

function createParticles(x, y, amount, color, isExplosion = false) {
    for(let i=0; i<amount; i++) {
        particles.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * (isExplosion ? 12 : 4),
            vy: (Math.random() - 0.5) * (isExplosion ? 12 : 4) - (isExplosion ? 2 : 0),
            r: Math.random() * 3 + 1, color: color, alpha: 1, decay: Math.random() * 0.015 + 0.005
        });
    }
}

function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    
    // Sao lấp lánh
    stars.forEach(s => {
        s.alpha += s.speed;
        if(s.alpha > 1 || s.alpha < 0.2) s.speed *= -1;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`; ctx.fill();
    });

    // Đom đóm (né chuột)
    fireflies.forEach(f => {
        f.x += f.vx; f.y += f.vy;
        if(f.x < 0 || f.x > width) f.vx *= -1;
        if(f.y < 0 || f.y > height) f.vy *= -1;

        // Interaction
        if(mouse.x != null && mouse.y != null) {
            let dx = mouse.x - f.x;
            let dy = mouse.y - f.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if(dist < 100) { // Nếu con trỏ lại gần, đom đóm dạt ra
                f.x -= dx * 0.05;
                f.y -= dy * 0.05;
            }
        }
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(245, 215, 110, 0.6)';
        ctx.shadowBlur = 10; ctx.shadowColor = '#F5D76E';
        ctx.fill(); ctx.shadowBlur = 0; // Reset
    });

    // Particles nổ
    for(let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx; p.y += p.vy; p.alpha -= p.decay;
        if(p.alpha <= 0) { particles.splice(i, 1); continue; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha; ctx.fill(); ctx.globalAlpha = 1;
    }
    requestAnimationFrame(animateCanvas);
}

window.addEventListener('resize', initCanvas);
initCanvas(); animateCanvas();