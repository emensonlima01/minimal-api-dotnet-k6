import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from '../config/environments.js';
import { generatePaymentPayload } from '../utils/data-generator.js';

export function createPaymentWithTimeout(timeoutMs = 50) {
    const payload = generatePaymentPayload();

    const params = {
        headers: { 'Content-Type': 'application/json' },
        timeout: `${timeoutMs}ms`, 
        tags: { name: 'CreatePayment_HTTPTimeout' },
    };

    const response = http.post(`${BASE_URL}/payments`, JSON.stringify(payload), params);

    const success = check(response, {
        'HTTP layer timeout': (r) => r.status === 0 && r.error_code === 1050,
    });

    return {
        success,
        response,
        isHttpFailure: response.status === 0,
    };
}

export function createPaymentWithConnectionLimit() {
    const payload = generatePaymentPayload();

    const params = {
        headers: { 'Content-Type': 'application/json' },
        tags: { name: 'CreatePayment_ConnectionLimit' },
    };

    const response = http.post(`${BASE_URL}/payments`, JSON.stringify(payload), params);

    const success = check(response, {
        'request completed': (r) => r.status !== undefined,
    });

    return {
        success,
        response,
        isHttpFailure: response.error !== undefined,
    };
}

export function createPaymentToInvalidHost() {
    const payload = generatePaymentPayload();

    const params = {
        headers: { 'Content-Type': 'application/json' },
        timeout: '2000ms',
        tags: { name: 'CreatePayment_ConnectionRefused' },
    };

    const invalidUrl = 'http://payment-api:9999'; 
    const response = http.post(`${invalidUrl}/payments`, JSON.stringify(payload), params);

    const success = check(response, {
        'connection refused': (r) => r.status === 0,
        'error present': (r) => r.error !== undefined,
    });

    return {
        success,
        response,
        isHttpFailure: true,
    };
}

export function createPaymentWithReadTimeout(timeoutMs = 100) {
    const payload = generatePaymentPayload();

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'X-Delay-Response': '5000', 
        },
        timeout: `${timeoutMs}ms`,
        tags: { name: 'CreatePayment_ReadTimeout' },
    };

    const response = http.post(`${BASE_URL}/payments`, JSON.stringify(payload), params);

    const success = check(response, {
        'read timeout occurred': (r) => r.status === 0 || r.error_code === 1050,
    });

    return {
        success,
        response,
        isHttpFailure: response.status === 0,
    };
}

export function createPaymentToDNSFailure() {
    const payload = generatePaymentPayload();

    const params = {
        headers: { 'Content-Type': 'application/json' },
        timeout: '3000ms',
        tags: { name: 'CreatePayment_DNSFailure' },
    };

    const invalidHost = 'http://non-existent-host-123456.invalid';
    const response = http.post(`${invalidHost}/payments`, JSON.stringify(payload), params);

    const success = check(response, {
        'DNS resolution failed': (r) => r.status === 0,
        'network error': (r) => r.error !== undefined,
    });

    return {
        success,
        response,
        isHttpFailure: true,
    };
}
