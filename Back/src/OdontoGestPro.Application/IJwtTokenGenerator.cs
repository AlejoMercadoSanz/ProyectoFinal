using OdontoGestPro.Domain.Entities;

namespace OdontoGestPro.Application.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(Usuario usuario);
}