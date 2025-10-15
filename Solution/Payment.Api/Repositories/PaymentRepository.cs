using System.Collections.Concurrent;
using Payment.Api.Models;

namespace Payment.Api.Repositories;

public class PaymentRepository : IPaymentRepository
{
    private readonly ConcurrentDictionary<Guid, PaymentResponse> _payments = new();

    public Task<PaymentResponse> CreateAsync(PaymentResponse payment)
    {
        if (!_payments.TryAdd(payment.TransactionId, payment))
        {
            throw new InvalidOperationException($"Payment with ID {payment.TransactionId} already exists.");
        }

        return Task.FromResult(payment);
    }

    public Task<PaymentResponse?> GetByIdAsync(Guid transactionId)
    {
        _payments.TryGetValue(transactionId, out var payment);
        return Task.FromResult(payment);
    }

    public Task<IEnumerable<PaymentResponse>> GetAllAsync()
    {
        var payments = _payments.Values.AsEnumerable();
        return Task.FromResult(payments);
    }

    public Task<PaymentResponse?> UpdateAsync(Guid transactionId, PaymentResponse payment)
    {
        if (!_payments.ContainsKey(transactionId))
        {
            return Task.FromResult<PaymentResponse?>(null);
        }

        _payments[transactionId] = payment;
        return Task.FromResult<PaymentResponse?>(payment);
    }

    public Task<bool> DeleteAsync(Guid transactionId)
    {
        var removed = _payments.TryRemove(transactionId, out _);
        return Task.FromResult(removed);
    }

    public Task<bool> ExistsAsync(Guid transactionId)
    {
        var exists = _payments.ContainsKey(transactionId);
        return Task.FromResult(exists);
    }
}
