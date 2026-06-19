using OdontoGestPro.Application.DTOs.Adjuntos;

namespace OdontoGestPro.Application.DTOs.Tratamientos;

public class TratamientoDto
{
    public int Id { get; set; }
    public int PacienteId { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public string NotasClinicas { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public DateTime Fecha { get; set; }
    public string DienteAfectado { get; set; } = string.Empty;
    public List<AdjuntoDto> Adjuntos { get; set; } = new();
}