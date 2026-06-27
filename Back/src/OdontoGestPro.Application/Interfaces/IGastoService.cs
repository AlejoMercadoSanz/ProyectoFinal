using OdontoGestPro.Application.DTOs.Gastos;

namespace OdontoGestPro.Application.Interfaces;

public interface IGastoService
{
    Task<List<GastoDto>> GetByMesAsync(int anio, int mes);
    Task<GastoDto?> GetByIdAsync(int id);
    Task<GastoDto> CreateAsync(GastoRequestDto request);
    Task<bool> UpdateAsync(int id, GastoRequestDto request);
    Task<bool> DeleteAsync(int id);
}