import { sleep } from 'k6';
import { check } from 'k6';
import { Trend } from 'k6/metrics';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { rampUpWorkload } from '../../config/workloads.js';
import { rampUpThresholds } from '../../config/thresholds.js';
import { createPaymentWithAmount } from '../../scenarios/payment-creation.js';
import { errorRate } from '../../utils/metrics.js';

const paymentDuration = new Trend('payment_duration');

export const options = {
    ...rampUpWorkload,
    thresholds: rampUpThresholds,
};

export default function () {
    const amount = randomIntBetween(10, 2000);

    const startTime = Date.now();
    const createResult = createPaymentWithAmount(amount);
    const duration = Date.now() - startTime;

    paymentDuration.add(duration);

    const additionalChecks = check(createResult.response, {
        'ramp-up - status ok': (r) => r.status === 201,
    });

    if (!createResult.success || !additionalChecks) {
        errorRate.add(1);
    }

    sleep(Math.random() * 1);
}
