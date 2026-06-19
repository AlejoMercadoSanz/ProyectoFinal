using Microsoft.AspNetCore.Hosting;
using OdontoGestPro.Application.DTOs.Adjuntos;
using OdontoGestPro.Application.Interfaces;
using OdontoGestPro.Domain.Entities;

namespace OdontoGestPro.Infrastructure.Services;

public class AdjuntoService : IAdjuntoService
{
    private readonly IAdjuntoRepository _adjuntoRepository;
    private readonly string _uploadsPath;

    public AdjuntoService(IAdjuntoRepository adjuntoRepository, IWebHostEnvironment env)
    {
        _adjuntoRepository = adjuntoRepository;
        _uploadsPath = Path.Combine(env.WebRootPath ?? env.ContentRootPath, "uploads");
        Directory.CreateDirectory(_uploadsPath);
    }

    public async Task<List<AdjuntoDto>> GetByTratamientoIdAsync(int tratamientoId)
    {
        var adjuntos = await _adjuntoRepository.GetByTratamientoIdAsync(tratamientoId);
        return adjuntos.Select(MapToDto).ToList();
    }

    public async Task<AdjuntoDto> SubirAdjuntoAsync(int tratamientoId, Stream archivoStream, string nombreArchivo, string tipoArchivo, long tamanoBytes)
    {
        var extension = Path.GetExtension(nombreArchivo);
        var nombreUnico = $"{Guid.NewGuid()}{extension}";
        var rutaFisica = Path.Combine(_uploadsPath, nombreUnico);

        using (var fileStream = new FileStream(rutaFisica, FileMode.Create))
        {
            await archivoStream.CopyToAsync(fileStream);
        }

        var adjunto = new Adjunto
        {
            TratamientoId = tratamientoId,
            NombreArchivo = nombreArchivo,
            RutaArchivo = $"uploads/{nombreUnico}",
            TipoArchivo = tipoArchivo,
            TamanoBytes = tamanoBytes,
        };

        var created = await _adjuntoRepository.CreateAsync(adjunto);
        return MapToDto(created);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var adjunto = await _adjuntoRepository.GetByIdAsync(id);
        if (adjunto is null) return false;

        var rutaFisica = Path.Combine(
            _uploadsPath.Replace("uploads", ""),
            adjunto.RutaArchivo
        );

        if (File.Exists(rutaFisica))
            File.Delete(rutaFisica);

        return await _adjuntoRepository.DeleteAsync(id);
    }

    public async Task<(string rutaFisica, string nombreArchivo)?> GetArchivoAsync(int id)
    {
        var adjunto = await _adjuntoRepository.GetByIdAsync(id);
        if (adjunto is null) return null;

        var rutaFisica = Path.Combine(
            Directory.GetParent(_uploadsPath)!.FullName,
            adjunto.RutaArchivo
        );

        if (!File.Exists(rutaFisica)) return null;

        return (rutaFisica, adjunto.NombreArchivo);
    }

    private static AdjuntoDto MapToDto(Adjunto a) => new()
    {
        Id = a.Id,
        TratamientoId = a.TratamientoId,
        NombreArchivo = a.NombreArchivo,
        RutaArchivo = a.RutaArchivo,
        TipoArchivo = a.TipoArchivo,
        TamanoBytes = a.TamanoBytes,
        FechaSubida = a.FechaSubida,
    };
}