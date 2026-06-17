using OdontoGestPro.Application.DTOs.Auth;
using OdontoGestPro.Application.Interfaces;

namespace OdontoGestPro.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthService(
        IUsuarioRepository usuarioRepository,
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator jwtTokenGenerator)
    {
        _usuarioRepository = usuarioRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request)
    {
        var usuario = await _usuarioRepository.GetByNombreUsuarioAsync(request.NombreUsuario);

        if (usuario is null)
            return null;

        var passwordValida = _passwordHasher.Verify(request.Password, usuario.PasswordHash);

        if (!passwordValida)
            return null;

        var token = _jwtTokenGenerator.GenerateToken(usuario);

        return new LoginResponseDto
        {
            Token = token,
            NombreUsuario = usuario.NombreUsuario,
            Rol = usuario.Rol
        };
    }
}