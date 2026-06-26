export interface Cobro {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  pacienteApellido: string;
  tratamientoId: number | null;
  concepto: string;
  fechaProcedimiento: string;
  fechaRegistro: string;
  monto: number;
  modoPago: string;
  estado: string;
}

export interface CobroRequest {
  pacienteId: number;
  tratamientoId: number | null;
  concepto: string;
  fechaProcedimiento: string;
  monto: number;
  modoPago: string;
  estado: string;
}