/* =========================================
   I. CONFIGURATION & KHỞI TẠO
========================================= */
const CONFIG = {
    recipientName: "Thanh Vy",
    senderName: "Một người bạn luôn ủng hộ cậu",
    musicEnabled: true,
    letterText: "Mong cậu của hôm nay và những ngày tháng sau này sẽ luôn giữ nụ cười rạng rỡ. Nếu có lúc nào mệt mỏi, hãy nhớ rằng luôn có những người bạn — như mình — sẵn sàng lắng nghe và chia sẻ.<br><br><span class='serif highlight' style='font-size: 1.5rem;'>Chúc Thanh Vy một Trung Thu thật ấm áp, trọn vẹn và hạnh phúc. 🌕</span>"
};

// Đổ tên vào HTML
document.querySelectorAll('.r-name').forEach(el => el.textContent = CONFIG.recipientName);
document.getElementById('s-name').textContent = CONFIG.senderName;

// Thêm viền sương mù điện ảnh
const vignette = document.createElement('div');
vignette.className = 'vignette';
document.body.appendChild(vignette);

/* =========================================
   II. HỆ THỐNG GÕ CHỮ THÔNG MINH (ĐÃ FIX LỖI 100%)
========================================= */
// Khóa layout trước khi gõ để web không bị giật
document.querySelectorAll('section').forEach(sec => {
    const texts = sec.querySelectorAll('h1, h2, .story-text, p');
    texts.forEach(txt => {
        if (['wish-result', 'gift-message', 'mooncake-detail', 'typewriter-text', 'signature'].includes(txt.id)) return;
        txt.dataset.original = txt.innerHTML;
        txt.style.minHeight = txt.offsetHeight + 'px';
        txt.innerHTML = "";
        txt.classList.add('type-ready');
    });
});

// Hàm gõ chữ mới: An toàn, mượt mà, xử lý thẻ HTML hoàn hảo
function typeHTML(element, htmlString, speed, onComplete) {
    element.innerHTML = "<span class='typing-cursor'>|</span>";
    let i = 0;
    let textBuffer = "";

    function type() {
        if (i < htmlString.length) {
            // Nếu gặp thẻ HTML (ví dụ <br>), gom hết toàn bộ thẻ đó ngay lập tức
            while (i < htmlString.length && htmlString.charAt(i) === '<') {
                while (i < htmlString.length && htmlString.charAt(i) !== '>') {
                    textBuffer += htmlString.charAt(i);
                    i++;
                }
                textBuffer += '>'; // Thêm dấu '>' vào
                i++;
            }

            // Gõ tiếp ký tự bình thường
            if (i < htmlString.length) {
                let char = htmlString.charAt(i);
                textBuffer += char;
                i++;

                element.innerHTML = textBuffer + "<span class='typing-cursor'>|</span>";

                // Tự động cuộn theo chữ (Chống che khuất)
                if (element.id === 'typewriter-text' && i % 20 === 0) {
                   const cursorY = element.getBoundingClientRect().bottom + window.scrollY;
                   if (cursorY > window.scrollY + window.innerHeight - 150) {
                       window.scrollBy({ top: 80, behavior: 'smooth' });
                   }
                }

                // Tốc độ gõ ngẫu nhiên
                let randomSpeed = Math.floor(Math.random() * 40) + speed;
                if (['.', ',', '!', '?'].includes(char)) randomSpeed += 300; // Nghỉ ở dấu câu
                setTimeout(type, randomSpeed);
            } else {
                element.innerHTML = textBuffer;
                if (onComplete) setTimeout(onComplete, 800);
            }
        } else {
            element.innerHTML = textBuffer; 
            if (onComplete) setTimeout(onComplete, 800); 
        }
    }
    type();
}

// Hàm gõ liên tiếp nhiều thẻ <p>
function typeSequence(elements, index, speed, callback) {
    if (index >= elements.length) {
        if (callback) callback();
        return;
    }
    const el = elements[index];
    const text = el.dataset.original || "";
    typeHTML(el, text, speed, () => {
        typeSequence(elements, index + 1, speed, callback);
    });
}

// Hàm tự động cuộn màn hình
function autoScrollTo(id) {
    const el = document.getElementById(id);
    const y = el.getBoundingClientRect().top + window.scrollY - 50;
    window.scrollTo({ top: y, behavior: 'smooth' });
}

/* =========================================
   III. BẮT ĐẦU THƯỚC PHIM & OBSERVER
========================================= */
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(() => document.getElementById('loader').style.display = 'none', 1500);
        
        const introTexts = document.getElementById('s1-intro').querySelectorAll('.type-ready');
        typeSequence(introTexts, 0, 50, () => {
            document.getElementById('btn-start').style.opacity = 1;
        });
    }, 1000);
});

document.getElementById('btn-start').style.opacity = 0;
document.getElementById('btn-start').style.transition = "opacity 1.5s ease";

const bgm = document.getElementById('bgm');
const musicControl = document.getElementById('music-control');
let isMusicPlaying = false;

document.getElementById('btn-start').addEventListener('click', () => {
    document.body.classList.remove('locked');
    if (CONFIG.musicEnabled) {
        musicControl.style.opacity = "1";
        bgm.volume = 0.5;
        bgm.play().then(() => { isMusicPlaying = true; musicControl.textContent = "🔊"; })
        .catch(() => { isMusicPlaying = false; musicControl.textContent = "🔈"; });
    }
    autoScrollTo('s2-night');
});

musicControl.addEventListener('click', () => {
    if (isMusicPlaying) { bgm.pause(); musicControl.textContent = "🔈"; } 
    else { bgm.play(); musicControl.textContent = "🔊"; }
    isMusicPlaying = !isMusicPlaying;
});

// Lướt đến đâu gõ đến đó
const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.seen) {
            entry.target.dataset.seen = "true"; 
            
            // Nếu là các phần văn bản bình thường
            const readyTexts = entry.target.querySelectorAll('.type-ready');
            if (readyTexts.length > 0 && entry.target.id !== 's8-message') {
                typeSequence(readyTexts, 0, 45, () => {
                    if(entry.target.id === 's2-night') setTimeout(() => autoScrollTo('s3-rabbit'), 2500);
                    if(entry.target.id === 's3-rabbit') setTimeout(() => autoScrollTo('s4-wishes'), 2500);
                    if(entry.target.id === 's4-wishes') setTimeout(() => autoScrollTo('s5-gift'), 3000);
                });
            }

            // Nếu là phần bức thư (S8)
            if(entry.target.id === 's8-message') {
                const title = entry.target.querySelector('.type-ready'); 
                typeHTML(title, title.dataset.original, 50, () => {
                    typeHTML(document.getElementById('typewriter-text'), CONFIG.letterText, 40, () => {
                        const sig = document.getElementById('signature');
                        sig.style.display = 'block'; 
                        setTimeout(() => sig.classList.add('visible'), 100);
                        
                        window.scrollBy({ top: 100, behavior: 'smooth' });
                        // Chờ đọc xong thư mới lướt sang Chào Tạm Biệt
                        setTimeout(() => autoScrollTo('s9-ending'), 8000); 
                    });
                });
            }
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('section').forEach(el => observer.observe(el));

/* =========================================
   IV. TƯƠNG TÁC: QUÀ, BÁNH, ĐIỀU ƯỚC
========================================= */
document.getElementById('btn-open-gift').addEventListener('click', function() {
    document.getElementById('gift-box').classList.add('opened');
    this.style.display = 'none';
    createParticles(window.innerWidth/2, window.innerHeight/2, 40, '#F5D76E');
    
    setTimeout(() => {
        const msg = document.getElementById('gift-message');
        typeHTML(msg, "Quà không có gì to tát đâu.<br><br><span class='highlight'>Chỉ là một lời chúc được gói lại cho đẹp thôi.</span>", 40, () => {
            setTimeout(() => autoScrollTo('s6-mooncakes'), 3500);
        });
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
        detail.innerHTML = ""; detail.style.opacity = 1;
        
        typeHTML(detail, messages[cake.getAttribute('data-id')], 35, () => {
            setTimeout(() => autoScrollTo('s7-wish'), 4000);
        });
    });
});

document.getElementById('btn-wish').addEventListener('click', function() {
    this.style.display = 'none';
    
    // ĐÈN TRỜI BAY LÊN TRÔNG CỰC ĐẸP
    createLanterns(20); 
    createParticles(window.innerWidth / 2, window.innerHeight / 2, 100, '#F5D76E', true);
    
    setTimeout(() => { 
        const wishRes = document.getElementById('wish-result');
        wishRes.style.opacity = 1;
        typeHTML(wishRes, "...và mong điều đó sẽ thành hiện thực.", 50, () => {
            setTimeout(() => autoScrollTo('s8-message'), 4000);
        });
    }, 2500);
});

document.getElementById('btn-restart').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => location.reload(), 800); 
});

/* =========================================
   V. NGHỆ THUẬT CANVAS (ĐÃ VIẾT ĐẦY ĐỦ RÕ RÀNG)
========================================= */
const canvas = document.getElementById('sky-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let stars = [], particles = [], fireflies = [], lanterns = [];
let mouse = { x: null, y: null };

window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });
window.addEventListener('touchmove', e => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; });
window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });
window.addEventListener('touchend', () => { mouse.x = null; mouse.y = null; });

function initCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    stars = []; fireflies = []; lanterns = [];
    
    for(let i=0; i<150; i++) { 
        stars.push({ 
            x: Math.random() * width, 
            y: Math.random() * height, 
            r: Math.random() * 1.5, 
            alpha: Math.random(), 
            speed: Math.random() * 0.02 
        }); 
    }
    for(let i=0; i<30; i++) { 
        fireflies.push({ 
            x: Math.random() * width, 
            y: Math.random() * height, 
            r: Math.random() * 2 + 1, 
            vx: (Math.random()-0.5)*0.5, 
            vy: (Math.random()-0.5)*0.5 
        }); 
    }
}

function createParticles(x, y, amount, color, isExplosion = false) {
    for(let i=0; i<amount; i++) {
        particles.push({
            x: x, 
            y: y,
            vx: (Math.random() - 0.5) * (isExplosion ? 12 : 4), 
            vy: (Math.random() - 0.5) * (isExplosion ? 12 : 4) - (isExplosion ? 2 : 0),
            r: Math.random() * 3 + 1, 
            color: color, 
            alpha: 1, 
            decay: Math.random() * 0.015 + 0.005
        });
    }
}

function createLanterns(amount) {
    for(let i=0; i<amount; i++) {
        lanterns.push({
            x: Math.random() * width,
            y: height + Math.random() * 300, 
            vx: (Math.random() - 0.5) * 1,
            vy: -(Math.random() * 1.5 + 1), 
            size: Math.random() * 10 + 8,
            alpha: 0,
            wobble: Math.random() * Math.PI * 2 
        });
    }
}

function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    
    // Render Sao
    stars.forEach(s => {
        s.alpha += s.speed; 
        if(s.alpha > 1 || s.alpha < 0.2) s.speed *= -1;
        ctx.beginPath(); 
        ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`; 
        ctx.fill();
    });

    // Render Đom đóm
    fireflies.forEach(f => {
        f.x += f.vx; 
        f.y += f.vy;
        if(f.x < 0 || f.x > width) f.vx *= -1; 
        if(f.y < 0 || f.y > height) f.vy *= -1;
        
        if(mouse.x != null && mouse.y != null) {
            let dx = mouse.x - f.x; 
            let dy = mouse.y - f.y; 
            let dist = Math.sqrt(dx*dx + dy*dy);
            if(dist < 100) { f.x -= dx * 0.05; f.y -= dy * 0.05; }
        }
        
        ctx.beginPath(); 
        ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(245, 215, 110, 0.6)'; 
        ctx.shadowBlur = 10; 
        ctx.shadowColor = '#F5D76E'; 
        ctx.fill(); 
        ctx.shadowBlur = 0;
    });

    // Render Particles nổ
    for(let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx; 
        p.y += p.vy; 
        p.alpha -= p.decay;
        
        if(p.alpha <= 0) { 
            particles.splice(i, 1); 
            continue; 
        }
        
        ctx.beginPath(); 
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = p.color; 
        ctx.globalAlpha = p.alpha; 
        ctx.fill(); 
        ctx.globalAlpha = 1;
    }

    // Render Hoa Đăng bay lên
    for(let i = lanterns.length - 1; i >= 0; i--) {
        let l = lanterns[i];
        l.x += Math.sin(l.wobble) * 0.5 + l.vx; 
        l.wobble += 0.02; 
        l.y += l.vy;
        
        if(l.alpha < 1) l.alpha += 0.01; 
        
        ctx.save();
        ctx.globalAlpha = l.alpha;
        ctx.translate(l.x, l.y);
        ctx.shadowBlur = 20; 
        ctx.shadowColor = '#FF5722';
        
        // Thân đèn
        ctx.fillStyle = '#E64A19';
        ctx.beginPath(); 
        ctx.roundRect(-l.size/2, -l.size, l.size, l.size*1.5, l.size/4); 
        ctx.fill();
        
        // Nắp & Đáy đèn
        ctx.fillStyle = '#F5D76E';
        ctx.fillRect(-l.size/3, -l.size - l.size/5, l.size/1.5, l.size/5);
        ctx.fillRect(-l.size/3, l.size/2, l.size/1.5, l.size/5);
        ctx.restore();
    }
    requestAnimationFrame(animateCanvas);
}

window.addEventListener('resize', initCanvas);
initCanvas(); 
animateCanvas();
