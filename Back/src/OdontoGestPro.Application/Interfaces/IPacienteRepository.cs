using OdontoGestPro.Domain.Entities;

namespace OdontoGestPro.Application.Interfaces;

public interface IPacienteRepository
{
    Task<List<Paciente>> GetAllAsync(string? search = null);
    Task<Paciente?> GetByIdAsync(int id);
    Task<Paciente> CreateAsync(Paciente paciente);
    Task<bool> UpdateAsync(Paciente paciente);
    Task<bool> DeleteAsync(int id);
}