using Microsoft.EntityFrameworkCore;
using OdontoGestPro.Application.Interfaces;
using OdontoGestPro.Domain.Entities;
using OdontoGestPro.Infrastructure.Persistence;

namespace OdontoGestPro.Infrastructure.Repositories;

public class PacienteRepository : IPacienteRepository
{
    private readonly OdontoGestProDbContext _context;

    public PacienteRepository(OdontoGestProDbContext context)
    {
        _context = context;
    }

    public async Task<List<Paciente>> GetAllAsync(string? search = null)
    {
        var query = _context.Pacientes.Where(p => p.Activo);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(p =>
                p.Nombre.ToLower().Contains(term) ||
                p.Apellido.ToLower().Contains(term) ||
                p.Dni.Contains(term) ||
                p.Email.ToLower().Contains(term));
        }

        return await query.OrderByDescending(p => p.FechaCreacion).ToListAsync();
    }

    public async Task<Paciente?> GetByIdAsync(int id)
    {
        return await _context.Pacientes.FirstOrDefaultAsync(p => p.Id == id && p.Activo);
    }

    public async Task<Paciente> CreateAsync(Paciente paciente)
    {
        _context.Pacientes.Add(paciente);
        await _context.SaveChangesAsync();
        return paciente;
    }

    public async Task<bool> UpdateAsync(Paciente paciente)
    {
        var existing = await _context.Pacientes.FirstOrDefaultAsync(p => p.Id == paciente.Id && p.Activo);
        if (existing is null) return false;

        existing.Nombre = paciente.Nombre;
        existing.Apellido = paciente.Apellido;
        existing.Dni = paciente.Dni;
        existing.Email = paciente.Email;
        existing.Telefono = paciente.Telefono;
        existing.FechaNacimiento = paciente.FechaNacimiento;
        existing.Direccion = paciente.Direccion;
        existing.Estado = paciente.Estado;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _context.Pacientes.FirstOrDefaultAsync(p => p.Id == id && p.Activo);
        if (existing is null) return false;

        existing.Activo = false;
        await _context.SaveChangesAsync();
        return true;
    }
}