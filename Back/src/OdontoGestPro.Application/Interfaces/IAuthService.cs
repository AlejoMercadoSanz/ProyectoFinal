using OdontoGestPro.Application.DTOs.Auth;

namespace OdontoGestPro.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);
}