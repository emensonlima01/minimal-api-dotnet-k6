import { sleep } from 'k6';
import { check } from 'k6';
import { loadWorkload } from '../../config/workloads.js';
import { loadThresholds } from '../../config/thresholds.js';
import { createPayment } from '../../scenarios/payment-creation.js';
import { errorRate } from '../../utils/metrics.js';

export const options = {
    ...loadWorkload,
    thresholds: loadThresholds,
};

export default function () {
    const createResult = createPayment();

    const additionalChecks = check(createResult.response, {
        'response time < 500ms': (r) => r.timings.duration < 500,
    });

    if (!createResult.success || !additionalChecks) {
        errorRate.add(1);
    }

    sleep(Math.random() * 2 + 1);
}
