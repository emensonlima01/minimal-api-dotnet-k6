import { Rate, Counter, Trend } from 'k6/metrics';

export const errorRate = new Rate('errors');
export const paymentCounter = new Counter('payments_total');
export const paymentSuccessCounter = new Counter('payments_successful');
export const paymentFailureCounter = new Counter('payments_failed');
export const paymentDuration = new Trend('payment_duration_custom');

export function recordSuccess() {
    paymentCounter.add(1);
    paymentSuccessCounter.add(1);
}

export function recordFailure() {
    paymentCounter.add(1);
    paymentFailureCounter.add(1);
    errorRate.add(1);
}

export function recordDuration(duration) {
    paymentDuration.add(duration);
}
