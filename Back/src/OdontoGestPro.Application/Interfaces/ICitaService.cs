using OdontoGestPro.Application.DTOs.Citas;

namespace OdontoGestPro.Application.Interfaces;

public interface ICitaService
{
    Task<List<CitaDto>> GetByRangoAsync(DateTime desde, DateTime hasta);
    Task<CitaDto?> GetByIdAsync(int id);
    Task<CitaDto> CreateAsync(CitaRequestDto request);
    Task<bool> UpdateAsync(int id, CitaRequestDto request);
    Task<bool> DeleteAsync(int id);
}