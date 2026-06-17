using Microsoft.EntityFrameworkCore;
using OdontoGestPro.Domain.Entities;

namespace OdontoGestPro.Infrastructure.Persistence;

public class OdontoGestProDbContext : DbContext
{
    public OdontoGestProDbContext(DbContextOptions<OdontoGestProDbContext> options)
        : base(options)
    {
    }

    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Paciente> Pacientes => Set<Paciente>();
}