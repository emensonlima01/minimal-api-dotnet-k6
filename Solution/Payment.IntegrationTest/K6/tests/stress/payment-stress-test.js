import { sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { stressWorkload } from '../../config/workloads.js';
import { stressThresholds } from '../../config/thresholds.js';
import { createPaymentWithAmount } from '../../scenarios/payment-creation.js';
import { errorRate } from '../../utils/metrics.js';

export const options = {
    ...stressWorkload,
    thresholds: stressThresholds,
};

export default function () {
    const amount = randomIntBetween(50, 5000);
    const createResult = createPaymentWithAmount(amount);

    if (!createResult.success) {
        errorRate.add(1);
    }

    sleep(0.5);
}
