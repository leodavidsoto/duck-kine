/**
 * Validates a Chilean RUT (Rol Único Tributario)
 * @param {string} rut - Format: "12.345.678-9" or "12345678-9"
 * @returns {boolean}
 */
function validateRut(rut) {
    if (!rut || typeof rut !== 'string') return false;

    // Remove dots and hyphens
    const clean = rut.replace(/\./g, '').replace(/-/g, '');
    if (clean.length < 2) return false;

    const body = clean.slice(0, -1);
    const dv = clean.slice(-1).toUpperCase();

    // Calculate verification digit
    let sum = 0;
    let multiplier = 2;
    for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body[i]) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const remainder = 11 - (sum % 11);
    let expectedDv;
    if (remainder === 11) expectedDv = '0';
    else if (remainder === 10) expectedDv = 'K';
    else expectedDv = remainder.toString();

    return dv === expectedDv;
}

/**
 * Format RUT with dots and hyphen
 * @param {string} rut - Raw RUT
 * @returns {string} Formatted RUT
 */
function formatRut(rut) {
    const clean = rut.replace(/[^0-9kK]/g, '');
    if (clean.length < 2) return rut;

    const body = clean.slice(0, -1);
    const dv = clean.slice(-1);

    const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formatted}-${dv}`;
}

module.exports = { validateRut, formatRut };
