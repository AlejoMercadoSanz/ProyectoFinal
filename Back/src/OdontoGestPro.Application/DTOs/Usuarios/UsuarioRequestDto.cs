namespace OdontoGestPro.Application.DTOs.Usuarios;

public class UsuarioRequestDto
{
    public string NombreUsuario { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Rol { get; set; } = "Odontologo";
}