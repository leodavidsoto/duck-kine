/**
 * Date helpers for Chilean timezone (America/Santiago)
 */
const CHILE_TZ = 'America/Santiago';

function toChileTime(date) {
    return new Date(date).toLocaleString('es-CL', { timeZone: CHILE_TZ });
}

function getChileNow() {
    return new Date(new Date().toLocaleString('en-US', { timeZone: CHILE_TZ }));
}

function formatDateCL(date) {
    return new Date(date).toLocaleDateString('es-CL', {
        timeZone: CHILE_TZ,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

function formatTimeCL(date) {
    return new Date(date).toLocaleTimeString('es-CL', {
        timeZone: CHILE_TZ,
        hour: '2-digit',
        minute: '2-digit',
    });
}

module.exports = { CHILE_TZ, toChileTime, getChileNow, formatDateCL, formatTimeCL };
