using Microsoft.EntityFrameworkCore;
using OdontoGestPro.Application.Interfaces;
using OdontoGestPro.Domain.Entities;
using OdontoGestPro.Infrastructure.Persistence;

namespace OdontoGestPro.Infrastructure.Repositories;

public class AdjuntoRepository : IAdjuntoRepository
{
    private readonly OdontoGestProDbContext _context;

    public AdjuntoRepository(OdontoGestProDbContext context)
    {
        _context = context;
    }

    public async Task<List<Adjunto>> GetByTratamientoIdAsync(int tratamientoId)
    {
        return await _context.Adjuntos
            .Where(a => a.TratamientoId == tratamientoId)
            .OrderByDescending(a => a.FechaSubida)
            .ToListAsync();
    }

    public async Task<Adjunto?> GetByIdAsync(int id)
    {
        return await _context.Adjuntos.FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<Adjunto> CreateAsync(Adjunto adjunto)
    {
        _context.Adjuntos.Add(adjunto);
        await _context.SaveChangesAsync();
        return adjunto;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var adjunto = await _context.Adjuntos.FirstOrDefaultAsync(a => a.Id == id);
        if (adjunto is null) return false;
        _context.Adjuntos.Remove(adjunto);
        await _context.SaveChangesAsync();
        return true;
    }
}