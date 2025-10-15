export class PaymentTracker {
    constructor() {
        this.createdPayments = [];
    }

    addPayment(transactionId) {
        if (transactionId) {
            this.createdPayments.push(transactionId);
        }
    }

    getRandomPayment() {
        if (this.createdPayments.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * this.createdPayments.length);
        return this.createdPayments[randomIndex];
    }

    hasPayments() {
        return this.createdPayments.length > 0;
    }

    getCount() {
        return this.createdPayments.length;
    }
}

export function sleep(min, max = null) {
    const sleepTime = max ? Math.random() * (max - min) + min : min;
    return sleepTime;
}

export function logTestInfo(testName, environment) {
    console.log(`==========================================`);
    console.log(`Test: ${testName}`);
    console.log(`Environment: ${environment}`);
    console.log(`Start Time: ${new Date().toISOString()}`);
    console.log(`==========================================`);
}

export function logTestComplete(testName, startTime) {
    const endTime = new Date();
    const duration = (endTime - startTime) / 1000;
    console.log(`==========================================`);
    console.log(`Test: ${testName} - COMPLETED`);
    console.log(`Duration: ${duration.toFixed(2)} seconds`);
    console.log(`End Time: ${endTime.toISOString()}`);
    console.log(`==========================================`);
}
