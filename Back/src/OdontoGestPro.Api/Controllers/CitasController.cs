using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OdontoGestPro.Application.DTOs.Citas;
using OdontoGestPro.Application.Interfaces;

namespace OdontoGestPro.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CitasController : ControllerBase
{
    private readonly ICitaService _citaService;

    public CitasController(ICitaService citaService)
    {
        _citaService = citaService;
    }

    [HttpGet]
    public async Task<IActionResult> GetByRango([FromQuery] DateTime desde, [FromQuery] DateTime hasta)
    {
        var citas = await _citaService.GetByRangoAsync(desde, hasta);
        return Ok(citas);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var cita = await _citaService.GetByIdAsync(id);
        if (cita is null) return NotFound();
        return Ok(cita);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CitaRequestDto request)
    {
        var created = await _citaService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CitaRequestDto request)
    {
        var updated = await _citaService.UpdateAsync(id, request);
        if (!updated) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _citaService.DeleteAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}