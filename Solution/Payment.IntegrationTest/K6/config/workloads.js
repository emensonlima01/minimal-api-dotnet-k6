export const smokeWorkload = {
    vus: 1,
    duration: '10m',
};

export const loadWorkload = {
    stages: [
        { duration: '2m', target: 50 },
        { duration: '3m', target: 50 },
        { duration: '1m', target: 100 },
        { duration: '3m', target: 100 },
        { duration: '1m', target: 0 },
    ],
};

export const stressWorkload = {
    stages: [
        { duration: '1m', target: 100 },
        { duration: '2m', target: 200 },
        { duration: '2m', target: 300 },
        { duration: '3m', target: 400 },
        { duration: '2m', target: 0 },
    ],
};

export const spikeWorkload = {
    stages: [
        { duration: '2m', target: 50 },
        { duration: '1m', target: 500 },
        { duration: '2m', target: 50 },
        { duration: '1m', target: 1000 },
        { duration: '2m', target: 50 },
        { duration: '2m', target: 0 },
    ],
};

export const soakWorkload = {
    stages: [
        { duration: '2m', target: 100 },
        { duration: '6m', target: 100 },
        { duration: '2m', target: 0 },
    ],
};

export const breakpointWorkload = {
    executor: 'ramping-arrival-rate',
    startRate: 50,
    timeUnit: '1s',
    preAllocatedVUs: 500,
    maxVUs: 2000,
    stages: [
        { duration: '1m', target: 100 },
        { duration: '1m', target: 200 },
        { duration: '2m', target: 400 },
        { duration: '2m', target: 800 },
        { duration: '2m', target: 1600 },
        { duration: '2m', target: 3200 },
    ],
};

export const rampUpWorkload = {
    stages: [
        { duration: '1m', target: 50 },
        { duration: '1m', target: 100 },
        { duration: '1m', target: 150 },
        { duration: '1m', target: 200 },
        { duration: '1m', target: 250 },
        { duration: '2m', target: 300 },
        { duration: '2m', target: 400 },
        { duration: '1m', target: 0 },
    ],
};

export const constantHighLoadWorkload = {
    stages: [
        { duration: '2m', target: 500 },
        { duration: '6m', target: 500 },
        { duration: '2m', target: 0 },
    ],
};

export const benchmarkWorkload = {
    stages: [
        { duration: '2m', target: 100 },
        { duration: '6m', target: 100 },
        { duration: '2m', target: 0 },
    ],
};
