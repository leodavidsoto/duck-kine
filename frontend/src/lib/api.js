const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

/**
 * Fetch wrapper for Duck Kinesiología API
 */
async function apiFetch(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('dk_token') : null;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Error en la solicitud');
    }

    return data;
}

// ─── Auth ───────────────────────────────────────
export const authAPI = {
    login: (credentials) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
};

// ─── Patients ───────────────────────────────────
export const patientsAPI = {
    getProfile: () => apiFetch('/patients/me'),
    updateProfile: (data) => apiFetch('/patients/me', { method: 'PUT', body: JSON.stringify(data) }),
    getAll: (params) => apiFetch(`/patients?${new URLSearchParams(params)}`),
    getById: (id) => apiFetch(`/patients/${id}`),
    getGoals: () => apiFetch('/patients/me/goals'),
    getAssessments: () => apiFetch('/patients/me/assessments'),
    getExercises: () => apiFetch('/patients/me/exercises'),
    getStats: () => apiFetch('/patients/me/stats'),
    getPainRecords: () => apiFetch('/patients/me/pain-records'),
    createPainRecord: (data) => apiFetch('/patients/me/pain-records', { method: 'POST', body: JSON.stringify(data) }),
};

// ─── Clinical Records ──────────────────────────
export const clinicalAPI = {
    getByPatient: (patientId, params) => apiFetch(`/clinical-records/patient/${patientId}?${new URLSearchParams(params)}`),
    getById: (id) => apiFetch(`/clinical-records/${id}`),
    create: (data) => apiFetch('/clinical-records', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiFetch(`/clinical-records/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// ─── Appointments ──────────────────────────────
export const appointmentsAPI = {
    getAvailable: (params) => apiFetch(`/appointments/available?${new URLSearchParams(params)}`),
    getMy: (params) => apiFetch(`/appointments/my?${new URLSearchParams(params)}`),
    create: (data) => apiFetch('/appointments', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiFetch(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    cancel: (id) => apiFetch(`/appointments/${id}`, { method: 'DELETE' }),
};

// ─── Payments ──────────────────────────────────
export const paymentsAPI = {
    init: (data) => apiFetch('/payments/init', { method: 'POST', body: JSON.stringify(data) }),
    getMy: (params) => apiFetch(`/payments/my?${new URLSearchParams(params)}`),
    getReceipt: (id) => apiFetch(`/payments/receipt/${id}`),
};

// ─── Sports Programs ───────────────────────────
export const sportsAPI = {
    getAll: (params) => apiFetch(`/sports-programs?${new URLSearchParams(params)}`),
    getById: (id) => apiFetch(`/sports-programs/${id}`),
    enroll: (id) => apiFetch(`/sports-programs/${id}/enroll`, { method: 'POST' }),
    updateProgress: (data) => apiFetch('/sports-programs/progress', { method: 'PUT', body: JSON.stringify(data) }),
};

// ─── Academy ───────────────────────────────────
export const academyAPI = {
    getCourses: (params) => apiFetch(`/academy/courses?${new URLSearchParams(params)}`),
    getCourseDetail: (id) => apiFetch(`/academy/courses/${id}`),
    enroll: (id) => apiFetch(`/academy/courses/${id}/enroll`, { method: 'POST' }),
    markProgress: (data) => apiFetch('/academy/progress', { method: 'PUT', body: JSON.stringify(data) }),
};

// ─── Corporate ─────────────────────────────────
export const corporateAPI = {
    getPlans: () => apiFetch('/corporate/plans'),
    submitContact: (data) => apiFetch('/corporate/contact', { method: 'POST', body: JSON.stringify(data) }),
};

// ─── Professionals ─────────────────────────────
export const professionalsAPI = {
    getAll: () => apiFetch('/professionals'),
};

// ─── Services ──────────────────────────────────
export const servicesAPI = {
    getAll: () => apiFetch('/services'),
};

// ─── Admin / Professional ──────────────────────
export const adminAPI = {
    getStats: () => apiFetch('/admin/stats'),
    getTodayAppointments: (date) => apiFetch(`/admin/appointments/today${date ? `?date=${date}` : ''}`),
    confirmAppointment: (id) => apiFetch(`/admin/appointments/${id}/confirm`, { method: 'PATCH' }),
    completeAppointment: (id, data) => apiFetch(`/admin/appointments/${id}/complete`, { method: 'PATCH', body: JSON.stringify(data) }),
    markNoShow: (id) => apiFetch(`/admin/appointments/${id}/no-show`, { method: 'PATCH' }),
    getPatients: (params) => apiFetch(`/admin/patients?${new URLSearchParams(params)}`),
    getPatientFull: (id) => apiFetch(`/admin/patients/${id}/full`),
    createPatient: (data) => apiFetch('/admin/patients', { method: 'POST', body: JSON.stringify(data) }),
    getSessions: (params) => apiFetch(`/admin/sessions?${new URLSearchParams(params)}`),
    createSession: (data) => apiFetch('/admin/sessions', { method: 'POST', body: JSON.stringify(data) }),
    getRevenue: () => apiFetch('/admin/revenue'),
};

export default apiFetch;
