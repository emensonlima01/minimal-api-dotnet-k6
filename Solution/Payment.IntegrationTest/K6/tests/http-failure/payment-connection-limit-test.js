import { sleep } from 'k6';
import { check } from 'k6';
import { connectionLimitWorkload } from '../../config/workloads.js';
import { httpFailureThresholds } from '../../config/thresholds.js';
import { createPaymentWithConnectionLimit } from '../../scenarios/payment-http-failures.js';
import { errorRate } from '../../utils/metrics.js';
import { connectionErrors, socketErrors } from '../../utils/metrics.js';

export const options = {
    ...connectionLimitWorkload,
    thresholds: httpFailureThresholds,
};

export default function () {
    const result = createPaymentWithConnectionLimit();

    const additionalChecks = check(result.response, {
        'connection established or failed': (r) => r.status !== undefined,
        'socket error detected': (r) => r.error && r.error.includes('socket'),
    });

    if (result.response.error) {
        if (result.response.error.includes('connection')) {
            connectionErrors.add(1);
        }
        if (result.response.error.includes('socket')) {
            socketErrors.add(1);
        }
    }

    if (!result.success || !additionalChecks) {
        errorRate.add(1);
    }

    sleep(0.1);
}
