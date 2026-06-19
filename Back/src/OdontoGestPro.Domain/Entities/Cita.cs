namespace OdontoGestPro.Domain.Entities;

public class Cita
{
    public int Id { get; set; }
    public int PacienteId { get; set; }
    public Paciente Paciente { get; set; } = null!;
    public DateTime FechaHora { get; set; }
    public int DuracionMinutos { get; set; } = 30;
    public string TipoTratamiento { get; set; } = string.Empty;
    public string Estado { get; set; } = "Confirmada";
    public string Notas { get; set; } = string.Empty;
    public bool Activo { get; set; } = true;
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
}