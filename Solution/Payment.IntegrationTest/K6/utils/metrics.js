import { Rate, Counter, Trend } from 'k6/metrics';

export const errorRate = new Rate('errors');
export const paymentCounter = new Counter('payments_total');
export const paymentSuccessCounter = new Counter('payments_successful');
export const paymentFailureCounter = new Counter('payments_failed');
export const paymentDuration = new Trend('payment_duration_custom');

export const httpTimeouts = new Rate('http_timeouts');
export const connectionErrors = new Rate('connection_errors');
export const socketErrors = new Rate('socket_errors');
export const dnsErrors = new Rate('dns_errors');
export const networkErrors = new Counter('network_errors_total');

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

export function recordHttpTimeout() {
    httpTimeouts.add(1);
    networkErrors.add(1);
}

export function recordConnectionError() {
    connectionErrors.add(1);
    networkErrors.add(1);
}

export function recordSocketError() {
    socketErrors.add(1);
    networkErrors.add(1);
}

export function recordDnsError() {
    dnsErrors.add(1);
    networkErrors.add(1);
}
