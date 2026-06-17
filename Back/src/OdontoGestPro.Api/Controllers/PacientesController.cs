using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OdontoGestPro.Application.DTOs.Pacientes;
using OdontoGestPro.Application.Interfaces;

namespace OdontoGestPro.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PacientesController : ControllerBase
{
    private readonly IPacienteService _pacienteService;

    public PacientesController(IPacienteService pacienteService)
    {
        _pacienteService = pacienteService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search = null)
    {
        var pacientes = await _pacienteService.GetAllAsync(search);
        return Ok(pacientes);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var paciente = await _pacienteService.GetByIdAsync(id);
        if (paciente is null) return NotFound();
        return Ok(paciente);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PacienteRequestDto request)
    {
        var created = await _pacienteService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] PacienteRequestDto request)
    {
        var updated = await _pacienteService.UpdateAsync(id, request);
        if (!updated) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _pacienteService.DeleteAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}