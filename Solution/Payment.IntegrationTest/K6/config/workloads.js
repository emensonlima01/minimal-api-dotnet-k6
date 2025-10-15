export const smokeWorkload = {
    vus: 1,
    duration: '30s',
};

export const loadWorkload = {
    stages: [
        { duration: '6s', target: 50 },
        { duration: '9s', target: 50 },
        { duration: '3s', target: 100 },
        { duration: '9s', target: 100 },
        { duration: '3s', target: 0 },
    ],
};

export const stressWorkload = {
    stages: [
        { duration: '3s', target: 100 },
        { duration: '6s', target: 200 },
        { duration: '6s', target: 300 },
        { duration: '9s', target: 400 },
        { duration: '6s', target: 0 },
    ],
};

export const spikeWorkload = {
    stages: [
        { duration: '6s', target: 50 },
        { duration: '3s', target: 500 },
        { duration: '6s', target: 50 },
        { duration: '3s', target: 1000 },
        { duration: '6s', target: 50 },
        { duration: '6s', target: 0 },
    ],
};

export const soakWorkload = {
    stages: [
        { duration: '6s', target: 100 },
        { duration: '18s', target: 100 },
        { duration: '6s', target: 0 },
    ],
};

export const breakpointWorkload = {
    executor: 'ramping-arrival-rate',
    startRate: 50,
    timeUnit: '1s',
    preAllocatedVUs: 500,
    maxVUs: 2000,
    stages: [
        { duration: '3s', target: 100 },
        { duration: '3s', target: 200 },
        { duration: '6s', target: 400 },
        { duration: '6s', target: 800 },
        { duration: '6s', target: 1600 },
        { duration: '6s', target: 3200 },
    ],
};

export const rampUpWorkload = {
    stages: [
        { duration: '3s', target: 50 },
        { duration: '3s', target: 100 },
        { duration: '3s', target: 150 },
        { duration: '3s', target: 200 },
        { duration: '3s', target: 250 },
        { duration: '6s', target: 300 },
        { duration: '6s', target: 400 },
        { duration: '3s', target: 0 },
    ],
};

export const constantHighLoadWorkload = {
    stages: [
        { duration: '6s', target: 500 },
        { duration: '18s', target: 500 },
        { duration: '6s', target: 0 },
    ],
};

export const benchmarkWorkload = {
    stages: [
        { duration: '6s', target: 100 },
        { duration: '18s', target: 100 },
        { duration: '6s', target: 0 },
    ],
};

export const httpTimeoutWorkload = {
    stages: [
        { duration: '5s', target: 10 },
        { duration: '10s', target: 30 },
        { duration: '5s', target: 0 },
    ],
};

export const connectionLimitWorkload = {
    stages: [
        { duration: '3s', target: 50 },
        { duration: '5s', target: 200 },
        { duration: '10s', target: 500 },
        { duration: '5s', target: 0 },
    ],
};

export const connectionRefusedWorkload = {
    stages: [
        { duration: '5s', target: 5 },
        { duration: '10s', target: 10 },
        { duration: '5s', target: 0 },
    ],
};
