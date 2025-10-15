import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';
import { Trend, Counter } from 'k6/metrics';
import { benchmarkWorkload } from '../../config/workloads.js';
import { benchmarkThresholds } from '../../config/thresholds.js';
import { createPayment } from '../../scenarios/payment-creation.js';
import { getPaymentById } from '../../scenarios/payment-query.js';
import { BASE_URL, getEnvironment } from '../../config/environments.js';
import { errorRate } from '../../utils/metrics.js';
import { logTestInfo, logTestComplete } from '../../utils/helpers.js';
import { generatePaymentPayload } from '../../utils/data-generator.js';

const paymentDuration = new Trend('payment_duration_custom');
const paymentSuccess = new Counter('payment_success');
const paymentFailure = new Counter('payment_failure');

export const options = {
    ...benchmarkWorkload,
    thresholds: benchmarkThresholds,
};

export function setup() {
    const env = getEnvironment();
    logTestInfo('Payment Performance Benchmark', env.name);

    console.log('Starting warmup...');
    for (let i = 0; i < 10; i++) {
        const payload = generatePaymentPayload();
        http.post(`${BASE_URL}/payments`, JSON.stringify(payload), {
            headers: { 'Content-Type': 'application/json' },
        });
    }
    console.log('Warmup completed');

    return { startTime: new Date() };
}

export default function () {
    const startTime = Date.now();
    const createResult = createPayment();
    const duration = Date.now() - startTime;

    paymentDuration.add(duration);

    const performanceChecks = check(createResult.response, {
        'status is 201': (r) => r.status === 201,
        'response time < 500ms': (r) => r.timings.duration < 500,
        'response time < 200ms': (r) => r.timings.duration < 200,
        'has transactionId': (r) =>
            r.json('transactionId') !== undefined && r.json('transactionId') !== '',
        'status is Pending': (r) => r.json('status') === 'Pending',
        'has createdAt': (r) => r.json('createdAt') !== undefined && r.json('createdAt') !== '',
        'correct amount': (r) => r.json('amount') !== undefined,
    });

    if (createResult.success && performanceChecks) {
        paymentSuccess.add(1);

        const transactionId = createResult.transactionId;
        const queryResult = getPaymentById(transactionId);

        check(queryResult.response, {
            'query status 200': (r) => r.status === 200,
            'query time < 200ms': (r) => r.timings.duration < 200,
        });
    } else {
        paymentFailure.add(1);
        errorRate.add(1);
    }

    sleep(1);
}

export function teardown(data) {
    logTestComplete('Payment Performance Benchmark', data.startTime);
}
