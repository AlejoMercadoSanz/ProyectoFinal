using OdontoGestPro.Application.DTOs.Tratamientos;
using OdontoGestPro.Application.Interfaces;
using OdontoGestPro.Domain.Entities;

namespace OdontoGestPro.Infrastructure.Services;

public class TratamientoService : ITratamientoService
{
    private readonly ITratamientoRepository _tratamientoRepository;

    public TratamientoService(ITratamientoRepository tratamientoRepository)
    {
        _tratamientoRepository = tratamientoRepository;
    }

    public async Task<List<TratamientoDto>> GetByPacienteIdAsync(int pacienteId)
    {
        var tratamientos = await _tratamientoRepository.GetByPacienteIdAsync(pacienteId);
        return tratamientos.Select(MapToDto).ToList();
    }

    public async Task<TratamientoDto?> GetByIdAsync(int id)
    {
        var tratamiento = await _tratamientoRepository.GetByIdAsync(id);
        return tratamiento is null ? null : MapToDto(tratamiento);
    }

    public async Task<TratamientoDto> CreateAsync(TratamientoRequestDto request)
    {
        var tratamiento = new Tratamiento
        {
            PacienteId = request.PacienteId,
            Tipo = request.Tipo,
            Descripcion = request.Descripcion,
            NotasClinicas = request.NotasClinicas,
            Estado = request.Estado,
            Fecha = request.Fecha,
            DienteAfectado = request.DienteAfectado,
        };

        var created = await _tratamientoRepository.CreateAsync(tratamiento);
        return MapToDto(created);
    }

    public async Task<bool> UpdateAsync(int id, TratamientoRequestDto request)
    {
        var tratamiento = new Tratamiento
        {
            Id = id,
            PacienteId = request.PacienteId,
            Tipo = request.Tipo,
            Descripcion = request.Descripcion,
            NotasClinicas = request.NotasClinicas,
            Estado = request.Estado,
            Fecha = request.Fecha,
            DienteAfectado = request.DienteAfectado,
        };

        return await _tratamientoRepository.UpdateAsync(tratamiento);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _tratamientoRepository.DeleteAsync(id);
    }

    private static TratamientoDto MapToDto(Tratamiento t)
    {
        return new TratamientoDto
        {
            Id = t.Id,
            PacienteId = t.PacienteId,
            Tipo = t.Tipo,
            Descripcion = t.Descripcion,
            NotasClinicas = t.NotasClinicas,
            Estado = t.Estado,
            Fecha = t.Fecha,
            DienteAfectado = t.DienteAfectado,
            Adjuntos = t.Adjuntos?.Select(a => new Application.DTOs.Adjuntos.AdjuntoDto
            {
                Id = a.Id,
                TratamientoId = a.TratamientoId,
                NombreArchivo = a.NombreArchivo,
                RutaArchivo = a.RutaArchivo,
                TipoArchivo = a.TipoArchivo,
                TamanoBytes = a.TamanoBytes,
                FechaSubida = a.FechaSubida,
            }).ToList() ?? new(),
        };
    }
}