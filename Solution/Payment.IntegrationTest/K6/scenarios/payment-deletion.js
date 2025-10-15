import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from '../config/environments.js';

export function deletePayment(transactionId) {
    const params = {
        tags: { name: 'DeletePayment' },
    };

    const response = http.del(`${BASE_URL}/payments/${transactionId}`, null, params);

    const success = check(response, {
        'payment deleted (204)': (r) => r.status === 204,
    });

    return {
        success,
        response,
    };
}
