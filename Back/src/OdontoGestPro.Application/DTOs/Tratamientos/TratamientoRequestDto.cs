namespace OdontoGestPro.Application.DTOs.Tratamientos;

public class TratamientoRequestDto
{
    public int PacienteId { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public string NotasClinicas { get; set; } = string.Empty;
    public string Estado { get; set; } = "Pendiente";
    public DateTime Fecha { get; set; }
    public string DienteAfectado { get; set; } = string.Empty;
}