using OdontoGestPro.Domain.Entities;

namespace OdontoGestPro.Application.Interfaces;

public interface IUsuarioRepository
{
    Task<Usuario?> GetByNombreUsuarioAsync(string nombreUsuario);
}