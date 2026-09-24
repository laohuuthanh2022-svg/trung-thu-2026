/* =========================================
   I. CONFIGURATION & KHỞI TẠO NÂNG CẤP
========================================= */
const CONFIG = {
    recipientName: "Thanh Vy",
    senderName: "Một người bạn luôn ủng hộ cậu",
    musicEnabled: true,
    letterText: "Có những ngày bận rộn đến mức người ta quên mất việc ngước nhìn lên bầu trời. Nhưng hôm nay là một đêm trăng rằm, và ánh trăng thì luôn nhắc chúng ta nhớ về những điều dịu dàng nhất.<br><br>Mong cậu của hôm nay và những ngày tháng sau này sẽ luôn giữ nụ cười rạng rỡ. Nếu có lúc nào mệt mỏi, hãy nhớ rằng luôn có những người bạn — như mình — sẵn sàng lắng nghe và chia sẻ.<br><br><span class='serif highlight' style='font-size: 1.5rem;'>Chúc Thanh Vy một Trung Thu thật ấm áp, trọn vẹn và hạnh phúc. 🌕</span>"
};

// Đổ tên
document.querySelectorAll('.r-name').forEach(el => el.textContent = CONFIG.recipientName);
document.getElementById('s-name').textContent = CONFIG.senderName;

// Thêm viền sương mù điện ảnh tự động
const vignette = document.createElement('div');
vignette.className = 'vignette';
document.body.appendChild(vignette);

/* =========================================
   II. HỆ THỐNG GÕ CHỮ (TYPEWRITER ENGINE)
========================================= */
// 1. Khóa layout & Lưu trữ chữ ban đầu (Để web không bị sập form khi xóa chữ)
document.querySelectorAll('section').forEach(sec => {
    const texts = sec.querySelectorAll('h1, h2, .story-text, p');
    texts.forEach(txt => {
        // Bỏ qua các thành phần động
        if (['wish-result', 'gift-message', 'mooncake-detail', 'typewriter-text', 'signature'].includes(txt.id)) return;
        
        txt.dataset.original = txt.innerHTML; // Lưu nội dung gốc
        txt.style.minHeight = txt.offsetHeight + 'px'; // Khóa chiều cao
        txt.innerHTML = ""; // Xóa trắng để chờ gõ
        txt.classList.add('type-ready');
    });
});

// 2. Hàm gõ chữ thông minh
function typeHTML(element, htmlString, speed, onComplete) {
    element.innerHTML = "<span class='typing-cursor'>|</span>";
    let i = 0; let isTag = false; let textBuffer = "";

    function type() {
        if (i < htmlString.length) {
            let char = htmlString.charAt(i);
            if (char === '<') isTag = true;
            textBuffer += char;
            if (char === '>') isTag = false;

            if (!isTag) {
                element.innerHTML = textBuffer + "<span class='typing-cursor'>|</span>";
                
                // Tự động cuộn theo chữ nếu gõ sát đáy màn hình (Dành cho bức thư dài)
                if (i % 25 === 0 && element.id === 'typewriter-text') {
                   const cursorY = element.getBoundingClientRect().bottom + window.scrollY;
                   if (cursorY > window.scrollY + window.innerHeight - 150) {
                       window.scrollBy({ top: 80, behavior: 'smooth' });
                   }
                }

                // Tốc độ ngẫu nhiên y như người thật
                let randomSpeed = Math.floor(Math.random() * (speed + 20 - speed + 1)) + speed;
                if (['.', ',', '!', '?'].includes(char)) randomSpeed += 250; // Dừng lại ở dấu câu
                setTimeout(type, randomSpeed);
            } else {
                type(); // Chạy xuyên qua thẻ HTML
            }
            i++;
        } else {
            element.innerHTML = textBuffer; // Xóa con trỏ khi gõ xong
            if (onComplete) setTimeout(onComplete, 800); // Nghỉ 0.8s trước khi gõ dòng tiếp theo
        }
    }
    type();
}

// 3. Hàm gõ liên tiếp nhiều dòng
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

// Căn chỉnh cuộn mượt mà
function autoScrollTo(id) {
    const el = document.getElementById(id);
    const y = el.getBoundingClientRect().top + window.scrollY - 50;
    window.scrollTo({ top: y, behavior: 'smooth' });
}

/* =========================================
   III. BẮT ĐẦU THƯỚC PHIM & QUẢN LÝ SCROLL
========================================= */
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(() => document.getElementById('loader').style.display = 'none', 1500);
        
        // Gõ chữ Intro phần đầu tiên sau khi load xong
        const introTexts = document.getElementById('s1-intro').querySelectorAll('.type-ready');
        typeSequence(introTexts, 0, 50, () => {
            // Hiện nút Bắt đầu
            document.getElementById('btn-start').style.opacity = 1;
        });
    }, 1000);
});

// Ẩn nút bắt đầu lúc đầu
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
    // Lướt tới phần 2
    autoScrollTo('s2-night');
});

musicControl.addEventListener('click', () => {
    if (isMusicPlaying) { bgm.pause(); musicControl.textContent = "🔈"; } 
    else { bgm.play(); musicControl.textContent = "🔊"; }
    isMusicPlaying = !isMusicPlaying;
});

// SCROLL OBSERVER - Điều phối quá trình GÕ -> LƯỚT
const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.seen) {
            entry.target.dataset.seen = "true"; // Đánh dấu đã thấy
            entry.target.classList.add('visible');
            
            // Xử lý các section kể chuyện thông thường
            const readyTexts = entry.target.querySelectorAll('.type-ready');
            if (readyTexts.length > 0) {
                typeSequence(readyTexts, 0, 45, () => {
                    // KHI GÕ XONG HẾT SECTION NÀY -> CHỜ 2.5 GIÂY -> LƯỚT TIẾP XUỐNG
                    if(entry.target.id === 's2-night') setTimeout(() => autoScrollTo('s3-rabbit'), 2500);
                    if(entry.target.id === 's3-rabbit') setTimeout(() => autoScrollTo('s4-wishes'), 2500);
                    if(entry.target.id === 's4-wishes') setTimeout(() => autoScrollTo('s5-gift'), 3000);
                });
            }

            // Xử lý riêng phần Bức Thư Cuối (S8)
            if(entry.target.id === 's8-message') {
                const title = entry.target.querySelector('.type-ready'); // "Gửi cậu,"
                typeHTML(title, title.dataset.original, 50, () => {
                    // Sau khi gõ "Gửi cậu,", gõ tiếp nội dung thư
                    typeHTML(document.getElementById('typewriter-text'), CONFIG.letterText, 45, () => {
                        const sig = document.getElementById('signature');
                        sig.style.display = 'block'; sig.classList.add('visible');
                        window.scrollBy({ top: 100, behavior: 'smooth' });
                        // Chờ 8 giây đọc xong thư mới lướt sang Chào Tạm Biệt
                        setTimeout(() => autoScrollTo('s9-ending'), 8000); 
                    });
                });
            }
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('section').forEach(el => observer.observe(el));

/* =========================================
   IV. TƯƠNG TÁC QUÀ, BÁNH, ĐIỀU ƯỚC
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
    // KÍCH HOẠT HOA ĐĂNG BAY LÊN
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
   V. NGHỆ THUẬT CANVAS (Sao, Đom Đóm, Đèn Trời)
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
    stars = []; fireflies = [];
    for(let i=0; i<150; i++) { stars.push({ x: Math.random() * width, y: Math.random() * height, r: Math.random() * 1.5, alpha: Math.random(), speed: Math.random() * 0.02 }); }
    for(let i=0; i<30; i++) { fireflies.push({ x: Math.random() * width, y: Math.random() * height, r: Math.random() * 2 + 1, vx: (Math.random()-0.5)*0.5, vy: (Math.random()-0.5)*0.5 }); }
}

function createParticles(x, y, amount, color, isExplosion = false) {
    for(let i=0; i<amount; i++) {
        particles.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * (isExplosion ? 12 : 4), vy: (Math.random() - 0.5) * (isExplosion ? 12 : 4) - (isExplosion ? 2 : 0),
            r: Math.random() * 3 + 1, color: color, alpha: 1, decay: Math.random() * 0.015 + 0.005
        });
    }
}

// HÀM TẠO ĐÈN TRỜI (HOA ĐĂNG)
function createLanterns(amount) {
    for(let i=0; i<amount; i++) {
        lanterns.push({
            x: Math.random() * width,
            y: height + Math.random() * 300, // Bắt đầu từ dưới đáy màn hình
            vx: (Math.random() - 0.5) * 1,
            vy: -(Math.random() * 1.5 + 1), // Trôi ngược lên trên
            size: Math.random() * 10 + 8,
            alpha: 0,
            wobble: Math.random() * Math.PI * 2 // Hiệu ứng lắc lư
        });
    }
}

function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    
    // Sao nền
    stars.forEach(s => {
        s.alpha += s.speed; if(s.alpha > 1 || s.alpha < 0.2) s.speed *= -1;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`; ctx.fill();
    });

    // Đom đóm né tay
    fireflies.forEach(f => {
        f.x += f.vx; f.y += f.vy;
        if(f.x < 0 || f.x > width) f.vx *= -1; if(f.y < 0 || f.y > height) f.vy *= -1;
        if(mouse.x != null && mouse.y != null) {
            let dx = mouse.x - f.x; let dy = mouse.y - f.y; let dist = Math.sqrt(dx*dx + dy*dy);
            if(dist < 100) { f.x -= dx * 0.05; f.y -= dy * 0.05; }
        }
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(245, 215, 110, 0.6)'; ctx.shadowBlur = 10; ctx.shadowColor = '#F5D76E'; ctx.fill(); ctx.shadowBlur = 0;
    });

    // Hạt sáng nổ
    for(let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx; p.y += p.vy; p.alpha -= p.decay;
        if(p.alpha <= 0) { particles.splice(i, 1); continue; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha; ctx.fill(); ctx.globalAlpha = 1;
    }

    // HOA ĐĂNG BAY LÊN
    for(let i = lanterns.length - 1; i >= 0; i--) {
        let l = lanterns[i];
        l.x += Math.sin(l.wobble) * 0.5 + l.vx; // Lắc lư qua lại
        l.wobble += 0.02;
        l.y += l.vy;
        if(l.alpha < 1) l.alpha += 0.01; // Hiện rõ dần
        
        ctx.save();
        ctx.globalAlpha = l.alpha;
        ctx.translate(l.x, l.y);
        ctx.shadowBlur = 20; ctx.shadowColor = '#FF5722';
        // Thân đèn
        ctx.fillStyle = '#E64A19';
        ctx.beginPath(); ctx.roundRect(-l.size/2, -l.size, l.size, l.size*1.5, l.size/4); ctx.fill();
        // Nắp & Đáy đèn
        ctx.fillStyle = '#F5D76E';
        ctx.fillRect(-l.size/3, -l.size - l.size/5, l.size/1.5, l.size/5);
        ctx.fillRect(-l.size/3, l.size/2, l.size/1.5, l.size/5);
        ctx.restore();
    }

    requestAnimationFrame(animateCanvas);
}
window.addEventListener('resize', initCanvas);
initCanvas(); animateCanvas();
