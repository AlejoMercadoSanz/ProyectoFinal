using OdontoGestPro.Domain.Entities;

namespace OdontoGestPro.Application.Interfaces;

public interface ICobroRepository
{
    Task<List<Cobro>> GetByPacienteIdAsync(int pacienteId);
    Task<List<Cobro>> GetAllAsync();
    Task<Cobro?> GetByIdAsync(int id);
    Task<Cobro> CreateAsync(Cobro cobro);
    Task<bool> UpdateAsync(Cobro cobro);
    Task<bool> DeleteAsync(int id);
}