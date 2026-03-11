/**
 * Minimal client-side logger for copilot components
 */
export function createClientLogger(namespace) {
    return {
        info: (...args) => console.log(`[${namespace}]`, ...args),
        warn: (...args) => console.warn(`[${namespace}]`, ...args),
        error: (...args) => console.error(`[${namespace}]`, ...args),
        debug: (...args) => console.debug(`[${namespace}]`, ...args),
    };
}
