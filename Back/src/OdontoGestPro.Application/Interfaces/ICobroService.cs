using OdontoGestPro.Application.DTOs.Cobros;

namespace OdontoGestPro.Application.Interfaces;

public interface ICobroService
{
    Task<List<CobroDto>> GetByPacienteIdAsync(int pacienteId);
    Task<List<CobroDto>> GetAllAsync();
    Task<CobroDto?> GetByIdAsync(int id);
    Task<CobroDto> CreateAsync(CobroRequestDto request);
    Task<bool> UpdateAsync(int id, CobroRequestDto request);
    Task<bool> DeleteAsync(int id);
}