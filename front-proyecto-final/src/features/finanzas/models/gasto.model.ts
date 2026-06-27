export interface Gasto {
  id: number;
  descripcion: string;
  categoria: string;
  monto: number;
  fecha: string;
}

export interface GastoRequest {
  descripcion: string;
  categoria: string;
  monto: number;
  fecha: string;
}

export interface ResumenFinanciero {
  totalIngresos: number;
  totalGastos: number;
  balance: number;
  anio: number;
  mes: number;
}