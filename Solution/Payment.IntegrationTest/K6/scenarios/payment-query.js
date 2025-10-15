import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from '../config/environments.js';

export function getPaymentById(transactionId) {
    const params = {
        tags: { name: 'GetPaymentById' },
    };

    const response = http.get(`${BASE_URL}/payments/${transactionId}`, params);

    const success = check(response, {
        'payment found (200)': (r) => r.status === 200,
        'has transactionId': (r) => r.json('transactionId') === transactionId,
    });

    return {
        success,
        response,
        payment: success ? response.json() : null,
    };
}

export function getAllPayments() {
    const params = {
        tags: { name: 'GetAllPayments' },
    };

    const response = http.get(`${BASE_URL}/payments`, params);

    const success = check(response, {
        'payments retrieved (200)': (r) => r.status === 200,
        'response is array': (r) => Array.isArray(r.json()),
    });

    return {
        success,
        response,
        payments: success ? response.json() : [],
    };
}
