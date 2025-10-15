import { sleep } from 'k6';
import { check } from 'k6';
import { connectionRefusedWorkload } from '../../config/workloads.js';
import { httpFailureThresholds } from '../../config/thresholds.js';
import { createPaymentToInvalidHost } from '../../scenarios/payment-http-failures.js';
import { errorRate } from '../../utils/metrics.js';
import { connectionErrors } from '../../utils/metrics.js';

export const options = {
    ...connectionRefusedWorkload,
    thresholds: httpFailureThresholds,
};

export default function () {
    const result = createPaymentToInvalidHost();

    const additionalChecks = check(result.response, {
        'connection refused detected': (r) => r.status === 0,
        'error contains refused or unreachable': (r) =>
            r.error && (r.error.includes('refused') || r.error.includes('unreachable')),
    });

    if (result.response.status === 0) {
        connectionErrors.add(1);
    }

    if (!result.success || !additionalChecks) {
        errorRate.add(1);
    }

    sleep(0.5);
}
