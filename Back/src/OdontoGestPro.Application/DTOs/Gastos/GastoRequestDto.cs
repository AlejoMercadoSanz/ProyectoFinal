namespace OdontoGestPro.Application.DTOs.Gastos;

public class GastoRequestDto
{
    public string Descripcion { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public decimal Monto { get; set; }
    public DateTime Fecha { get; set; }
}