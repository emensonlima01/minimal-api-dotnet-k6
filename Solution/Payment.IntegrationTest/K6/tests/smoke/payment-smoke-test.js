import { sleep } from 'k6';
import { smokeWorkload } from '../../config/workloads.js';
import { smokeThresholds } from '../../config/thresholds.js';
import { createPayment } from '../../scenarios/payment-creation.js';
import { getPaymentById } from '../../scenarios/payment-query.js';
import { errorRate } from '../../utils/metrics.js';

export const options = {
    ...smokeWorkload,
    thresholds: smokeThresholds,
};

export default function () {
    const createResult = createPayment();

    if (!createResult.success) {
        errorRate.add(1);
    }

    if (createResult.success && createResult.transactionId) {
        const queryResult = getPaymentById(createResult.transactionId);

        if (!queryResult.success) {
            errorRate.add(1);
        }
    }

    sleep(1);
}
