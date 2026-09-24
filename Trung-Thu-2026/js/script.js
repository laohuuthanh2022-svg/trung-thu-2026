/* =========================================
   I. CONFIGURATION (CẤU HÌNH BỨC THƯ)
========================================= */
const CONFIG = {
    recipientName: "Thanh Vy",
    senderName: "Một người bạn luôn ủng hộ cậu",
    musicEnabled: true,
    letterText: "Có những ngày bận rộn đến mức người ta quên mất việc ngước nhìn lên bầu trời. Nhưng hôm nay là một đêm trăng rằm, và ánh trăng thì luôn nhắc chúng ta nhớ về những điều dịu dàng nhất.<br><br>Mong cậu hôm nay và những ngày tháng sau này sẽ luôn giữ nụ cười rạng rỡ . Nếu có lúc nào mệt mỏi, hãy nhớ rằng luôn có những người bạn — như mình — sẵn sàng lắng nghe và chia sẻ.<br><br><span class='serif highlight' style='font-size: 1.5rem;'>Chúc Thanh Vy một Trung Thu thật ấm áp, trọn vẹn và hạnh phúc. 🌕</span>"
};

document.querySelectorAll('.r-name').forEach(el => el.textContent = CONFIG.recipientName);
document.getElementById('s-name').textContent = CONFIG.senderName;

/* =========================================
   II. LOADER & BẮT ĐẦU (CINEMATIC TIMELINE)
========================================= */
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(() => document.getElementById('loader').style.display = 'none', 1500);
    }, 1000);
});

const bgm = document.getElementById('bgm');
const musicControl = document.getElementById('music-control');
let isMusicPlaying = false;

// Cải tiến hàm cuộn: Cuộn từ từ đến mép trên của phần tử để đọc dễ hơn
function autoScrollTo(id, delay) {
    setTimeout(() => {
        const el = document.getElementById(id);
        const y = el.getBoundingClientRect().top + window.scrollY - 50; // Cân chỉnh lại vị trí để không bị lấp
        window.scrollTo({ top: y, behavior: 'smooth' });
    }, delay);
}

document.getElementById('btn-start').addEventListener('click', () => {
    document.body.classList.remove('locked');
    
    if (CONFIG.musicEnabled) {
        musicControl.style.opacity = "1";
        bgm.volume = 0.5;
        bgm.play().then(() => {
            isMusicPlaying = true;
            musicControl.textContent = "🔊";
        }).catch(() => {
            isMusicPlaying = false;
            musicControl.textContent = "🔈";
        });
    }

    autoScrollTo('s2-night', 500);
    autoScrollTo('s3-rabbit', 9500);
    autoScrollTo('s4-wishes', 18000);
    autoScrollTo('s5-gift', 27000);
});

musicControl.addEventListener('click', () => {
    if (isMusicPlaying) { bgm.pause(); musicControl.textContent = "🔈"; } 
    else { bgm.play(); musicControl.textContent = "🔊"; }
    isMusicPlaying = !isMusicPlaying;
});

/* =========================================
   III. SCROLL OBSERVER & TYPEWRITER CẢI TIẾN
========================================= */
const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            if(entry.target.classList.contains('stagger-text')) {
                const paras = entry.target.querySelectorAll('p');
                paras.forEach((p, index) => {
                    setTimeout(() => { p.style.opacity = '1'; p.style.transform = 'translateY(0)'; }, index * 1200);
                });
            }
            
            if(entry.target.classList.contains('final-message') && !entry.target.dataset.typed) {
                entry.target.dataset.typed = "true";
                // Chỉnh lại CSS để hiển thị mượt hơn trên Mobile
                const msgBox = entry.target;
                msgBox.style.height = 'auto'; // Cho phép tự giãn chiều cao
                msgBox.style.paddingBottom = '3rem';
                
                typeWriterEffect(CONFIG.letterText, document.getElementById('typewriter-text'));
            }
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.fade-in, .stagger-text').forEach(el => observer.observe(el));

// Hàm Typewriter cải tiến: Có con trỏ nhấp nháy, tự cuộn theo chữ và có độ trễ ngẫu nhiên
function typeWriterEffect(text, element) {
    element.innerHTML = "<span id='typing-cursor'>|</span>"; // Thêm con trỏ nhấp nháy
    let i = 0;
    let isTag = false;
    let textBuffer = "";
    
    // Thêm CSS cho con trỏ nhấp nháy ngay trong JS cho tiện
    const style = document.createElement('style');
    style.innerHTML = `@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } } #typing-cursor { font-weight: bold; animation: blink 1s step-end infinite; }`;
    document.head.appendChild(style);

    function type() {
        if (i < text.length) {
            let char = text.charAt(i);
            
            // Xử lý HTML Tag (để không in ra chữ <br>)
            if (char === '<') isTag = true;
            textBuffer += char;
            if (char === '>') isTag = false;
            
            if (!isTag) {
                element.innerHTML = textBuffer + "<span id='typing-cursor'>|</span>";
                
                // TỰ ĐỘNG CUỘN THEO CHỮ (Chống tràn màn hình mobile)
                // Cứ gõ được 1 đoạn là tự nhích màn hình xuống một chút
                if (i % 20 === 0) {
                   const cursorY = element.getBoundingClientRect().bottom + window.scrollY;
                   if (cursorY > window.scrollY + window.innerHeight - 100) {
                       window.scrollBy({ top: 50, behavior: 'smooth' });
                   }
                }

                // Tốc độ gõ ngẫu nhiên (30ms - 80ms) tạo cảm giác người thật gõ
                let randomSpeed = Math.floor(Math.random() * (80 - 30 + 1)) + 30;
                
                // Nếu gặp dấu câu, dừng lâu hơn một chút (300ms) để ngắt nghỉ
                if (['.', ',', '!', '?'].includes(char)) randomSpeed = 300;

                setTimeout(type, randomSpeed);
            } else {
                type(); // Chạy lướt qua tag HTML
            }
            i++;
        } else {
            // Khi gõ xong
            document.getElementById('typing-cursor').style.display = 'none'; // Xóa con trỏ
            setTimeout(() => {
                const sig = document.getElementById('signature');
                sig.style.display = 'block';
                sig.classList.add('visible');
                
                // Cuộn nhẹ xuống chữ ký
                window.scrollBy({ top: 100, behavior: 'smooth' });

                // Đợi 8 giây cho người nhận đọc xong thư rồi mới qua Ending
                autoScrollTo('s9-ending', 8000); 
            }, 1000);
        }
    }
    setTimeout(type, 1500); 
}

/* =========================================
   IV. INTERACTIVE LOGIC
========================================= */
document.getElementById('btn-open-gift').addEventListener('click', function() {
    document.getElementById('gift-box').classList.add('opened');
    this.style.display = 'none';
    createParticles(window.innerWidth/2, window.innerHeight/2, 40, '#F5D76E');
    setTimeout(() => {
        const msg = document.getElementById('gift-message');
        msg.innerHTML = "Quà không có gì to tát đâu.<br><br><span class='highlight'>Chỉ là một lời chúc được gói lại cho đẹp thôi.</span>";
        msg.style.opacity = 1;
        autoScrollTo('s6-mooncakes', 4000);
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
            autoScrollTo('s7-wish', 5000);
        }, 300);
    });
});

document.getElementById('btn-wish').addEventListener('click', function() {
    this.style.display = 'none';
    createParticles(window.innerWidth / 2, window.innerHeight / 2, 150, '#F5D76E', true);
    setTimeout(() => { 
        document.getElementById('wish-result').style.opacity = 1; 
        autoScrollTo('s8-message', 4000);
    }, 2500);
});

document.getElementById('btn-restart').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => location.reload(), 800); 
});

/* =========================================
   V. CANVAS ADVANCED
========================================= */
const canvas = document.getElementById('sky-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let stars = [], particles = [], fireflies = [];
let mouse = { x: null, y: null };

window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });
window.addEventListener('touchmove', e => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; });
window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });
window.addEventListener('touchend', () => { mouse.x = null; mouse.y = null; });

function initCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    stars = []; fireflies = [];
    for(let i=0; i<150; i++) { stars.push({ x: Math.random() * width, y: Math.random() * height, r: Math.random() * 1.5, alpha: Math.random(), speed: Math.random() * 0.02 }); }
    for(let i=0; i<30; i++) { fireflies.push({ x: Math.random() * width, y: Math.random() * height, r: Math.random() * 2 + 1, vx: (Math.random()-0.5)*0.5, vy: (Math.random()-0.5)*0.5 }); }
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
    stars.forEach(s => {
        s.alpha += s.speed;
        if(s.alpha > 1 || s.alpha < 0.2) s.speed *= -1;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`; ctx.fill();
    });

    fireflies.forEach(f => {
        f.x += f.vx; f.y += f.vy;
        if(f.x < 0 || f.x > width) f.vx *= -1;
        if(f.y < 0 || f.y > height) f.vy *= -1;
        if(mouse.x != null && mouse.y != null) {
            let dx = mouse.x - f.x; let dy = mouse.y - f.y; let dist = Math.sqrt(dx*dx + dy*dy);
            if(dist < 100) { f.x -= dx * 0.05; f.y -= dy * 0.05; }
        }
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(245, 215, 110, 0.6)';
        ctx.shadowBlur = 10; ctx.shadowColor = '#F5D76E'; ctx.fill(); ctx.shadowBlur = 0;
    });

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
