namespace OdontoGestPro.Application.Interfaces;

public interface IEmailService
{
    Task SendConfirmacionCitaAsync(string destinatario, string nombrePaciente, DateTime fechaHora, int duracionMinutos, string tipoTratamiento);
    Task SendModificacionCitaAsync(string destinatario, string nombrePaciente, DateTime fechaHora, int duracionMinutos, string tipoTratamiento);
    Task SendRecordatorioCitaAsync(string destinatario, string nombrePaciente, DateTime fechaHora, int duracionMinutos, string tipoTratamiento);
}