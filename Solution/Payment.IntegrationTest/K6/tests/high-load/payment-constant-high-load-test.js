import { sleep } from 'k6';
import { check } from 'k6';
import { Counter } from 'k6/metrics';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { constantHighLoadWorkload } from '../../config/workloads.js';
import { highLoadThresholds } from '../../config/thresholds.js';
import { createPaymentWithAmount } from '../../scenarios/payment-creation.js';
import { errorRate, paymentCounter } from '../../utils/metrics.js';

const successCounter = new Counter('payments_successful');

export const options = {
    ...constantHighLoadWorkload,
    thresholds: highLoadThresholds,
};

export default function () {
    const amount = randomIntBetween(100, 5000);

    paymentCounter.add(1);

    const createResult = createPaymentWithAmount(amount);

    const additionalChecks = check(createResult.response, {
        'high load - status ok': (r) => r.status === 201,
        'high load - response time acceptable': (r) => r.timings.duration < 2000,
    });

    if (createResult.success && additionalChecks) {
        successCounter.add(1);
    } else {
        errorRate.add(1);
    }

    sleep(0.5);
}
