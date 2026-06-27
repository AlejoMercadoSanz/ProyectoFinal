using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OdontoGestPro.Application.DTOs.Gastos;
using OdontoGestPro.Application.Interfaces;

namespace OdontoGestPro.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GastosController : ControllerBase
{
    private readonly IGastoService _gastoService;
    private readonly ICobroService _cobroService;

    public GastosController(IGastoService gastoService, ICobroService cobroService)
    {
        _gastoService = gastoService;
        _cobroService = cobroService;
    }

    [HttpGet]
    public async Task<IActionResult> GetByMes([FromQuery] int anio, [FromQuery] int mes)
    {
        var gastos = await _gastoService.GetByMesAsync(anio, mes);
        return Ok(gastos);
    }

    [HttpGet("resumen")]
    public async Task<IActionResult> GetResumen([FromQuery] int anio, [FromQuery] int mes)
    {
        var gastos = await _gastoService.GetByMesAsync(anio, mes);
        var cobros = await _cobroService.GetByMesAsync(anio, mes);

        var totalIngresos = cobros.Where(c => c.Estado == "Pagado").Sum(c => c.Monto);
        var totalGastos = gastos.Sum(g => g.Monto);

        return Ok(new
        {
            totalIngresos,
            totalGastos,
            balance = totalIngresos - totalGastos,
            anio,
            mes
        });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] GastoRequestDto request)
    {
        var created = await _gastoService.CreateAsync(request);
        return CreatedAtAction(nameof(GetByMes), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] GastoRequestDto request)
    {
        var updated = await _gastoService.UpdateAsync(id, request);
        if (!updated) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _gastoService.DeleteAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}