# Minimal API .NET (Pagamentos - Exemplo)

Projeto de estudo em ASP.NET Core Minimal APIs (.NET 8) que expõe um fluxo simples de pagamentos usando armazenamento em memória e suítes de teste de carga com k6.

## Requisitos
- .NET SDK 8.0 ou superior
- k6 0.49+ instalado localmente **ou** Docker 24+ para executar os cenários de carga via container
- (Opcional) Docker Compose 2.24+ para orquestrar a API e a bateria completa de testes

## Execução da Minimal API
- Via .NET SDK:
  - `dotnet run --project Solution/Payment.Api`
  - Endereços padrão: `https://localhost:7061` e `http://localhost:5175`
  - Se necessário, confiar certificado dev HTTPS: `dotnet dev-certs https --trust`
- Via Docker:
  - Build: `docker build -t minimal-api-dotnet -f Solution/Payment.Api/Dockerfile Solution/Payment.Api`
  - Run: `docker run -p 8080:8080 -p 8081:8081 minimal-api-dotnet`

## Endpoints Principais
Base path: `/payments`

- POST `/payments` cria um pagamento em memória  
  Exemplo de body:
  ```json
  {
    "cardNumber": "4111111111111111",
    "cardHolderName": "Maria Silva",
    "expirationDate": "12/28",
    "cvv": "123",
    "amount": 150.75,
    "currency": "BRL",
    "description": "Pedido #123"
  }
  ```
- GET `/payments` lista todos os pagamentos
- GET `/payments/{id}` busca um pagamento específico
- PUT `/payments/{id}` atualiza status e descrição
- DELETE `/payments/{id}` remove o pagamento

Modelos disponíveis em `Solution/Payment.Api/Models`: `PaymentRequest`, `PaymentResponse`, `PaymentStatus`, `UpdatePaymentRequest`.

## Estrutura do Projeto
```
Solution/
├─ Payment.Api/                    # Minimal API
│  ├─ Program.cs                   # Endpoints e DI
│  ├─ Models/                      # Records e enums de contrato
│  └─ Repositories/                # Repositório em memória
└─ Payment.IntegrationTest/
   └─ K6/                          # Scripts k6 para carga
      ├─ config/                   # Variáveis de ambiente, workloads e thresholds
      ├─ scenarios/                # Operações reutilizáveis (CRUD)
      ├─ tests/                    # Suítes completas de carga
      └─ utils/                    # Geradores, métricas e helpers
```

## Testes de Carga com k6

A pasta `Solution/Payment.IntegrationTest/K6` contém uma coleção de suítes de carga pensadas para exercitar Minimal APIs: fumaça, carga sustentada, estresse, pico, soak, breakpoint, ramp-up, carga constante, cenários mistos e benchmark de desempenho. Cada suíte combina cenários reutilizáveis com workloads e limites de desempenho específicos.

### Pastas e responsabilidades
- `config/environments.js` define URLs por ambiente e permite sobrescrever via `ENVIRONMENT` ou `API_URL`
- `config/workloads.js` descreve o padrão de usuários virtuais para cada tipo de teste
- `config/thresholds.js` centraliza os limites de SLA usados nas suítes
- `scenarios/` concentra funções para criar, consultar, atualizar e excluir pagamentos
- `tests/` contém os scripts executáveis (`k6 run`) organizados por tipo de teste
- `utils/data-generator.js` gera cargas válidas e variações (montantes pequenos, grandes, moedas diferentes)
- `utils/metrics.js` declara métricas customizadas (`errors`, `payments_total`, `payment_duration_custom` etc.)
- `utils/helpers.js` possui rastreadores e logs padronizados para execuções longas

### Configuração de ambiente
- `API_URL`: URL base da API sob teste (ex.: `http://localhost:5000`). Sobrescreve o valor encontrado em `environments.js`
- `ENVIRONMENT`: chave (`dev`, `staging`, `prod`) usada para carregar a URL e exibir o nome do ambiente em logs
- `K6_OUT`: opcional para exportar resultados (`K6_OUT=json=test-results.json` ou `influxdb=http://...`)
- Ajuste workloads em `config/workloads.js` para adaptar duração, VUs e rampas ao cenário real
- Ajuste thresholds em `config/thresholds.js` para refletir SLOs da aplicação Minimal API

### Suítes disponíveis
| Suite | Objetivo | Script | Workload | Thresholds | Execução |
| ----- | -------- | ------ | -------- | ---------- | -------- |
| Smoke | Validar CRUD básico com baixa carga | `tests/smoke/payment-smoke-test.js` | `smokeWorkload` | `smokeThresholds` | `API_URL=http://localhost:5000 k6 run tests/smoke/payment-smoke-test.js` |
| Load | Medir desempenho sustentado com carga moderada | `tests/load/payment-load-test.js` | `loadWorkload` | `loadThresholds` | `k6 run tests/load/payment-load-test.js` |
| Stress | Testar degradação gradual até alta carga | `tests/stress/payment-stress-test.js` | `stressWorkload` | `stressThresholds` | `k6 run tests/stress/payment-stress-test.js` |
| Spike | Avaliar resistência a picos abruptos | `tests/spike/payment-spike-test.js` | `spikeWorkload` | `spikeThresholds` | `k6 run tests/spike/payment-spike-test.js` |
| Soak | Verificar estabilidade prolongada | `tests/soak/payment-soak-test.js` | `soakWorkload` | `soakThresholds` | `k6 run tests/soak/payment-soak-test.js` |
| Breakpoint | Encontrar limite superior da API | `tests/breakpoint/payment-breakpoint-test.js` | `breakpointWorkload` | `breakpointThresholds` | `k6 run tests/breakpoint/payment-breakpoint-test.js` |
| Ramp-up | Observar comportamento em rampas graduais | `tests/ramp-up/payment-ramp-up-test.js` | `rampUpWorkload` | `rampUpThresholds` | `k6 run tests/ramp-up/payment-ramp-up-test.js` |
| Carga Constante Alta | Garantir throughput elevado por longos períodos | `tests/high-load/payment-constant-high-load-test.js` | `constantHighLoadWorkload` | `highLoadThresholds` | `k6 run tests/high-load/payment-constant-high-load-test.js` |
| Cenários Mistos | Simular padrões diferenciados de usuários | `tests/mixed/payment-mixed-scenarios-test.js` | múltiplos executores | thresholds embutidos | `k6 run tests/mixed/payment-mixed-scenarios-test.js` |
| Benchmark | Suíte abrangente com warmup e validações extras | `tests/benchmark/payment-performance-benchmark-test.js` | `benchmarkWorkload` | `benchmarkThresholds` | `k6 run tests/benchmark/payment-performance-benchmark-test.js` |

> Dica: execute `npm install --global k6` (ou use binários oficiais) para disponibilizar o comando `k6`. No Windows, verifique se o diretório do k6 está no PATH.

### Execução passo a passo (manual)
1. Suba a Minimal API localmente (`dotnet run --project Solution/Payment.Api`) ou via Docker (`docker compose up payment-api`)
2. Exporte `API_URL` apontando para a API (`set API_URL=http://localhost:5000` no PowerShell ou `export API_URL=...` em shell Unix)
3. Acesse `Solution/Payment.IntegrationTest/K6`
4. Escolha o script desejado e execute `k6 run <caminho-do-script>`
5. Ao final, confira os thresholds avaliados na saída padrão e utilize as métricas customizadas para diagnóstico

### Execução orquestrada com Docker Compose
- Arquivo `Solution/docker-compose.yml` constrói a API e roda todas as suítes em sequência (smoke -> load -> stress -> spike -> soak -> breakpoint -> ramp-up -> high-load -> mixed -> benchmark)
- Comando: `docker compose up --build k6-benchmark`
  - O `depends_on` garante que cada suíte aguarde a anterior terminar com sucesso
  - Os containers usam a imagem oficial `grafana/k6` e montam os scripts em `/scripts`
  - O serviço `k6-cleanup` remove os containers de teste ao final para manter o ambiente limpo
- Para rodar apenas uma suíte específica via Compose: `docker compose run --rm k6-load`

### Métricas, logs e saídas
- Métricas customizadas registradas em `utils/metrics.js` (ex.: `errors`, `payments_total`, `payment_duration_custom`)
- Use `k6 run --summary-export summary.json ...` para salvar o resumo e comparar execuções
- Combine com `K6_OUT=cloud` ou `influxdb` para visualizar tendências em Grafana/Prometheus
- `utils/helpers.js` imprime informações de início e fim de testes longos, auxiliando auditoria

### Adaptando para outras Minimal APIs
- Atualize os cenários em `scenarios/*.js` para refletir endpoints, validações e status esperados
- Ajuste o gerador de dados (`data-generator.js`) para criar payloads condizentes com o domínio
- Estenda as suítes em `tests/` ou crie novas combinando workloads e thresholds customizados
- Utilize `metrics.js` para adicionar novas métricas ou contadores específicos do negócio
- Considere mocks de dependências externas para reprodução consistente durante a carga

### Boas práticas e resolução de problemas
- Rode o teste de fumaça antes de cenários intensos para validar se a API responde
- Em ambientes Windows, prefira PowerShell ou WSL para scripts longos; garanta que `API_URL` não use HTTPS self-signed sem confiar o certificado
- Se perceber `http_req_failed` elevado, revise log da API (latência alta, exceptions) e considere throttling de requisições
- Ajuste gradualmente as cargas; comece pequeno, meça, depois aumente VUs e duração
- Utilize `--vus` e `--duration` durante explorações rápidas sem alterar os arquivos base

## Referências
- Minimal APIs (ASP.NET Core): https://learn.microsoft.com/aspnet/core/fundamentals/minimal-apis
- k6 Load Testing: https://grafana.com/oss/k6/
- Conceitos de testes de carga: https://learn.microsoft.com/load-test/overview
- Guia de benchmarks em APIs REST: https://azure.microsoft.com/resources/load-testing-web-apis/
