import { sleep } from 'k6';
import { check } from 'k6';
import { httpTimeoutWorkload } from '../../config/workloads.js';
import { httpFailureThresholds } from '../../config/thresholds.js';
import { createPaymentWithTimeout } from '../../scenarios/payment-http-failures.js';
import { errorRate } from '../../utils/metrics.js';
import { httpTimeouts, connectionErrors } from '../../utils/metrics.js';

export const options = {
    ...httpTimeoutWorkload,
    thresholds: httpFailureThresholds,
};

export default function () {
    const result = createPaymentWithTimeout(50);

    const additionalChecks = check(result.response, {
        'HTTP timeout detected': (r) => r.status === 0,
        'error code is timeout': (r) => r.error_code === 1050,
        'NOT application error 500': (r) => r.status !== 500,
    });

    if (result.response.status === 0) {
        httpTimeouts.add(1);
    }

    if (result.response.error && result.response.error.includes('connection')) {
        connectionErrors.add(1);
    }

    if (!result.success || !additionalChecks) {
        errorRate.add(1);
    }

    sleep(0.3);
}
