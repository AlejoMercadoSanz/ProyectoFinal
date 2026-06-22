using Microsoft.EntityFrameworkCore;
using OdontoGestPro.Application.Interfaces;
using OdontoGestPro.Domain.Entities;
using OdontoGestPro.Infrastructure.Persistence;

namespace OdontoGestPro.Infrastructure.Repositories;

public class TratamientoRepository : ITratamientoRepository
{
    private readonly OdontoGestProDbContext _context;

    public TratamientoRepository(OdontoGestProDbContext context)
    {
        _context = context;
    }

    public async Task<List<Tratamiento>> GetByPacienteIdAsync(int pacienteId)
    {
        return await _context.Tratamientos
            .Include(t => t.Adjuntos)
            .Where(t => t.PacienteId == pacienteId && t.Activo)
            .OrderByDescending(t => t.Fecha)
            .ToListAsync();
    }

    public async Task<Tratamiento?> GetByIdAsync(int id)
    {
        return await _context.Tratamientos
            .Include(t => t.Adjuntos)
            .FirstOrDefaultAsync(t => t.Id == id && t.Activo);
    }

    public async Task<Tratamiento> CreateAsync(Tratamiento tratamiento)
    {
        _context.Tratamientos.Add(tratamiento);
        await _context.SaveChangesAsync();
        return tratamiento;
    }

    public async Task<bool> UpdateAsync(Tratamiento tratamiento)
    {
        var existing = await _context.Tratamientos
            .FirstOrDefaultAsync(t => t.Id == tratamiento.Id && t.Activo);
        if (existing is null) return false;

        existing.Tipo = tratamiento.Tipo;
        existing.Descripcion = tratamiento.Descripcion;
        existing.NotasClinicas = tratamiento.NotasClinicas;
        existing.Estado = tratamiento.Estado;
        existing.Fecha = tratamiento.Fecha;
        existing.DienteAfectado = tratamiento.DienteAfectado;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _context.Tratamientos
            .FirstOrDefaultAsync(t => t.Id == id && t.Activo);
        if (existing is null) return false;

        existing.Activo = false;
        await _context.SaveChangesAsync();
        return true;
    }
}