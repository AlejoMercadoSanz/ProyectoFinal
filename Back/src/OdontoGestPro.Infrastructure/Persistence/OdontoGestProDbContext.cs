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
    public DbSet<Tratamiento> Tratamientos => Set<Tratamiento>();
    public DbSet<Adjunto> Adjuntos => Set<Adjunto>();
    public DbSet<Cita> Citas => Set<Cita>();
    public DbSet<Cobro> Cobros => Set<Cobro>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cobro>()
            .Property(c => c.Monto)
            .HasPrecision(18, 2);
    }
}