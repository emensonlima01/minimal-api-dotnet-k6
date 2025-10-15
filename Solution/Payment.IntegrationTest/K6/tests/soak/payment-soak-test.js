import { sleep } from 'k6';
import { check } from 'k6';
import { soakWorkload } from '../../config/workloads.js';
import { soakThresholds } from '../../config/thresholds.js';
import { createPayment } from '../../scenarios/payment-creation.js';
import { errorRate } from '../../utils/metrics.js';

export const options = {
    ...soakWorkload,
    thresholds: soakThresholds,
};

export default function () {
    const createResult = createPayment();

    const additionalChecks = check(createResult.response, {
        'soak test - status ok': (r) => r.status === 201,
        'soak test - response time ok': (r) => r.timings.duration < 1000,
    });

    if (!createResult.success || !additionalChecks) {
        errorRate.add(1);
    }

    sleep(2);
}
