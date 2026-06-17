using OdontoGestPro.Application.DTOs.Pacientes;
using OdontoGestPro.Application.Interfaces;
using OdontoGestPro.Domain.Entities;

namespace OdontoGestPro.Infrastructure.Services;

public class PacienteService : IPacienteService
{
    private readonly IPacienteRepository _pacienteRepository;

    public PacienteService(IPacienteRepository pacienteRepository)
    {
        _pacienteRepository = pacienteRepository;
    }

    public async Task<List<PacienteDto>> GetAllAsync(string? search = null)
    {
        var pacientes = await _pacienteRepository.GetAllAsync(search);
        return pacientes.Select(MapToDto).ToList();
    }

    public async Task<PacienteDto?> GetByIdAsync(int id)
    {
        var paciente = await _pacienteRepository.GetByIdAsync(id);
        return paciente is null ? null : MapToDto(paciente);
    }

    public async Task<PacienteDto> CreateAsync(PacienteRequestDto request)
    {
        var paciente = new Paciente
        {
            Nombre = request.Nombre,
            Apellido = request.Apellido,
            Dni = request.Dni,
            Email = request.Email,
            Telefono = request.Telefono,
            FechaNacimiento = request.FechaNacimiento,
            Direccion = request.Direccion,
            Estado = request.Estado,
        };

        var created = await _pacienteRepository.CreateAsync(paciente);
        return MapToDto(created);
    }

    public async Task<bool> UpdateAsync(int id, PacienteRequestDto request)
    {
        var paciente = new Paciente
        {
            Id = id,
            Nombre = request.Nombre,
            Apellido = request.Apellido,
            Dni = request.Dni,
            Email = request.Email,
            Telefono = request.Telefono,
            FechaNacimiento = request.FechaNacimiento,
            Direccion = request.Direccion,
            Estado = request.Estado,
        };

        return await _pacienteRepository.UpdateAsync(paciente);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _pacienteRepository.DeleteAsync(id);
    }

    private static PacienteDto MapToDto(Paciente paciente)
    {
        return new PacienteDto
        {
            Id = paciente.Id,
            Nombre = paciente.Nombre,
            Apellido = paciente.Apellido,
            Dni = paciente.Dni,
            Email = paciente.Email,
            Telefono = paciente.Telefono,
            FechaNacimiento = paciente.FechaNacimiento,
            Direccion = paciente.Direccion,
            Estado = paciente.Estado,
        };
    }
}