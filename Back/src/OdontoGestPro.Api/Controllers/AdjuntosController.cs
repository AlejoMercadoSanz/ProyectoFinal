using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OdontoGestPro.Application.Interfaces;

namespace OdontoGestPro.Api.Controllers;

[ApiController]
[Route("api/tratamientos/{tratamientoId}/adjuntos")]
[Authorize]
public class AdjuntosController : ControllerBase
{
    private readonly IAdjuntoService _adjuntoService;

    public AdjuntosController(IAdjuntoService adjuntoService)
    {
        _adjuntoService = adjuntoService;
    }

    [HttpGet]
    public async Task<IActionResult> GetByTratamiento(int tratamientoId)
    {
        var adjuntos = await _adjuntoService.GetByTratamientoIdAsync(tratamientoId);
        return Ok(adjuntos);
    }

    [HttpPost]
    public async Task<IActionResult> Subir(int tratamientoId, IFormFile archivo)
    {
        if (archivo == null || archivo.Length == 0)
            return BadRequest(new { message = "No se proporcionó ningún archivo." });

        var extensionesPermitidas = new[] { ".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx" };
        var extension = Path.GetExtension(archivo.FileName).ToLower();

        if (!extensionesPermitidas.Contains(extension))
            return BadRequest(new { message = "Tipo de archivo no permitido." });

        if (archivo.Length > 10 * 1024 * 1024)
            return BadRequest(new { message = "El archivo supera el tamaño máximo de 10MB." });

        using var stream = archivo.OpenReadStream();
        var adjunto = await _adjuntoService.SubirAdjuntoAsync(
            tratamientoId,
            stream,
            archivo.FileName,
            archivo.ContentType,
            archivo.Length
        );

        return Ok(adjunto);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int tratamientoId, int id)
    {
        var deleted = await _adjuntoService.DeleteAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }

    [HttpGet("{id}/descargar")]
    public async Task<IActionResult> Descargar(int tratamientoId, int id)
    {
        var resultado = await _adjuntoService.GetArchivoAsync(id);
        if (resultado is null) return NotFound();

        var (rutaFisica, nombreArchivo) = resultado.Value;
        var bytes = await System.IO.File.ReadAllBytesAsync(rutaFisica);
        return File(bytes, "application/octet-stream", nombreArchivo);
    }
}