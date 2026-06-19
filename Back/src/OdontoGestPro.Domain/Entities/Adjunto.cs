namespace OdontoGestPro.Domain.Entities;

public class Adjunto
{
    public int Id { get; set; }
    public int TratamientoId { get; set; }
    public Tratamiento Tratamiento { get; set; } = null!;
    public string NombreArchivo { get; set; } = string.Empty;
    public string RutaArchivo { get; set; } = string.Empty;
    public string TipoArchivo { get; set; } = string.Empty;
    public long TamanoBytes { get; set; }
    public DateTime FechaSubida { get; set; } = DateTime.UtcNow;
}