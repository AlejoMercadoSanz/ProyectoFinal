export interface Cita {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  pacienteApellido: string;
  fechaHora: string;
  duracionMinutos: number;
  tipoTratamiento: string;
  estado: string;
  notas: string;
}

export interface CitaRequest {
  pacienteId: number;
  fechaHora: string;
  duracionMinutos: number;
  tipoTratamiento: string;
  estado: string;
  notas: string;
}