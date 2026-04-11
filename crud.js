// CRUD Operations for Courses Page

let courses = [];

function loadCourses() {
    courses = getCourses();
    displayCourses();
}

function saveCoursesToStorage() {
    saveCourses(courses);
}

function addCourse(course) {
    const newCourse = {
        id: Date.now(),
        ...course
    };
    courses.push(newCourse);
    saveCoursesToStorage();
    displayCourses();
    showNotification('✨ Course added successfully!', 'success');
}

function updateCourse(id, updatedData) {
    const index = courses.findIndex(course => course.id === id);
    if (index !== -1) {
        courses[index] = { ...courses[index], ...updatedData };
        saveCoursesToStorage();
        displayCourses();
        showNotification('🎯 Course updated successfully!', 'success');
    }
}

function deleteCourse(id) {
    // Create beautiful custom confirm dialog
    const course = courses.find(c => c.id === id);
    showDeleteConfirmDialog(course);
}

function showDeleteConfirmDialog(course) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'delete-confirm-overlay';
    overlay.innerHTML = `
        <div class="delete-confirm-modal">
            <div class="delete-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3>Delete Course?</h3>
            <p>Are you sure you want to delete <strong>"${escapeHtml(course.name)}"</strong>?</p>
            <p class="warning-text">This action cannot be undone!</p>
            <div class="delete-actions">
                <button class="btn-cancel" id="cancelDeleteBtn">
                    <i class="fas fa-times"></i> Cancel
                </button>
                <button class="btn-confirm-delete" id="confirmDeleteBtn">
                    <i class="fas fa-trash-alt"></i> Yes, Delete
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    overlay.style.display = 'flex';
    
    // Add event listeners
    document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
        overlay.remove();
    });
    
    document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
        courses = courses.filter(c => c.id !== course.id);
        saveCoursesToStorage();
        displayCourses();
        showNotification('🗑️ Course deleted successfully!', 'warning');
        overlay.remove();
    });
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
}

function deleteAllCourses() {
    if (courses.length === 0) {
        showNotification('📭 No courses to delete!', 'info');
        return;
    }
    
    // Create beautiful confirm dialog for delete all
    const overlay = document.createElement('div');
    overlay.className = 'delete-confirm-overlay';
    overlay.innerHTML = `
        <div class="delete-confirm-modal warning-modal">
            <div class="delete-icon warning-icon">
                <i class="fas fa-trash-alt"></i>
            </div>
            <h3>Delete All Courses?</h3>
            <p>⚠️ <strong>WARNING:</strong> This will delete ALL ${courses.length} courses!</p>
            <p class="warning-text">This action is irreversible!</p>
            <div class="delete-actions">
                <button class="btn-cancel" id="cancelAllDeleteBtn">
                    <i class="fas fa-times"></i> Cancel
                </button>
                <button class="btn-confirm-delete" id="confirmAllDeleteBtn">
                    <i class="fas fa-trash-alt"></i> Delete All
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    overlay.style.display = 'flex';
    
    document.getElementById('cancelAllDeleteBtn').addEventListener('click', () => {
        overlay.remove();
    });
    
    document.getElementById('confirmAllDeleteBtn').addEventListener('click', () => {
        courses = [];
        saveCoursesToStorage();
        displayCourses();
        showNotification('🗑️ All courses have been deleted!', 'warning');
        overlay.remove();
    });
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
}

function displayCourses() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const filterLevel = document.getElementById('filterLevel')?.value || 'all';
    
    let filteredCourses = courses.filter(course => {
        const matchesSearch = course.name.toLowerCase().includes(searchTerm) || 
                             course.instructor.toLowerCase().includes(searchTerm);
        const matchesLevel = filterLevel === 'all' || course.level === filterLevel;
        return matchesSearch && matchesLevel;
    });
    
    const coursesGrid = document.getElementById('coursesGrid');
    const courseCount = document.getElementById('courseCount');
    
    if (!coursesGrid) return;
    
    // Update course count
    if (courseCount) {
        courseCount.textContent = `${filteredCourses.length} courses`;
    }
    
    if (filteredCourses.length === 0) {
        coursesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <p>No courses found</p>
                <small>Add your first course using the form above</small>
            </div>
        `;
        return;
    }
    
    coursesGrid.innerHTML = filteredCourses.map((course, index) => `
        <div class="course-card" data-aos="fade-up" data-aos-delay="${index * 50}">
            <div class="course-badge">
                <span class="level-badge ${course.level.toLowerCase()}">${course.level}</span>
            </div>
            <div class="course-content">
                <h3 class="course-title">${escapeHtml(course.name)}</h3>
                <div class="course-meta">
                    <div class="meta-item">
                        <i class="fas fa-user-tie"></i>
                        <span>${escapeHtml(course.instructor)}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${course.duration}</span>
                    </div>
                </div>
                <div class="course-description-preview">
                    ${escapeHtml(course.description.substring(0, 80))}${course.description.length > 80 ? '...' : ''}
                </div>
                <div class="course-price-section">
                    <span class="course-price">$${course.price}</span>
                    <span class="price-badge">One-time payment</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn-edit-glow" onclick="openEditModal(${course.id})">
                    <div class="btn-icon"><i class="fas fa-edit"></i></div>
                    <span>Edit Course</span>
                    <div class="btn-shine"></div>
                </button>
                <button class="btn-delete-glow" onclick="deleteCourse(${course.id})">
                    <div class="btn-icon"><i class="fas fa-trash-alt"></i></div>
                    <span>Delete</span>
                    <div class="btn-shine"></div>
                </button>
            </div>
        </div>
    `).join('');
}

function openEditModal(id) {
    const course = courses.find(c => c.id === id);
    if (course) {
        document.getElementById('editId').value = course.id;
        document.getElementById('editName').value = course.name;
        document.getElementById('editInstructor').value = course.instructor;
        document.getElementById('editDuration').value = course.duration;
        document.getElementById('editPrice').value = course.price;
        document.getElementById('editDescription').value = course.description;
        document.getElementById('editLevel').value = course.level;
        document.getElementById('editModal').style.display = 'block';
        
        // Add animation to modal
        const modal = document.getElementById('editModal');
        modal.style.animation = 'fadeIn 0.3s ease';
    }
}

function closeModal() {
    const modal = document.getElementById('editModal');
    modal.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Event Listeners
if (document.getElementById('courseForm')) {
    document.getElementById('courseForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const course = {
            name: document.getElementById('courseName').value,
            instructor: document.getElementById('courseInstructor').value,
            duration: document.getElementById('courseDuration').value,
            price: parseFloat(document.getElementById('coursePrice').value),
            description: document.getElementById('courseDescription').value,
            level: document.getElementById('courseLevel').value
        };
        
        if (!course.name || !course.instructor || !course.duration || !course.price) {
            showNotification('Please fill all required fields!', 'warning');
            return;
        }
        
        addCourse(course);
        e.target.reset();
    });
}

if (document.getElementById('editForm')) {
    document.getElementById('editForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = parseInt(document.getElementById('editId').value);
        const updatedCourse = {
            name: document.getElementById('editName').value,
            instructor: document.getElementById('editInstructor').value,
            duration: document.getElementById('editDuration').value,
            price: parseFloat(document.getElementById('editPrice').value),
            description: document.getElementById('editDescription').value,
            level: document.getElementById('editLevel').value
        };
        
        updateCourse(id, updatedCourse);
        closeModal();
    });
}

if (document.getElementById('searchInput')) {
    document.getElementById('searchInput').addEventListener('input', () => displayCourses());
}

if (document.getElementById('filterLevel')) {
    document.getElementById('filterLevel').addEventListener('change', () => displayCourses());
}

if (document.getElementById('clearAllBtn')) {
    document.getElementById('clearAllBtn').addEventListener('click', () => deleteAllCourses());
}

if (document.querySelector('.close')) {
    document.querySelector('.close').addEventListener('click', closeModal);
}

window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('editModal')) {
        closeModal();
    }
});

// Initialize
loadCourses();