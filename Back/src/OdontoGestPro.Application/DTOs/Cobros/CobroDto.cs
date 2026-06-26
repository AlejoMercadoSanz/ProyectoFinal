namespace OdontoGestPro.Application.DTOs.Cobros;

public class CobroDto
{
    public int Id { get; set; }
    public int PacienteId { get; set; }
    public string PacienteNombre { get; set; } = string.Empty;
    public string PacienteApellido { get; set; } = string.Empty;
    public int? TratamientoId { get; set; }
    public string Concepto { get; set; } = string.Empty;
    public DateTime FechaProcedimiento { get; set; }
    public DateTime FechaRegistro { get; set; }
    public decimal Monto { get; set; }
    public string ModoPago { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
}