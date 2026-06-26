using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OdontoGestPro.Application.DTOs.Cobros;
using OdontoGestPro.Application.Interfaces;

namespace OdontoGestPro.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CobrosController : ControllerBase
{
    private readonly ICobroService _cobroService;

    public CobrosController(ICobroService cobroService)
    {
        _cobroService = cobroService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var cobros = await _cobroService.GetAllAsync();
        return Ok(cobros);
    }

    [HttpGet("paciente/{pacienteId}")]
    public async Task<IActionResult> GetByPaciente(int pacienteId)
    {
        var cobros = await _cobroService.GetByPacienteIdAsync(pacienteId);
        return Ok(cobros);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var cobro = await _cobroService.GetByIdAsync(id);
        if (cobro is null) return NotFound();
        return Ok(cobro);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CobroRequestDto request)
    {
        var created = await _cobroService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CobroRequestDto request)
    {
        var updated = await _cobroService.UpdateAsync(id, request);
        if (!updated) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _cobroService.DeleteAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}