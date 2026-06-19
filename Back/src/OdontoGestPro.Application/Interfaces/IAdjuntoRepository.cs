using OdontoGestPro.Domain.Entities;

namespace OdontoGestPro.Application.Interfaces;

public interface IAdjuntoRepository
{
    Task<List<Adjunto>> GetByTratamientoIdAsync(int tratamientoId);
    Task<Adjunto> CreateAsync(Adjunto adjunto);
    Task<bool> DeleteAsync(int id);
    Task<Adjunto?> GetByIdAsync(int id);
}