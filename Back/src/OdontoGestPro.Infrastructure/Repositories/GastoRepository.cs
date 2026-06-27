using Microsoft.EntityFrameworkCore;
using OdontoGestPro.Application.Interfaces;
using OdontoGestPro.Domain.Entities;
using OdontoGestPro.Infrastructure.Persistence;

namespace OdontoGestPro.Infrastructure.Repositories;

public class GastoRepository : IGastoRepository
{
    private readonly OdontoGestProDbContext _context;

    public GastoRepository(OdontoGestProDbContext context)
    {
        _context = context;
    }

    public async Task<List<Gasto>> GetByMesAsync(int anio, int mes)
    {
        return await _context.Gastos
            .Where(g => g.Activo && g.Fecha.Year == anio && g.Fecha.Month == mes)
            .OrderByDescending(g => g.Fecha)
            .ToListAsync();
    }

    public async Task<Gasto?> GetByIdAsync(int id)
    {
        return await _context.Gastos.FirstOrDefaultAsync(g => g.Id == id && g.Activo);
    }

    public async Task<Gasto> CreateAsync(Gasto gasto)
    {
        _context.Gastos.Add(gasto);
        await _context.SaveChangesAsync();
        return gasto;
    }

    public async Task<bool> UpdateAsync(Gasto gasto)
    {
        var existing = await _context.Gastos.FirstOrDefaultAsync(g => g.Id == gasto.Id && g.Activo);
        if (existing is null) return false;
        existing.Descripcion = gasto.Descripcion;
        existing.Categoria = gasto.Categoria;
        existing.Monto = gasto.Monto;
        existing.Fecha = gasto.Fecha;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _context.Gastos.FirstOrDefaultAsync(g => g.Id == id && g.Activo);
        if (existing is null) return false;
        existing.Activo = false;
        await _context.SaveChangesAsync();
        return true;
    }
}