import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from '../config/environments.js';
import { generatePaymentPayload } from '../utils/data-generator.js';

export function createPayment(paymentData = null) {
    const payload = paymentData || generatePaymentPayload();

    const params = {
        headers: { 'Content-Type': 'application/json' },
        tags: { name: 'CreatePayment' },
    };

    const response = http.post(`${BASE_URL}/payments`, JSON.stringify(payload), params);

    const success = check(response, {
        'payment created (201)': (r) => r.status === 201,
        'has transactionId': (r) => r.json('transactionId') !== undefined && r.json('transactionId') !== '',
        'status is Pending': (r) => r.json('status') === 'Pending',
    });

    return {
        success,
        response,
        transactionId: success ? response.json('transactionId') : null,
    };
}

export function createPaymentWithAmount(amount) {
    return createPayment({
        cardNumber: '4111111111111111',
        cardHolderName: 'Test User',
        expirationDate: '12/25',
        cvv: '123',
        amount: amount,
        currency: 'USD',
        description: `Payment with amount ${amount}`,
    });
}
