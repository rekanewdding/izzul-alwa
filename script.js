// ===== GOOGLE SHEETS CONFIGURATION =====
// GANTI DENGAN URL DARI GOOGLE APPS SCRIPT ANDA!
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbx5udBzTu7U2hImsEuA1cD6MzuJqDw3eepG1kSo53RVeD1NdZbaZJ2KVp5bJlFtC80S/exec';

// ===== DOM ELEMENTS =====
const coverScreen = document.getElementById('coverScreen');
const openBtn = document.getElementById('openInvitation');
const mainContent = document.getElementById('mainContent');
const bgMusic = document.getElementById('bgMusic');
const musicIcon = document.getElementById('toggleMusic');
const musicPlayer = document.getElementById('musicPlayer');
const floatingNav = document.getElementById('floatingNav');
const navDots = document.querySelectorAll('.nav-dot');
const sections = document.querySelectorAll('.section');
const toastContainer = document.getElementById('toastContainer');

// ===== GOLD SPARKLES GENERATOR =====
function createSparkles(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    for (let i = 0; i < 50; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 3 + 's';
        sparkle.style.animationDuration = 1 + Math.random() * 2 + 's';
        sparkle.style.width = 2 + Math.random() * 4 + 'px';
        sparkle.style.height = sparkle.style.width;
        container.appendChild(sparkle);
    }
}

// ===== COVER SCREEN =====
document.addEventListener('DOMContentLoaded', function() {
    const coverSampul = coverScreen.getAttribute('data-sampul');
    if (coverSampul) {
        coverScreen.style.backgroundImage = `url('${coverSampul}')`;
    }
    
    mainContent.style.display = 'none';
    document.body.style.overflow = 'hidden';
    
    createSparkles('coverSparkles');
    createSparkles('globalSparkles');
    
    loadMessages();
});

// ===== OPEN INVITATION =====
openBtn.addEventListener('click', function() {
    coverScreen.classList.add('hidden');
    
    setTimeout(() => {
        mainContent.style.display = 'block';
        setTimeout(() => {
            mainContent.classList.add('visible');
        }, 50);
        
        document.body.style.overflow = 'auto';
        
        musicPlayer.classList.add('visible');
        floatingNav.classList.add('visible');
        
        if (bgMusic) {
            bgMusic.play().catch(error => {
                console.log('Autoplay prevented:', error);
            });
        }
        
        setTimeout(() => {
            initScrollReveal();
            updateActiveNav();
        }, 500);
        
    }, 800);
});

// ===== MUSIC PLAYER =====
let isPlaying = true;

if (musicIcon) {
    musicIcon.addEventListener('click', function() {
        if (isPlaying) {
            bgMusic.pause();
            musicIcon.classList.remove('playing');
        } else {
            bgMusic.play().catch(e => console.log('Error playing:', e));
            musicIcon.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });
}

// ===== COUNTDOWN TIMER =====
function updateCountdown() {
    const targetDate = new Date('2026-06-28T00:00:00+07:00').getTime();
    const now = new Date().getTime();
    const distance = targetDate - now;
    
    if (distance < 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    animateNumber('days', days);
    animateNumber('hours', hours);
    animateNumber('minutes', minutes);
    animateNumber('seconds', seconds);
}

function animateNumber(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const oldValue = parseInt(element.textContent);
    
    if (oldValue !== newValue) {
        element.classList.add('change');
        element.textContent = newValue.toString().padStart(2, '0');
        
        setTimeout(() => {
            element.classList.remove('change');
        }, 300);
    } else {
        element.textContent = newValue.toString().padStart(2, '0');
    }
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===== SCROLL REVEAL =====
function initScrollReveal() {
    const reveals = document.querySelectorAll('.section-header, .couple-card, .event-card, .gallery-item, .closing-card, .guestbook-form, .gift-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px'
    });
    
    reveals.forEach(reveal => {
        reveal.style.opacity = '0';
        reveal.style.transform = 'translateY(30px)';
        reveal.style.transition = 'all 0.8s ease';
        observer.observe(reveal);
    });
}

// ===== ACTIVE NAVIGATION =====
function updateActiveNav() {
    let currentSection = '';
    const scrollPosition = window.scrollY + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navDots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.getAttribute('data-section') === currentSection) {
            dot.classList.add('active');
        }
    });
}

navDots.forEach(dot => {
    dot.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

window.addEventListener('scroll', updateActiveNav);

// ===== GOOGLE SHEETS GUESTBOOK (compatible with your code.gs) =====
const guestbookForm = document.getElementById('guestbookForm');
const messagesContainer = document.getElementById('messagesContainer');

// Function to get client IP (optional)
async function getClientIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return 'unknown';
    }
}

// Load messages from Google Sheets
async function loadMessages() {
    if (!messagesContainer) return;
    
    messagesContainer.innerHTML = '<div class="text-center text-gold py-4">⏳ Memuat ucapan...</div>';
    
    try {
        // Your code.gs uses GET without parameters to get messages
        const response = await fetch(GOOGLE_SHEETS_URL);
        const result = await response.json();
        
        if (result.success && result.messages && result.messages.length > 0) {
            let html = '';
            result.messages.forEach(msg => {
                let dateStr = 'Baru saja';
                if (msg.timestamp) {
                    try {
                        const date = new Date(msg.timestamp);
                        dateStr = date.toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                    } catch(e) {
                        dateStr = msg.timestamp;
                    }
                }
                
                const attendanceText = msg.attendance === 'Hadir' ? 
                    '<span class="message-attendance"><i class="fas fa-calendar-check me-1"></i> Akan Hadir</span>' : 
                    (msg.attendance === 'Tidak Hadir' ? 
                        '<span class="message-attendance tidak-hadir"><i class="fas fa-calendar-times me-1"></i> Tidak Hadir</span>' : '');
                
                html += `
                    <div class="message-item">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="message-name">✨ ${escapeHtml(msg.name)}</span>
                            <span class="message-date">${dateStr}</span>
                        </div>
                        <p class="message-content mb-2">${escapeHtml(msg.message)}</p>
                        ${attendanceText}
                    </div>
                `;
            });
            messagesContainer.innerHTML = html;
        } else {
            messagesContainer.innerHTML = '<p class="text-center text-gold py-4">✨ Belum ada ucapan. Jadilah yang pertama! ✨</p>';
        }
    } catch (error) {
        console.error('Error loading messages:', error);
        messagesContainer.innerHTML = '<p class="text-center text-gold py-4">⚠️ Gagal memuat ucapan. Periksa URL Google Apps Script.</p>';
    }
}

// Save message to Google Sheets (using 'save' action as in your code.gs)
async function saveMessage(name, message, attendance, ipAddress) {
    try {
        // Your code.gs expects: action=save, name, message, attendance, ip
        const formData = new URLSearchParams();
        formData.append('action', 'save');
        formData.append('name', name);
        formData.append('message', message);
        formData.append('attendance', attendance);
        formData.append('ip', ipAddress);
        
        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        return result;
        
    } catch (error) {
        console.error('Error saving message:', error);
        return { success: false, message: error.toString() };
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Handle form submission
if (guestbookForm) {
    guestbookForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('guestName').value.trim();
        const message = document.getElementById('guestMessage').value.trim();
        const attendanceSelect = document.getElementById('guestAttendance');
        const attendance = attendanceSelect.value;
        
        if (!name || !message || !attendance) {
            showToast('⚠️ Mohon lengkapi semua field', 'error');
            return;
        }
        
        if (name.length < 3) {
            showToast('⚠️ Nama minimal 3 karakter', 'error');
            return;
        }
        
        if (message.length > 500) {
            showToast('⚠️ Ucapan maksimal 500 karakter', 'error');
            return;
        }
        
        // Get IP address
        const ipAddress = await getClientIP();
        
        // Show loading state
        const submitBtn = guestbookForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Mengirim...';
        submitBtn.disabled = true;
        
        const result = await saveMessage(name, message, attendance, ipAddress);
        
        if (result.success) {
            guestbookForm.reset();
            showToast('✨ ' + result.message + ' ✨', 'success');
            loadMessages(); // Reload messages
        } else {
            showToast('❌ ' + (result.message || 'Gagal mengirim ucapan'), 'error');
        }
        
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast-notification mb-2 ${type}`;
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2 gold-text"></i>
            <span>${message}</span>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ===== GIFT FUNCTIONS =====
const copyBankBtn = document.getElementById('copyBankBtn');
const showAddressBtn = document.getElementById('showAddressBtn');
const addressBox = document.getElementById('addressBox');

if (copyBankBtn) {
    copyBankBtn.addEventListener('click', function() {
        const bankNumber = '1430030923922';
        
        navigator.clipboard.writeText(bankNumber).then(() => {
            showToast('✨ Nomor rekening berhasil disalin! ✨', 'success');
        }).catch(() => {
            showToast('❌ Gagal menyalin nomor rekening', 'error');
        });
    });
}

if (showAddressBtn) {
    showAddressBtn.addEventListener('click', function() {
        if (addressBox.style.display === 'none' || addressBox.style.display === '') {
            addressBox.style.display = 'block';
            addressBox.style.animation = 'fadeInUp 0.5s ease';
        } else {
            addressBox.style.display = 'none';
        }
    });
}

// ===== IMAGE PRELOAD =====
const images = document.querySelectorAll('img[src]');
images.forEach(img => {
    if (img.src && !img.complete) {
        img.style.opacity = '0';
        img.onload = function() {
            this.style.transition = 'opacity 0.5s ease';
            this.style.opacity = '1';
        };
        img.onerror = function() {
            console.log('Image not found:', this.src);
            this.style.opacity = '1';
        };
    }
});

// ===== ADDITIONAL CSS FOR TIDAK HADIR =====
const style = document.createElement('style');
style.textContent = `
    .message-attendance.tidak-hadir {
        background: #666;
        color: #fff;
    }
`;
document.head.appendChild(style);