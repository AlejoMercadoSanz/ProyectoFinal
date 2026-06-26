using OdontoGestPro.Application.DTOs.Usuarios;

namespace OdontoGestPro.Application.Interfaces;

public interface IUsuarioService
{
    Task<List<UsuarioDto>> GetAllAsync();
    Task<UsuarioDto?> GetByIdAsync(int id);
    Task<UsuarioDto> CreateAsync(UsuarioRequestDto request);
    Task<bool> UpdateAsync(int id, UsuarioRequestDto request);
    Task<bool> DeleteAsync(int id);
}