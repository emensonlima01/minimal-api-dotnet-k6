import { sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { spikeWorkload } from '../../config/workloads.js';
import { spikeThresholds } from '../../config/thresholds.js';
import { createPaymentWithAmount } from '../../scenarios/payment-creation.js';
import { errorRate } from '../../utils/metrics.js';

export const options = {
    ...spikeWorkload,
    thresholds: spikeThresholds,
};

export default function () {
    const amount = randomIntBetween(10, 500);
    const createResult = createPaymentWithAmount(amount);

    if (!createResult.success) {
        errorRate.add(1);
    }

    sleep(Math.random() * 0.5);
}
