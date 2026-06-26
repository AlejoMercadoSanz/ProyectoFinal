using Microsoft.EntityFrameworkCore;
using OdontoGestPro.Application.Interfaces;
using OdontoGestPro.Domain.Entities;
using OdontoGestPro.Infrastructure.Persistence;

namespace OdontoGestPro.Infrastructure.Repositories;

public class CobroRepository : ICobroRepository
{
    private readonly OdontoGestProDbContext _context;

    public CobroRepository(OdontoGestProDbContext context)
    {
        _context = context;
    }

    public async Task<List<Cobro>> GetAllAsync()
    {
        return await _context.Cobros
            .Include(c => c.Paciente)
            .Include(c => c.Tratamiento)
            .Where(c => c.Activo)
            .OrderByDescending(c => c.FechaRegistro)
            .ToListAsync();
    }

    public async Task<List<Cobro>> GetByPacienteIdAsync(int pacienteId)
    {
        return await _context.Cobros
            .Include(c => c.Paciente)
            .Include(c => c.Tratamiento)
            .Where(c => c.PacienteId == pacienteId && c.Activo)
            .OrderByDescending(c => c.FechaRegistro)
            .ToListAsync();
    }

    public async Task<Cobro?> GetByIdAsync(int id)
    {
        return await _context.Cobros
            .Include(c => c.Paciente)
            .Include(c => c.Tratamiento)
            .FirstOrDefaultAsync(c => c.Id == id && c.Activo);
    }

    public async Task<Cobro> CreateAsync(Cobro cobro)
    {
        _context.Cobros.Add(cobro);
        await _context.SaveChangesAsync();
        return await _context.Cobros
            .Include(c => c.Paciente)
            .Include(c => c.Tratamiento)
            .FirstAsync(c => c.Id == cobro.Id);
    }

    public async Task<bool> UpdateAsync(Cobro cobro)
    {
        var existing = await _context.Cobros
            .FirstOrDefaultAsync(c => c.Id == cobro.Id && c.Activo);
        if (existing is null) return false;

        existing.PacienteId = cobro.PacienteId;
        existing.TratamientoId = cobro.TratamientoId;
        existing.Concepto = cobro.Concepto;
        existing.FechaProcedimiento = cobro.FechaProcedimiento;
        existing.Monto = cobro.Monto;
        existing.ModoPago = cobro.ModoPago;
        existing.Estado = cobro.Estado;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _context.Cobros
            .FirstOrDefaultAsync(c => c.Id == id && c.Activo);
        if (existing is null) return false;

        existing.Activo = false;
        await _context.SaveChangesAsync();
        return true;
    }
}