using OdontoGestPro.Application.DTOs.Gastos;
using OdontoGestPro.Application.Interfaces;
using OdontoGestPro.Domain.Entities;

namespace OdontoGestPro.Infrastructure.Services;

public class GastoService : IGastoService
{
    private readonly IGastoRepository _gastoRepository;

    public GastoService(IGastoRepository gastoRepository)
    {
        _gastoRepository = gastoRepository;
    }

    public async Task<List<GastoDto>> GetByMesAsync(int anio, int mes)
    {
        var gastos = await _gastoRepository.GetByMesAsync(anio, mes);
        return gastos.Select(MapToDto).ToList();
    }

    public async Task<GastoDto?> GetByIdAsync(int id)
    {
        var gasto = await _gastoRepository.GetByIdAsync(id);
        return gasto is null ? null : MapToDto(gasto);
    }

    public async Task<GastoDto> CreateAsync(GastoRequestDto request)
    {
        var gasto = new Gasto
        {
            Descripcion = request.Descripcion,
            Categoria = request.Categoria,
            Monto = request.Monto,
            Fecha = request.Fecha,
        };
        var created = await _gastoRepository.CreateAsync(gasto);
        return MapToDto(created);
    }

    public async Task<bool> UpdateAsync(int id, GastoRequestDto request)
    {
        var gasto = new Gasto
        {
            Id = id,
            Descripcion = request.Descripcion,
            Categoria = request.Categoria,
            Monto = request.Monto,
            Fecha = request.Fecha,
        };
        return await _gastoRepository.UpdateAsync(gasto);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _gastoRepository.DeleteAsync(id);
    }

    private static GastoDto MapToDto(Gasto g) => new()
    {
        Id = g.Id,
        Descripcion = g.Descripcion,
        Categoria = g.Categoria,
        Monto = g.Monto,
        Fecha = g.Fecha,
    };
}