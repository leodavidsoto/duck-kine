export const APP_NAME = 'Duck Kinesiología';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const ROLES = {
    PATIENT: 'PATIENT',
    PROFESSIONAL: 'PROFESSIONAL',
    ADMIN: 'ADMIN',
};

export const APPOINTMENT_STATUS = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    NO_SHOW: 'NO_SHOW',
};

export const PAYMENT_STATUS = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    REFUNDED: 'REFUNDED',
};

export const PREVISION_OPTIONS = [
    'FONASA Tramo A',
    'FONASA Tramo B',
    'FONASA Tramo C',
    'FONASA Tramo D',
    'ISAPRE Banmédica',
    'ISAPRE Colmena',
    'ISAPRE Cruz Blanca',
    'ISAPRE Vida Tres',
    'ISAPRE Nueva Masvida',
    'Particular',
];
