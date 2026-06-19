namespace OdontoGestPro.Application.DTOs.Adjuntos;

public class AdjuntoDto
{
    public int Id { get; set; }
    public int TratamientoId { get; set; }
    public string NombreArchivo { get; set; } = string.Empty;
    public string RutaArchivo { get; set; } = string.Empty;
    public string TipoArchivo { get; set; } = string.Empty;
    public long TamanoBytes { get; set; }
    public DateTime FechaSubida { get; set; }
}