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
}