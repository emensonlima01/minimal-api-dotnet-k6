export const commonThresholds = {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
};

export const smokeThresholds = {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.01'],
    errors: ['rate<0.01'],
};

export const loadThresholds = {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.05'],
    errors: ['rate<0.05'],
};

export const stressThresholds = {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.1'],
    errors: ['rate<0.1'],
};

export const spikeThresholds = {
    http_req_duration: ['p(95)<3000'],
    http_req_failed: ['rate<0.2'],
};

export const soakThresholds = {
    http_req_duration: ['p(95)<800'],
    http_req_failed: ['rate<0.05'],
    errors: ['rate<0.05'],
};

export const breakpointThresholds = {
    http_req_duration: ['p(95)<5000'],
};

export const rampUpThresholds = {
    http_req_duration: ['p(95)<1500'],
    http_req_failed: ['rate<0.1'],
    payment_duration: ['p(95)<1000'],
};

export const highLoadThresholds = {
    http_req_duration: ['p(95)<1000', 'p(99)<2000'],
    http_req_failed: ['rate<0.1'],
    errors: ['rate<0.1'],
};

export const benchmarkThresholds = {
    http_req_duration: ['p(50)<200', 'p(90)<400', 'p(95)<500', 'p(99)<800'],
    http_req_failed: ['rate<0.01'],
    payment_duration_custom: ['p(95)<500', 'avg<300'],
    errors: ['rate<0.01'],
};

export const httpFailureThresholds = {
    http_req_failed: ['rate>0.5'], 
    http_timeouts: ['rate>0.3'], 
    connection_errors: ['rate<1'], 
    network_errors_total: ['count>0'], 
};
