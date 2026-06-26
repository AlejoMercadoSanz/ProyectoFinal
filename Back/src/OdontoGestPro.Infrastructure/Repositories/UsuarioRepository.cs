using Microsoft.EntityFrameworkCore;
using OdontoGestPro.Application.Interfaces;
using OdontoGestPro.Domain.Entities;
using OdontoGestPro.Infrastructure.Persistence;

namespace OdontoGestPro.Infrastructure.Repositories;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly OdontoGestProDbContext _context;

    public UsuarioRepository(OdontoGestProDbContext context)
    {
        _context = context;
    }

    public async Task<Usuario?> GetByNombreUsuarioAsync(string nombreUsuario)
    {
        return await _context.Usuarios
            .FirstOrDefaultAsync(u => u.NombreUsuario == nombreUsuario && u.Activo);
    }

    public async Task<List<Usuario>> GetAllAsync()
    {
        return await _context.Usuarios
            .Where(u => u.Activo)
            .OrderBy(u => u.NombreUsuario)
            .ToListAsync();
    }

    public async Task<Usuario?> GetByIdAsync(int id)
    {
        return await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Id == id && u.Activo);
    }

    public async Task<Usuario> CreateAsync(Usuario usuario)
    {
        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();
        return usuario;
    }

    public async Task<bool> UpdateAsync(Usuario usuario)
    {
        var existing = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Id == usuario.Id && u.Activo);
        if (existing is null) return false;

        existing.NombreUsuario = usuario.NombreUsuario;
        existing.Email = usuario.Email;
        existing.Rol = usuario.Rol;
        if (!string.IsNullOrEmpty(usuario.PasswordHash))
            existing.PasswordHash = usuario.PasswordHash;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Id == id && u.Activo);
        if (existing is null) return false;

        existing.Activo = false;
        await _context.SaveChangesAsync();
        return true;
    }
}