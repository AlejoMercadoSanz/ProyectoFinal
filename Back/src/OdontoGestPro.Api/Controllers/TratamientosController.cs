using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OdontoGestPro.Application.DTOs.Tratamientos;
using OdontoGestPro.Application.Interfaces;

namespace OdontoGestPro.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TratamientosController : ControllerBase
{
    private readonly ITratamientoService _tratamientoService;

    public TratamientosController(ITratamientoService tratamientoService)
    {
        _tratamientoService = tratamientoService;
    }

    [HttpGet("paciente/{pacienteId}")]
    public async Task<IActionResult> GetByPaciente(int pacienteId)
    {
        var tratamientos = await _tratamientoService.GetByPacienteIdAsync(pacienteId);
        return Ok(tratamientos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var tratamiento = await _tratamientoService.GetByIdAsync(id);
        if (tratamiento is null) return NotFound();
        return Ok(tratamiento);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TratamientoRequestDto request)
    {
        var created = await _tratamientoService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] TratamientoRequestDto request)
    {
        var updated = await _tratamientoService.UpdateAsync(id, request);
        if (!updated) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _tratamientoService.DeleteAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}