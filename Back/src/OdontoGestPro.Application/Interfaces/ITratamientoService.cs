using OdontoGestPro.Application.DTOs.Tratamientos;

namespace OdontoGestPro.Application.Interfaces;

public interface ITratamientoService
{
    Task<List<TratamientoDto>> GetByPacienteIdAsync(int pacienteId);
    Task<TratamientoDto?> GetByIdAsync(int id);
    Task<TratamientoDto> CreateAsync(TratamientoRequestDto request);
    Task<bool> UpdateAsync(int id, TratamientoRequestDto request);
    Task<bool> DeleteAsync(int id);
}