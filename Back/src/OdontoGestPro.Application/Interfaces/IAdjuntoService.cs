using OdontoGestPro.Application.DTOs.Adjuntos;

namespace OdontoGestPro.Application.Interfaces;

public interface IAdjuntoService
{
    Task<List<AdjuntoDto>> GetByTratamientoIdAsync(int tratamientoId);
    Task<AdjuntoDto> SubirAdjuntoAsync(int tratamientoId, Stream archivoStream, string nombreArchivo, string tipoArchivo, long tamanoBytes);
    Task<bool> DeleteAsync(int id);
    Task<(string rutaFisica, string nombreArchivo)?> GetArchivoAsync(int id);
}