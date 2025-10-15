using Payment.Api.Models;
using Payment.Api.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IPaymentRepository, PaymentRepository>();

var app = builder.Build();

app.UseHttpsRedirection();

app.MapPost("/payments", async (PaymentRequest request, IPaymentRepository repository) =>
{
    var transactionId = Guid.NewGuid();

    var payment = new PaymentResponse
    {
        TransactionId = transactionId,
        CardNumberMasked = MaskCardNumber(request.CardNumber),
        CardHolderName = request.CardHolderName,
        Amount = request.Amount,
        Currency = request.Currency,
        Description = request.Description,
        Status = PaymentStatus.Pending,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = null
    };

    await repository.CreateAsync(payment);

    return Results.Created($"/payments/{transactionId}", payment);
})
.WithName("CreatePayment");

app.MapGet("/payments", async (IPaymentRepository repository) =>
{
    var payments = await repository.GetAllAsync();
    return Results.Ok(payments);
})
.WithName("GetAllPayments");

app.MapGet("/payments/{id:guid}", async (Guid id, IPaymentRepository repository) =>
{
    var payment = await repository.GetByIdAsync(id);

    if (payment is null)
    {
        return Results.NotFound(new { Message = "Pagamento não encontrado" });
    }

    return Results.Ok(payment);
})
.WithName("GetPaymentById");

app.MapPut("/payments/{id:guid}", async (Guid id, UpdatePaymentRequest request, IPaymentRepository repository) =>
{
    var existingPayment = await repository.GetByIdAsync(id);

    if (existingPayment is null)
    {
        return Results.NotFound(new { Message = "Pagamento não encontrado" });
    }

    var updatedPayment = existingPayment with
    {
        Status = request.Status,
        Description = string.IsNullOrWhiteSpace(request.Description)
            ? existingPayment.Description
            : request.Description,
        UpdatedAt = DateTime.UtcNow
    };

    await repository.UpdateAsync(id, updatedPayment);

    return Results.Ok(updatedPayment);
})
.WithName("UpdatePayment");

app.MapDelete("/payments/{id:guid}", async (Guid id, IPaymentRepository repository) =>
{
    var deleted = await repository.DeleteAsync(id);

    if (!deleted)
    {
        return Results.NotFound(new { Message = "Pagamento não encontrado" });
    }

    return Results.NoContent();
})
.WithName("DeletePayment");

app.Run();

static string MaskCardNumber(string cardNumber)
{
    if (string.IsNullOrWhiteSpace(cardNumber) || cardNumber.Length < 4)
    {
        return "****";
    }

    var lastFour = cardNumber[^4..];
    return $"**** **** **** {lastFour}";
}