// Shared functions across all pages

// Get courses from localStorage
function getCourses() {
    const storedCourses = localStorage.getItem('courses');
    if (storedCourses) {
        return JSON.parse(storedCourses);
    } else {
        // Sample data
        const defaultCourses = [
            {
                id: Date.now() + 1,
                name: "Full Stack Web Development",
                instructor: "Dr. Sarah Johnson",
                duration: "12 weeks",
                price: 499,
                description: "Master HTML, CSS, JavaScript, React, Node.js and MongoDB",
                level: "Intermediate"
            },
            {
                id: Date.now() + 2,
                name: "Data Science & AI",
                instructor: "Prof. Michael Chen",
                duration: "16 weeks",
                price: 599,
                description: "Learn Python, Machine Learning, Deep Learning and AI",
                level: "Advanced"
            },
            {
                id: Date.now() + 3,
                name: "Digital Marketing Mastery",
                instructor: "Emma Williams",
                duration: "8 weeks",
                price: 299,
                description: "SEO, Social Media, Content Marketing, Analytics",
                level: "Beginner"
            }
        ];
        localStorage.setItem('courses', JSON.stringify(defaultCourses));
        return defaultCourses;
    }
}

// Save courses to localStorage
function saveCourses(courses) {
    localStorage.setItem('courses', JSON.stringify(courses));
}

// Escape HTML to prevent XSS
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
        <span>${message}</span>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : '#ff9800'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}

// Add CSS for notification animations
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(notificationStyle);