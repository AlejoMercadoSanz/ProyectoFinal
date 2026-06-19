using OdontoGestPro.Application.DTOs.Citas;
using OdontoGestPro.Application.Interfaces;
using OdontoGestPro.Domain.Entities;

namespace OdontoGestPro.Infrastructure.Services;

public class CitaService : ICitaService
{
    private readonly ICitaRepository _citaRepository;

    public CitaService(ICitaRepository citaRepository)
    {
        _citaRepository = citaRepository;
    }

    public async Task<List<CitaDto>> GetByRangoAsync(DateTime desde, DateTime hasta)
    {
        var citas = await _citaRepository.GetByRangoAsync(desde, hasta);
        return citas.Select(MapToDto).ToList();
    }

    public async Task<CitaDto?> GetByIdAsync(int id)
    {
        var cita = await _citaRepository.GetByIdAsync(id);
        return cita is null ? null : MapToDto(cita);
    }

    public async Task<CitaDto> CreateAsync(CitaRequestDto request)
    {
        var cita = new Cita
        {
            PacienteId = request.PacienteId,
            FechaHora = request.FechaHora,
            DuracionMinutos = request.DuracionMinutos,
            TipoTratamiento = request.TipoTratamiento,
            Estado = request.Estado,
            Notas = request.Notas,
        };

        var created = await _citaRepository.CreateAsync(cita);
        return MapToDto(created);
    }

    public async Task<bool> UpdateAsync(int id, CitaRequestDto request)
    {
        var cita = new Cita
        {
            Id = id,
            PacienteId = request.PacienteId,
            FechaHora = request.FechaHora,
            DuracionMinutos = request.DuracionMinutos,
            TipoTratamiento = request.TipoTratamiento,
            Estado = request.Estado,
            Notas = request.Notas,
        };

        return await _citaRepository.UpdateAsync(cita);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _citaRepository.DeleteAsync(id);
    }

    private static CitaDto MapToDto(Cita c)
    {
        return new CitaDto
        {
            Id = c.Id,
            PacienteId = c.PacienteId,
            PacienteNombre = c.Paciente?.Nombre ?? "",
            PacienteApellido = c.Paciente?.Apellido ?? "",
            FechaHora = c.FechaHora,
            DuracionMinutos = c.DuracionMinutos,
            TipoTratamiento = c.TipoTratamiento,
            Estado = c.Estado,
            Notas = c.Notas,
        };
    }
}