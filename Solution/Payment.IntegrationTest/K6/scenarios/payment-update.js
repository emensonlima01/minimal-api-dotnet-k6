import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from '../config/environments.js';

export function updatePayment(transactionId, status, description = '') {
    const payload = {
        status: status,
        description: description,
    };

    const params = {
        headers: { 'Content-Type': 'application/json' },
        tags: { name: 'UpdatePayment' },
    };

    const response = http.put(
        `${BASE_URL}/payments/${transactionId}`,
        JSON.stringify(payload),
        params
    );

    const success = check(response, {
        'payment updated (200)': (r) => r.status === 200,
        'status updated': (r) => r.json('status') === status,
        'has updatedAt': (r) => r.json('updatedAt') !== null,
    });

    return {
        success,
        response,
        payment: success ? response.json() : null,
    };
}

export function approvePayment(transactionId) {
    return updatePayment(transactionId, 'Approved', 'Payment approved');
}

export function declinePayment(transactionId) {
    return updatePayment(transactionId, 'Declined', 'Payment declined');
}

export function cancelPayment(transactionId) {
    return updatePayment(transactionId, 'Cancelled', 'Payment cancelled');
}
