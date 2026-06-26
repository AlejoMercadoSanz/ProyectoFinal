namespace OdontoGestPro.Application.DTOs.Cobros;

public class CobroRequestDto
{
    public int PacienteId { get; set; }
    public int? TratamientoId { get; set; }
    public string Concepto { get; set; } = string.Empty;
    public DateTime FechaProcedimiento { get; set; }
    public decimal Monto { get; set; }
    public string ModoPago { get; set; } = "Efectivo";
    public string Estado { get; set; } = "Pendiente";
}