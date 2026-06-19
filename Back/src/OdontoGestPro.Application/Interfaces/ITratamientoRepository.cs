using OdontoGestPro.Domain.Entities;

namespace OdontoGestPro.Application.Interfaces;

public interface ITratamientoRepository
{
    Task<List<Tratamiento>> GetByPacienteIdAsync(int pacienteId);
    Task<Tratamiento?> GetByIdAsync(int id);
    Task<Tratamiento> CreateAsync(Tratamiento tratamiento);
    Task<bool> UpdateAsync(Tratamiento tratamiento);
    Task<bool> DeleteAsync(int id);
}