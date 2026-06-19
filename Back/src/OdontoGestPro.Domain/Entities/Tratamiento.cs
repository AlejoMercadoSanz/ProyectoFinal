namespace OdontoGestPro.Domain.Entities;

public class Tratamiento
{
    public int Id { get; set; }
    public int PacienteId { get; set; }
    public Paciente Paciente { get; set; } = null!;
    public string Tipo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public string NotasClinicas { get; set; } = string.Empty;
    public string Estado { get; set; } = "Pendiente";
    public DateTime Fecha { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    public string DienteAfectado { get; set; } = string.Empty;
    public ICollection<Adjunto> Adjuntos { get; set; } = new List<Adjunto>();
}