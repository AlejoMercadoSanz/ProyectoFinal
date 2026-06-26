using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using OdontoGestPro.Application.Interfaces;

namespace OdontoGestPro.Infrastructure.Jobs;

public class RecordatorioCitasJob : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<RecordatorioCitasJob> _logger;

    public RecordatorioCitasJob(IServiceProvider serviceProvider, ILogger<RecordatorioCitasJob> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var ahora = DateTime.Now;
            var proximoEnvio = ahora.Date.AddHours(9);
            if (ahora >= proximoEnvio)
                proximoEnvio = proximoEnvio.AddDays(1);

            var espera = proximoEnvio - ahora;
            await Task.Delay(espera, stoppingToken);

            await EnviarRecordatorios();
        }
    }

    private async Task EnviarRecordatorios()
    {
        try
        {
            using var scope = _serviceProvider.CreateScope();
            var citaRepo = scope.ServiceProvider.GetRequiredService<ICitaRepository>();
            var pacienteRepo = scope.ServiceProvider.GetRequiredService<IPacienteRepository>();
            var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

            var manana = DateTime.Now.Date.AddDays(1);
            var inicio = manana;
            var fin = manana.AddDays(1).AddSeconds(-1);

            var citas = await citaRepo.GetByRangoAsync(inicio, fin);

            foreach (var cita in citas)
            {
                if (cita.Estado == "Cancelada") continue;

                var paciente = await pacienteRepo.GetByIdAsync(cita.PacienteId);
                if (paciente == null || string.IsNullOrEmpty(paciente.Email)) continue;

                await emailService.SendRecordatorioCitaAsync(
                    paciente.Email,
                    $"{paciente.Nombre} {paciente.Apellido}",
                    cita.FechaHora,
                    cita.DuracionMinutos,
                    cita.TipoTratamiento
                );

                _logger.LogInformation("Recordatorio enviado a {Email} para cita {CitaId}", paciente.Email, cita.Id);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al enviar recordatorios de citas");
        }
    }
}