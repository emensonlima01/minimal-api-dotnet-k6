using Payment.Api.Models;

namespace Payment.Api.Repositories;

public interface IPaymentRepository
{
    Task<PaymentResponse> CreateAsync(PaymentResponse payment);
    Task<PaymentResponse?> GetByIdAsync(Guid transactionId);
    Task<IEnumerable<PaymentResponse>> GetAllAsync();
    Task<PaymentResponse?> UpdateAsync(Guid transactionId, PaymentResponse payment);
    Task<bool> DeleteAsync(Guid transactionId);
    Task<bool> ExistsAsync(Guid transactionId);
}
