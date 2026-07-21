// ── API Utility ──────────────────────────────────────────────────────────
const API_BASE = '/api';

function getToken() {
    return localStorage.getItem('token');
}

function setSession(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('apiKey', data.apiKey);
    localStorage.setItem('email', data.email);
}

function clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('apiKey');
    localStorage.removeItem('email');
}

function requireAuth() {
    if (!getToken()) {
        window.location.href = '/index.html';
    }
}

async function apiFetch(path, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await res.json();

    if (res.status === 401) {
        clearSession();
        window.location.href = '/index.html';
        throw new Error('Session expired');
    }

    return { ok: res.ok, status: res.status, data };
}

// ── Alert helpers ─────────────────────────────────────────────────────────
function showAlert(id, msg, type = 'error') {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.className = `alert alert-${type} show`;
}

function hideAlert(id) {
    const el = document.getElementById(id);
    if (el) el.className = 'alert';
}

// ── Mobile Navigation Toggle ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        const menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.innerHTML = '☰';
        document.body.appendChild(menuBtn);

        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
            menuBtn.innerHTML = sidebar.classList.contains('open') ? '✕' : '☰';
        });

        // Click outside to close sidebar on mobile
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== menuBtn) {
                sidebar.classList.remove('open');
                menuBtn.innerHTML = '☰';
            }
        });
    }
});
