import { sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { createPaymentWithAmount } from '../../scenarios/payment-creation.js';
import { getPaymentById } from '../../scenarios/payment-query.js';
import { errorRate } from '../../utils/metrics.js';
import { PaymentTracker } from '../../utils/helpers.js';

const paymentTracker = new PaymentTracker();

export const options = {
    scenarios: {
        normal_users: {
            executor: 'constant-vus',
            vus: 50,
            duration: '10m',
            exec: 'normalUser',
        },
        heavy_users: {
            executor: 'constant-vus',
            vus: 20,
            duration: '10m',
            exec: 'heavyUser',
        },
        burst_users: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '1m40s', target: 100 },
                { duration: '1m40s', target: 0 },
                { duration: '1m40s', target: 100 },
                { duration: '1m40s', target: 0 },
                { duration: '1m40s', target: 100 },
                { duration: '1m40s', target: 0 },
            ],
            exec: 'burstUser',
        },
        status_checkers: {
            executor: 'constant-vus',
            vus: 30,
            duration: '10m',
            exec: 'statusChecker',
        },
    },
    thresholds: {
        http_req_duration: ['p(95)<1500'],
        http_req_failed: ['rate<0.1'],
    },
};

export function normalUser() {
    const amount = randomIntBetween(10, 500);
    const createResult = createPaymentWithAmount(amount);

    if (createResult.success && createResult.transactionId) {
        paymentTracker.addPayment(createResult.transactionId);
    } else {
        errorRate.add(1);
    }

    sleep(randomIntBetween(2, 5));
}

export function heavyUser() {
    const amount = randomIntBetween(5000, 50000);
    const createResult = createPaymentWithAmount(amount);

    if (createResult.success && createResult.transactionId) {
        paymentTracker.addPayment(createResult.transactionId);
    } else {
        errorRate.add(1);
    }

    sleep(randomIntBetween(3, 8));
}

export function burstUser() {
    const amount = randomIntBetween(10, 1000);
    const createResult = createPaymentWithAmount(amount);

    if (createResult.success && createResult.transactionId) {
        paymentTracker.addPayment(createResult.transactionId);
    } else {
        errorRate.add(1);
    }

    sleep(0.5);
}

export function statusChecker() {
    if (!paymentTracker.hasPayments()) {
        sleep(randomIntBetween(1, 3));
        return;
    }

    const transactionId = paymentTracker.getRandomPayment();
    const queryResult = getPaymentById(transactionId);

    if (!queryResult.success) {
        errorRate.add(1);
    }

    sleep(randomIntBetween(1, 3));
}
