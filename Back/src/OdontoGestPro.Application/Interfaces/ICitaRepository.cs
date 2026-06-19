using OdontoGestPro.Domain.Entities;

namespace OdontoGestPro.Application.Interfaces;

public interface ICitaRepository
{
    Task<List<Cita>> GetByRangoAsync(DateTime desde, DateTime hasta);
    Task<Cita?> GetByIdAsync(int id);
    Task<Cita> CreateAsync(Cita cita);
    Task<bool> UpdateAsync(Cita cita);
    Task<bool> DeleteAsync(int id);
}