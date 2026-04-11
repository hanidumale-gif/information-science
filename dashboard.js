// Dashboard Analytics

function loadDashboard() {
    const courses = getCourses();
    
    // Update stats
    document.getElementById('totalCourses').textContent = courses.length;
    const totalRevenue = courses.reduce((sum, course) => sum + course.price, 0);
    document.getElementById('totalRevenue').textContent = '$' + totalRevenue;
    
    // Count by level
    const levelCount = {
        Beginner: 0,
        Intermediate: 0,
        Advanced: 0
    };
    
    courses.forEach(course => {
        levelCount[course.level]++;
    });
    
    // Level Chart
    const levelCtx = document.getElementById('levelChart').getContext('2d');
    new Chart(levelCtx, {
        type: 'doughnut',
        data: {
            labels: ['Beginner', 'Intermediate', 'Advanced'],
            datasets: [{
                data: [levelCount.Beginner, levelCount.Intermediate, levelCount.Advanced],
                backgroundColor: ['#4caf50', '#667eea', '#f5576c'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    // Price Chart
    const priceCtx = document.getElementById('priceChart').getContext('2d');
    new Chart(priceCtx, {
        type: 'bar',
        data: {
            labels: courses.map(c => c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name),
            datasets: [{
                label: 'Price ($)',
                data: courses.map(c => c.price),
                backgroundColor: '#667eea',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Price ($)'
                    }
                }
            }
        }
    });
    
    // Top Courses
    const topCourses = [...courses].sort((a, b) => b.price - a.price).slice(0, 5);
    const topCoursesList = document.getElementById('topCoursesList');
    
    topCoursesList.innerHTML = topCourses.map((course, index) => `
        <div class="top-course-item">
            <span class="rank">${index + 1}</span>
            <div class="course-info">
                <strong>${escapeHtml(course.name)}</strong>
                <small>${escapeHtml(course.instructor)}</small>
            </div>
            <span class="price">$${course.price}</span>
        </div>
    `).join('');
}

// Add styles for top courses
const topCoursesStyle = document.createElement('style');
topCoursesStyle.textContent = `
    .top-courses {
        background: white;
        padding: 1.5rem;
        border-radius: 16px;
    }
    
    .top-courses h3 {
        margin-bottom: 1rem;
    }
    
    .top-courses h3 i {
        color: #ffd700;
        margin-right: 0.5rem;
    }
    
    .top-course-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border-bottom: 1px solid #f0f0f0;
    }
    
    .top-course-item:last-child {
        border-bottom: none;
    }
    
    .rank {
        font-size: 1.5rem;
        font-weight: bold;
        color: #667eea;
        width: 40px;
    }
    
    .course-info {
        flex: 1;
    }
    
    .course-info strong {
        display: block;
        margin-bottom: 0.25rem;
    }
    
    .course-info small {
        color: #666;
    }
    
    .price {
        font-weight: bold;
        color: #4caf50;
    }
`;
document.head.appendChild(topCoursesStyle);

loadDashboard();