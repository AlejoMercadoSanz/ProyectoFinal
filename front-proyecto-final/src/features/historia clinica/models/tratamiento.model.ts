export interface Tratamiento {
  id: number;
  pacienteId: number;
  tipo: string;
  descripcion: string;
  notasClinicas: string;
  estado: string;
  fecha: string;
  dienteAfectado: string;
  adjuntos: Adjunto[];
}

export interface TratamientoRequest {
  pacienteId: number;
  tipo: string;
  descripcion: string;
  notasClinicas: string;
  estado: string;
  fecha: string;
  dienteAfectado: string;
}

export interface Adjunto {
  id: number;
  tratamientoId: number;
  nombreArchivo: string;
  rutaArchivo: string;
  tipoArchivo: string;
  tamanoBytes: number;
  fechaSubida: string;
}