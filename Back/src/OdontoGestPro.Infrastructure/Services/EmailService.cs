using Microsoft.Extensions.Options;
using OdontoGestPro.Application.Interfaces;
using OdontoGestPro.Application.Settings;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace OdontoGestPro.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly EmailSettings _settings;

    public EmailService(IOptions<EmailSettings> settings)
    {
        _settings = settings.Value;
    }

    private async Task SendEmailAsync(string destinatario, string nombrePaciente, string subject, string htmlContent)
    {
        var client = new SendGridClient(_settings.SendGridApiKey);
        var from = new EmailAddress(_settings.SenderEmail, _settings.SenderName);
        var to = new EmailAddress(destinatario, nombrePaciente);
        var msg = MailHelper.CreateSingleEmail(from, to, subject, string.Empty, htmlContent);
        await client.SendEmailAsync(msg);
    }

    public async Task SendConfirmacionCitaAsync(string destinatario, string nombrePaciente, DateTime fechaHora, int duracionMinutos, string tipoTratamiento)
    {
        var subject = "✅ Confirmación de tu turno - OdontoGest Pro";
        var html = BuildEmailHtml(
            nombrePaciente,
            "Tu turno ha sido confirmado",
            fechaHora,
            duracionMinutos,
            tipoTratamiento,
            "#16a34a",
            "Gracias por elegir nuestra clínica. Te esperamos puntualmente."
        );
        await SendEmailAsync(destinatario, nombrePaciente, subject, html);
    }

    public async Task SendModificacionCitaAsync(string destinatario, string nombrePaciente, DateTime fechaHora, int duracionMinutos, string tipoTratamiento)
    {
        var subject = "📅 Tu turno fue modificado - OdontoGest Pro";
        var html = BuildEmailHtml(
            nombrePaciente,
            "Tu turno ha sido modificado",
            fechaHora,
            duracionMinutos,
            tipoTratamiento,
            "#2563eb",
            "Si tenés alguna consulta, no dudes en contactarnos."
        );
        await SendEmailAsync(destinatario, nombrePaciente, subject, html);
    }

    public async Task SendRecordatorioCitaAsync(string destinatario, string nombrePaciente, DateTime fechaHora, int duracionMinutos, string tipoTratamiento)
    {
        var subject = "🔔 Recordatorio de turno para mañana - OdontoGest Pro";
        var html = BuildEmailHtml(
            nombrePaciente,
            "Recordatorio: tenés un turno mañana",
            fechaHora,
            duracionMinutos,
            tipoTratamiento,
            "#d97706",
            "Por favor, si no podés asistir, avisanos con anticipación."
        );
        await SendEmailAsync(destinatario, nombrePaciente, subject, html);
    }

    private string BuildEmailHtml(string nombre, string titulo, DateTime fechaHora, int duracion, string tipo, string color, string mensaje)
    {
        var fecha = fechaHora.ToString("dddd dd 'de' MMMM 'de' yyyy", new System.Globalization.CultureInfo("es-AR"));
        var hora = fechaHora.ToString("HH:mm");

        return $"""
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background-color:#f5f7fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
          <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
            <div style="background:{color};padding:32px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">{titulo}</h1>
            </div>
            <div style="padding:32px 40px;">
              <p style="margin:0 0 24px;color:#475569;font-size:15px;">Hola <strong>{nombre}</strong>,</p>
              <div style="background:#f8fafc;border-radius:8px;padding:20px 24px;margin-bottom:24px;border-left:4px solid {color};">
                <p style="margin:0 0 8px;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Detalles del turno</p>
                <p style="margin:0 0 6px;color:#1e293b;font-size:16px;font-weight:700;">📅 {fecha}</p>
                <p style="margin:0 0 6px;color:#1e293b;font-size:16px;font-weight:700;">🕐 {hora} hs · {duracion} min</p>
                <p style="margin:0;color:#475569;font-size:14px;">🦷 {tipo}</p>
              </div>
              <p style="margin:0 0 32px;color:#64748b;font-size:14px;">{mensaje}</p>
              <hr style="border:none;border-top:1px solid #e5e9f0;margin:0 0 24px;" />
              <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">OdontoGest Pro · Sistema de Gestión Odontológica</p>
            </div>
          </div>
        </body>
        </html>
        """;
    }
}