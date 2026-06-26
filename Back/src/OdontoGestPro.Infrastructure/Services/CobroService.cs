using OdontoGestPro.Application.DTOs.Cobros;
using OdontoGestPro.Application.Interfaces;
using OdontoGestPro.Domain.Entities;

namespace OdontoGestPro.Infrastructure.Services;

public class CobroService : ICobroService
{
    private readonly ICobroRepository _cobroRepository;

    public CobroService(ICobroRepository cobroRepository)
    {
        _cobroRepository = cobroRepository;
    }

    public async Task<List<CobroDto>> GetAllAsync()
    {
        var cobros = await _cobroRepository.GetAllAsync();
        return cobros.Select(MapToDto).ToList();
    }

    public async Task<List<CobroDto>> GetByPacienteIdAsync(int pacienteId)
    {
        var cobros = await _cobroRepository.GetByPacienteIdAsync(pacienteId);
        return cobros.Select(MapToDto).ToList();
    }

    public async Task<CobroDto?> GetByIdAsync(int id)
    {
        var cobro = await _cobroRepository.GetByIdAsync(id);
        return cobro is null ? null : MapToDto(cobro);
    }

    public async Task<CobroDto> CreateAsync(CobroRequestDto request)
    {
        var cobro = new Cobro
        {
            PacienteId = request.PacienteId,
            TratamientoId = request.TratamientoId,
            Concepto = request.Concepto,
            FechaProcedimiento = request.FechaProcedimiento,
            Monto = request.Monto,
            ModoPago = request.ModoPago,
            Estado = request.Estado,
        };

        var created = await _cobroRepository.CreateAsync(cobro);
        return MapToDto(created);
    }

    public async Task<bool> UpdateAsync(int id, CobroRequestDto request)
    {
        var cobro = new Cobro
        {
            Id = id,
            PacienteId = request.PacienteId,
            TratamientoId = request.TratamientoId,
            Concepto = request.Concepto,
            FechaProcedimiento = request.FechaProcedimiento,
            Monto = request.Monto,
            ModoPago = request.ModoPago,
            Estado = request.Estado,
        };

        return await _cobroRepository.UpdateAsync(cobro);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _cobroRepository.DeleteAsync(id);
    }

    private static CobroDto MapToDto(Cobro c) => new()
    {
        Id = c.Id,
        PacienteId = c.PacienteId,
        PacienteNombre = c.Paciente?.Nombre ?? "",
        PacienteApellido = c.Paciente?.Apellido ?? "",
        TratamientoId = c.TratamientoId,
        Concepto = c.Concepto,
        FechaProcedimiento = c.FechaProcedimiento,
        FechaRegistro = c.FechaRegistro,
        Monto = c.Monto,
        ModoPago = c.ModoPago,
        Estado = c.Estado,
    };
}