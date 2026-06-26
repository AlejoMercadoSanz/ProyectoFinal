namespace OdontoGestPro.Domain.Entities;

public class Cobro
{
    public int Id { get; set; }
    public int PacienteId { get; set; }
    public Paciente Paciente { get; set; } = null!;
    public int? TratamientoId { get; set; }
    public Tratamiento? Tratamiento { get; set; }
    public DateTime FechaProcedimiento { get; set; }
    public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;
    public decimal Monto { get; set; }
    public string ModoPago { get; set; } = "Efectivo";
    public string Estado { get; set; } = "Pendiente";
    public string Concepto { get; set; } = string.Empty;
    public bool Activo { get; set; } = true;
}