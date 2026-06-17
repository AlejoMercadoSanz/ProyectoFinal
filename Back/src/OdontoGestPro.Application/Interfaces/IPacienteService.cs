using OdontoGestPro.Application.DTOs.Pacientes;

namespace OdontoGestPro.Application.Interfaces;

public interface IPacienteService
{
    Task<List<PacienteDto>> GetAllAsync(string? search = null);
    Task<PacienteDto?> GetByIdAsync(int id);
    Task<PacienteDto> CreateAsync(PacienteRequestDto request);
    Task<bool> UpdateAsync(int id, PacienteRequestDto request);
    Task<bool> DeleteAsync(int id);
}