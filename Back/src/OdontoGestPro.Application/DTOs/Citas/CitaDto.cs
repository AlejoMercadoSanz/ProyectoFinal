namespace OdontoGestPro.Application.DTOs.Citas;

public class CitaDto
{
    public int Id { get; set; }
    public int PacienteId { get; set; }
    public string PacienteNombre { get; set; } = string.Empty;
    public string PacienteApellido { get; set; } = string.Empty;
    public DateTime FechaHora { get; set; }
    public int DuracionMinutos { get; set; }
    public string TipoTratamiento { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public string Notas { get; set; } = string.Empty;
}