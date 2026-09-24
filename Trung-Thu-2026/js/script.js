/* =========================================
   I. CONFIGURATION (CẤU HÌNH BỨC THƯ MỚI)
========================================= */
const CONFIG = {
    recipientName: "Cậu",
    senderName: "Một người bạn luôn ủng hộ cậu",
    musicEnabled: true,
    // Bức thư đã được viết lại dài hơn, sâu sắc và trưởng thành hơn
    letterText: "Có những ngày bận rộn đến mức người ta quên mất việc ngước nhìn lên bầu trời. Nhưng hôm nay là một đêm trăng rằm, và ánh trăng thì luôn nhắc chúng ta nhớ về những điều dịu dàng nhất.<br><br>Mong cậu của hôm nay và những ngày tháng sau này sẽ luôn giữ nụ cười rạng rỡ . Nếu có lúc nào mệt mỏi, hãy nhớ rằng luôn có những người bạn — như mình — sẵn sàng lắng nghe và chia sẻ.<br><br><span class='serif highlight' style='font-size: 1.5rem;'>Chúc cậu một Trung Thu thật ấm áp, trọn vẹn và hạnh phúc. 🌕</span>"
};

document.querySelectorAll('.r-name').forEach(el => el.textContent = CONFIG.recipientName);
document.getElementById('s-name').textContent = CONFIG.senderName;

/* =========================================
   II. LOADER & BẮT ĐẦU (TỰ ĐỘNG CHẠY THƯỚC PHIM)
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

// Hàm tự động cuộn mượt mà
function autoScrollTo(id, delay) {
    setTimeout(() => {
        document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'center' });
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

    // BẮT ĐẦU CHUỖI TỰ ĐỘNG LƯỚT (CINEMATIC TIMELINE)
    // 1. Lướt xuống màn đêm
    autoScrollTo('s2-night', 500);
    
    // 2. Lướt xuống thỏ ngọc sau 9.5 giây
    autoScrollTo('s3-rabbit', 9500);
    
    // 3. Lướt xuống lời chúc sau 18 giây
    autoScrollTo('s4-wishes', 18000);
    
    // 4. Lướt xuống Hộp quà sau 27 giây (Dừng lại đợi người dùng bấm)
    autoScrollTo('s5-gift', 27000);
});

musicControl.addEventListener('click', () => {
    if (isMusicPlaying) { bgm.pause(); musicControl.textContent = "🔈"; } 
    else { bgm.play(); musicControl.textContent = "🔊"; }
    isMusicPlaying = !isMusicPlaying;
});

/* =========================================
   III. SCROLL OBSERVER & TYPEWRITER (HIỆN CHỮ TỪ TỪ)
========================================= */
const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Hiện chữ từng dòng chậm rãi
            if(entry.target.classList.contains('stagger-text')) {
                const paras = entry.target.querySelectorAll('p');
                paras.forEach((p, index) => {
                    setTimeout(() => { p.style.opacity = '1'; p.style.transform = 'translateY(0)'; }, index * 1200); // 1.2s mỗi dòng
                });
            }
            
            // Đánh chữ từ từ cho lá thư cuối
            if(entry.target.classList.contains('final-message') && !entry.target.dataset.typed) {
                entry.target.dataset.typed = "true";
                typeWriterEffect(CONFIG.letterText, document.getElementById('typewriter-text'), 40);
            }
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.fade-in, .stagger-text').forEach(el => observer.observe(el));

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
                type();
            }
            i++;
        } else {
            setTimeout(() => {
                document.getElementById('signature').style.display = 'block';
                document.getElementById('signature').classList.add('visible');
                // Chờ đọc xong thư rồi tự cuộn xuống Ending
                autoScrollTo('s9-ending', 6000); 
            }, 1000);
        }
    }
    setTimeout(type, 1500); 
}

/* =========================================
   IV. INTERACTIVE LOGIC (QUÀ & BÁNH & ĐIỀU ƯỚC)
========================================= */
document.getElementById('btn-open-gift').addEventListener('click', function() {
    document.getElementById('gift-box').classList.add('opened');
    this.style.display = 'none';
    createParticles(window.innerWidth/2, window.innerHeight/2, 40, '#F5D76E');
    setTimeout(() => {
        const msg = document.getElementById('gift-message');
        msg.innerHTML = "Quà không có gì to tát đâu.<br><br><span class='highlight'>Chỉ là một lời chúc được gói lại cho đẹp thôi.</span>";
        msg.style.opacity = 1;
        
        // Tự cuộn xuống phần bánh sau khi xem quà 4s
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
            
            // Tự cuộn xuống phần điều ước sau khi xem bánh 5s
            autoScrollTo('s7-wish', 5000);
        }, 300);
    });
});

document.getElementById('btn-wish').addEventListener('click', function() {
    this.style.display = 'none';
    createParticles(window.innerWidth / 2, window.innerHeight / 2, 150, '#F5D76E', true);
    setTimeout(() => { 
        document.getElementById('wish-result').style.opacity = 1; 
        // Tự cuộn xuống bức thư sau khi ước 4s
        autoScrollTo('s8-message', 4000);
    }, 2500);
});

document.getElementById('btn-restart').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => location.reload(), 800); // Reload lại để reset chuỗi tự động
});

/* =========================================
   V. CANVAS ADVANCED (Sao & Đom Đóm)
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
    for(let i=0; i<150; i++) {
        stars.push({ x: Math.random() * width, y: Math.random() * height, r: Math.random() * 1.5, alpha: Math.random(), speed: Math.random() * 0.02 });
    }
    for(let i=0; i<30; i++) {
        fireflies.push({ x: Math.random() * width, y: Math.random() * height, r: Math.random() * 2 + 1, vx: (Math.random()-0.5)*0.5, vy: (Math.random()-0.5)*0.5 });
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
