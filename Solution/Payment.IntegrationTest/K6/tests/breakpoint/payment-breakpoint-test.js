import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { breakpointWorkload } from '../../config/workloads.js';
import { breakpointThresholds } from '../../config/thresholds.js';
import { createPaymentWithAmount } from '../../scenarios/payment-creation.js';
import { errorRate } from '../../utils/metrics.js';

export const options = {
    ...breakpointWorkload,
    thresholds: breakpointThresholds,
};

export default function () {
    const amount = randomIntBetween(10, 100);
    const createResult = createPaymentWithAmount(amount);

    if (!createResult.success) {
        errorRate.add(1);
    }
}
