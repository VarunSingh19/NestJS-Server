// ===== STATE =====
const API = `${window.location.origin}/api/v1`;
let token = localStorage.getItem('token') || null;
let currentUser = null;
let allCourses = [];

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    if (token) {
        fetchProfile();
    }
    loadStats();
});

// ===== NAVIGATION =====
const sections = [
    'hero', 'courses', 'my-courses', 'course-detail', 'login', 'register', 'create'
];

function showSection(name) {
    sections.forEach(s => {
        const el = document.getElementById(`section-${s}`);
        if (el) el.classList.toggle('hidden', s !== name);
    });
    closeMobileNav();

    // Load data when switching sections
    if (name === 'courses') loadCourses();
    if (name === 'my-courses') loadMyCourses();
    if (name === 'create') resetCourseForm();
    if (name === 'hero') loadStats();
}

function toggleMobileNav() {
    document.getElementById('nav-actions').classList.toggle('open');
}

function closeMobileNav() {
    document.getElementById('nav-actions').classList.remove('open');
}

// ===== UI UPDATES =====
function updateNav() {
    const loggedIn = !!token && !!currentUser;
    document.getElementById('nav-login-btn').classList.toggle('hidden', loggedIn);
    document.getElementById('nav-register-btn').classList.toggle('hidden', loggedIn);
    document.getElementById('user-greeting').classList.toggle('hidden', !loggedIn);
    document.getElementById('nav-my-courses-btn').classList.toggle('hidden', !loggedIn);
    document.getElementById('nav-create-btn').classList.toggle('hidden', !loggedIn);
    document.getElementById('nav-logout-btn').classList.toggle('hidden', !loggedIn);
    document.getElementById('hero-get-started').classList.toggle('hidden', loggedIn);

    if (loggedIn) {
        document.getElementById('user-greeting').textContent = `Hi, ${currentUser.fname} 👋`;
    }
}

function toast(msg, type = 'success') {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.className = `toast ${type}`;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 3000);
}

// ===== AUTH =====
async function handleRegister(e) {
    e.preventDefault();
    const btn = document.getElementById('register-submit');
    btn.disabled = true;
    btn.textContent = 'Creating…';

    try {
        const res = await fetch(`${API}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fname: document.getElementById('reg-fname').value.trim(),
                lname: document.getElementById('reg-lname').value.trim(),
                email: document.getElementById('reg-email').value.trim(),
                password: document.getElementById('reg-password').value,
            }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');

        token = data.access_token;
        localStorage.setItem('token', token);
        await fetchProfile();
        toast('Account created successfully!');
        showSection('courses');
    } catch (err) {
        toast(err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Create Account';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const btn = document.getElementById('login-submit');
    btn.disabled = true;
    btn.textContent = 'Logging in…';

    try {
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: document.getElementById('login-email').value.trim(),
                password: document.getElementById('login-password').value,
            }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');

        token = data.access_token;
        localStorage.setItem('token', token);
        await fetchProfile();
        toast('Welcome back!');
        showSection('courses');
    } catch (err) {
        toast(err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Log In';
    }
}

function logout() {
    token = null;
    currentUser = null;
    localStorage.removeItem('token');
    updateNav();
    toast('Logged out');
    showSection('hero');
}

async function fetchProfile() {
    try {
        const res = await fetch(`${API}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        currentUser = await res.json();
        updateNav();
    } catch {
        // Token expired or invalid
        logout();
    }
}

// ===== COURSES =====
async function loadCourses() {
    const grid = document.getElementById('courses-grid');
    const loader = document.getElementById('courses-loader');
    const empty = document.getElementById('courses-empty');
    loader.classList.remove('hidden');
    empty.classList.add('hidden');
    grid.innerHTML = '';
    grid.appendChild(loader);

    try {
        const res = await fetch(`${API}/course`);
        allCourses = await res.json();
        loader.classList.add('hidden');

        if (allCourses.length === 0) {
            empty.classList.remove('hidden');
            return;
        }
        allCourses.forEach(c => grid.appendChild(createCourseCard(c)));
    } catch {
        loader.textContent = 'Failed to load courses.';
    }
}

async function loadMyCourses() {
    const grid = document.getElementById('my-courses-grid');
    const empty = document.getElementById('my-courses-empty');
    grid.innerHTML = '<div class="loader">Loading…</div>';
    empty.classList.add('hidden');

    try {
        const res = await fetch(`${API}/course`);
        const courses = await res.json();
        const mine = courses.filter(c => c.createdBy === currentUser?._id);
        grid.innerHTML = '';

        if (mine.length === 0) {
            empty.classList.remove('hidden');
            return;
        }
        mine.forEach(c => grid.appendChild(createCourseCard(c, true)));
    } catch {
        grid.innerHTML = '<div class="loader">Failed to load courses.</div>';
    }
}

function createCourseCard(course, showActions = false) {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.onclick = () => viewCourse(course._id);

    const levelClass = `badge-${course.level.toLowerCase()}`;
    card.innerHTML = `
    <h3>${esc(course.name)}</h3>
    <p class="card-desc">${esc(course.description)}</p>
    <div class="card-meta">
      <span class="badge ${levelClass}">${esc(course.level)}</span>
      <span class="card-price">₹${course.price}</span>
    </div>
    ${showActions ? `
      <div class="card-actions">
        <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); editCourse('${course._id}')">✏️ Edit</button>
        <button class="btn btn-danger btn-sm" onclick="event.stopPropagation(); deleteCourse('${course._id}')">🗑 Delete</button>
      </div>
    ` : ''}
  `;
    return card;
}

async function viewCourse(id) {
    showSection('course-detail');
    const card = document.getElementById('course-detail-card');
    card.innerHTML = '<div class="loader">Loading…</div>';

    try {
        const res = await fetch(`${API}/course/${id}`);
        if (!res.ok) throw new Error();
        const c = await res.json();
        const levelClass = `badge-${c.level.toLowerCase()}`;
        const isOwner = currentUser && c.createdBy === currentUser._id;

        card.innerHTML = `
      <h2>${esc(c.name)}</h2>
      <div class="detail-info">
        <div class="info-item">
          <span class="info-label">Level</span>
          <span class="badge ${levelClass}" style="width:fit-content">${esc(c.level)}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Price</span>
          <span class="info-value">₹${c.price}</span>
        </div>
      </div>
      <p class="detail-desc">${esc(c.description)}</p>
      ${isOwner ? `
        <div class="detail-actions">
          <button class="btn btn-ghost" onclick="editCourse('${c._id}')">✏️ Edit</button>
          <button class="btn btn-danger" onclick="deleteCourse('${c._id}')">🗑 Delete</button>
        </div>
      ` : ''}
    `;
    } catch {
        card.innerHTML = '<p class="empty-msg">Course not found.</p>';
    }
}

// ===== CREATE / EDIT =====
function resetCourseForm() {
    document.getElementById('course-form-title').textContent = 'Create New Course';
    document.getElementById('course-submit-btn').textContent = 'Create Course';
    document.getElementById('course-edit-id').value = '';
    document.getElementById('course-form').reset();
}

async function editCourse(id) {
    showSection('create');
    document.getElementById('course-form-title').textContent = 'Edit Course';
    document.getElementById('course-submit-btn').textContent = 'Save Changes';

    try {
        const res = await fetch(`${API}/course/${id}`);
        const c = await res.json();
        document.getElementById('course-edit-id').value = c._id;
        document.getElementById('course-name').value = c.name;
        document.getElementById('course-desc').value = c.description;
        document.getElementById('course-level').value = c.level;
        document.getElementById('course-price').value = c.price;
    } catch {
        toast('Failed to load course', 'error');
    }
}

async function handleCourseSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('course-submit-btn');
    const editId = document.getElementById('course-edit-id').value;
    const isEdit = !!editId;

    btn.disabled = true;
    btn.textContent = isEdit ? 'Saving…' : 'Creating…';

    const body = {
        name: document.getElementById('course-name').value.trim(),
        description: document.getElementById('course-desc').value.trim(),
        level: document.getElementById('course-level').value,
        price: Number(document.getElementById('course-price').value),
    };

    try {
        const url = isEdit ? `${API}/course/${editId}` : `${API}/course`;
        const method = isEdit ? 'PATCH' : 'POST';
        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Operation failed');

        toast(isEdit ? 'Course updated!' : 'Course created!');
        showSection('my-courses');
    } catch (err) {
        toast(err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = isEdit ? 'Save Changes' : 'Create Course';
    }
}

async function deleteCourse(id) {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
        const res = await fetch(`${API}/course/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Delete failed');

        toast('Course deleted');
        showSection('my-courses');
    } catch (err) {
        toast(err.message, 'error');
    }
}

// ===== STATS =====
async function loadStats() {
    try {
        const res = await fetch(`${API}/course`);
        const courses = await res.json();
        const instructors = new Set(courses.map(c => c.createdBy)).size;
        document.getElementById('stat-courses').textContent = courses.length;
        document.getElementById('stat-instructors').textContent = instructors;
    } catch {
        document.getElementById('stat-courses').textContent = '0';
        document.getElementById('stat-instructors').textContent = '0';
    }
}

// ===== LOGO =====
document.getElementById('logo-link').addEventListener('click', (e) => {
    e.preventDefault();
    showSection('hero');
});

// ===== HELPER =====
function esc(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}
