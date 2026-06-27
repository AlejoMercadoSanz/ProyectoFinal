using OdontoGestPro.Domain.Entities;

namespace OdontoGestPro.Application.Interfaces;

public interface IGastoRepository
{
    Task<List<Gasto>> GetByMesAsync(int anio, int mes);
    Task<Gasto?> GetByIdAsync(int id);
    Task<Gasto> CreateAsync(Gasto gasto);
    Task<bool> UpdateAsync(Gasto gasto);
    Task<bool> DeleteAsync(int id);
}