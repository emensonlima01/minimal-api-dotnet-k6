import { randomIntBetween, randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const currencies = ['USD', 'EUR', 'GBP', 'BRL', 'JPY'];
const cardNumbers = [
    '4111111111111111', // Visa
    '5555555555554444', // Mastercard
    '378282246310005',  // Amex
];

export function generatePaymentPayload(options = {}) {
    const vuId = __VU || 1;
    const iterationId = __ITER || 1;

    return {
        cardNumber: options.cardNumber || randomItem(cardNumbers),
        cardHolderName: options.cardHolderName || `Test User ${vuId}`,
        expirationDate: options.expirationDate || '12/25',
        cvv: options.cvv || '123',
        amount: options.amount || randomIntBetween(10, 1000),
        currency: options.currency || randomItem(currencies),
        description: options.description || `Test payment - VU:${vuId} Iter:${iterationId}`,
    };
}

export function generateLargePayment() {
    return generatePaymentPayload({
        amount: randomIntBetween(5000, 50000),
        description: 'Large payment transaction',
    });
}

export function generateSmallPayment() {
    return generatePaymentPayload({
        amount: randomIntBetween(1, 100),
        description: 'Small payment transaction',
    });
}

export function generatePaymentWithCurrency(currency) {
    return generatePaymentPayload({ currency });
}

export function generateInvalidPayment() {
    return {
        cardNumber: '0000000000000000',
        cardHolderName: '',
        expirationDate: '00/00',
        cvv: '000',
        amount: -1,
        currency: 'INVALID',
        description: 'Invalid payment for testing',
    };
}
