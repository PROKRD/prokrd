// لادانی شاشەی بارکردن (Premium Loading Screen)
window.addEventListener('load', () => {
    const loader = document.getElementById('premium-loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 800);
    }, 2000);
});

// سیستەمی تەنۆلکەی زیوی و سپی مۆدێرن (White/Silver Particles)
const canvas = document.getElementById('interactiveParticles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
let mouse = { x: null, y: null, radius: 150 };

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});
window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

class Particle {
    constructor(x, y, directionX, directionY, size, opacity) {
        this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY;
        this.size = size; this.opacity = opacity;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
        
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 2;
            if (mouse.x > this.x && this.x > this.size * 10) this.x -= 2;
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 2;
            if (mouse.y > this.y && this.y > this.size * 10) this.y -= 2;
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function initParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.width * canvas.height) / 12000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 0.5;
        let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.3) - 0.15;
        let directionY = (Math.random() * 0.3) - 0.15;
        let opacity = (Math.random() * 0.3) + 0.05; // لێڵی ڕەنگی سپی (Silver effect)
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, opacity));
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// کاریگەری سێ ڕەهەندی مشک (3D Mouse Tilt Effect) لەسەر کارت و لۆگۆکان
const tiltElements = document.querySelectorAll('.tilt-target');

tiltElements.forEach(element => {
    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        const angleX = (yc - y) / 15;
        const angleY = (x - xc) / 15;
        
        element.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.02)`;
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        element.style.transition = 'all 0.5s ease';
    });
    
    element.addEventListener('mouseenter', () => {
        element.style.transition = 'none';
    });
});

// ئەنیمەیشنی دەرکەوتن لە کاتی سکڕۆڵ (Scroll Reveal)
const revealElements = document.querySelectorAll('.reveal');

const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

const scrollObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        
        // ژماردنی ئامارەکان ئەگەر بینران
        if(entry.target.classList.contains('stats-section')) {
            const counters = document.querySelectorAll('.counter');
            counters.forEach(counter => {
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const speed = 100;
                    const inc = target / speed;
                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
        }
        observer.unobserve(entry.target);
    });
}, revealOptions);

revealElements.forEach(el => scrollObserver.observe(el));
