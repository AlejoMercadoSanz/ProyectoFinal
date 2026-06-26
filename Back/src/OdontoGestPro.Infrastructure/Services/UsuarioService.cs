using OdontoGestPro.Application.DTOs.Usuarios;
using OdontoGestPro.Application.Interfaces;
using OdontoGestPro.Domain.Entities;

namespace OdontoGestPro.Infrastructure.Services;

public class UsuarioService : IUsuarioService
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IPasswordHasher _passwordHasher;

    public UsuarioService(IUsuarioRepository usuarioRepository, IPasswordHasher passwordHasher)
    {
        _usuarioRepository = usuarioRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<List<UsuarioDto>> GetAllAsync()
    {
        var usuarios = await _usuarioRepository.GetAllAsync();
        return usuarios.Select(MapToDto).ToList();
    }

    public async Task<UsuarioDto?> GetByIdAsync(int id)
    {
        var usuario = await _usuarioRepository.GetByIdAsync(id);
        return usuario is null ? null : MapToDto(usuario);
    }

    public async Task<UsuarioDto> CreateAsync(UsuarioRequestDto request)
    {
        var usuario = new Usuario
        {
            NombreUsuario = request.NombreUsuario,
            Email = request.Email,
            PasswordHash = _passwordHasher.Hash(request.Password),
            Rol = request.Rol,
            Activo = true,
        };

        var created = await _usuarioRepository.CreateAsync(usuario);
        return MapToDto(created);
    }

    public async Task<bool> UpdateAsync(int id, UsuarioRequestDto request)
    {
        var usuario = new Usuario
        {
            Id = id,
            NombreUsuario = request.NombreUsuario,
            Email = request.Email,
            Rol = request.Rol,
            PasswordHash = string.IsNullOrEmpty(request.Password)
                ? string.Empty
                : _passwordHasher.Hash(request.Password),
        };

        return await _usuarioRepository.UpdateAsync(usuario);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _usuarioRepository.DeleteAsync(id);
    }

    private static UsuarioDto MapToDto(Usuario u) => new()
    {
        Id = u.Id,
        NombreUsuario = u.NombreUsuario,
        Email = u.Email,
        Rol = u.Rol,
        Activo = u.Activo,
    };
}