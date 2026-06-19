namespace OdontoGestPro.Application.DTOs.Citas;

public class CitaRequestDto
{
    public int PacienteId { get; set; }
    public DateTime FechaHora { get; set; }
    public int DuracionMinutos { get; set; } = 30;
    public string TipoTratamiento { get; set; } = string.Empty;
    public string Estado { get; set; } = "Confirmada";
    public string Notas { get; set; } = string.Empty;
}