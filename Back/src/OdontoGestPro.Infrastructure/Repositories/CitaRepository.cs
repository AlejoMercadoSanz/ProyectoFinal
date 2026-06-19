using Microsoft.EntityFrameworkCore;
using OdontoGestPro.Application.Interfaces;
using OdontoGestPro.Domain.Entities;
using OdontoGestPro.Infrastructure.Persistence;

namespace OdontoGestPro.Infrastructure.Repositories;

public class CitaRepository : ICitaRepository
{
    private readonly OdontoGestProDbContext _context;

    public CitaRepository(OdontoGestProDbContext context)
    {
        _context = context;
    }

    public async Task<List<Cita>> GetByRangoAsync(DateTime desde, DateTime hasta)
    {
        return await _context.Citas
            .Include(c => c.Paciente)
            .Where(c => c.Activo && c.FechaHora >= desde && c.FechaHora <= hasta)
            .OrderBy(c => c.FechaHora)
            .ToListAsync();
    }

    public async Task<Cita?> GetByIdAsync(int id)
    {
        return await _context.Citas
            .Include(c => c.Paciente)
            .FirstOrDefaultAsync(c => c.Id == id && c.Activo);
    }

    public async Task<Cita> CreateAsync(Cita cita)
    {
        _context.Citas.Add(cita);
        await _context.SaveChangesAsync();

        // Recargar con el paciente incluido para el mapeo a DTO
        return await _context.Citas
            .Include(c => c.Paciente)
            .FirstAsync(c => c.Id == cita.Id);
    }

    public async Task<bool> UpdateAsync(Cita cita)
    {
        var existing = await _context.Citas.FirstOrDefaultAsync(c => c.Id == cita.Id && c.Activo);
        if (existing is null) return false;

        existing.PacienteId = cita.PacienteId;
        existing.FechaHora = cita.FechaHora;
        existing.DuracionMinutos = cita.DuracionMinutos;
        existing.TipoTratamiento = cita.TipoTratamiento;
        existing.Estado = cita.Estado;
        existing.Notas = cita.Notas;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _context.Citas.FirstOrDefaultAsync(c => c.Id == id && c.Activo);
        if (existing is null) return false;

        existing.Activo = false;
        await _context.SaveChangesAsync();
        return true;
    }
}