import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment';
import { Gasto, GastoRequest, ResumenFinanciero } from '../models/gasto.model';

@Injectable({ providedIn: 'root' })
export class FinanzasService {
  private readonly apiUrl = `${environment.apiUrl}/gastos`;

  constructor(private http: HttpClient) {}

  getByMes(anio: number, mes: number): Observable<Gasto[]> {
    return this.http.get<Gasto[]>(`${this.apiUrl}?anio=${anio}&mes=${mes}`);
  }

  getResumen(anio: number, mes: number): Observable<ResumenFinanciero> {
    return this.http.get<ResumenFinanciero>(`${this.apiUrl}/resumen?anio=${anio}&mes=${mes}`);
  }

  create(gasto: GastoRequest): Observable<Gasto> {
    return this.http.post<Gasto>(this.apiUrl, gasto);
  }

  update(id: number, gasto: GastoRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, gasto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getCobrosDelMes(anio: number, mes: number): Observable<any[]> {
  return this.http.get<any[]>(`${environment.apiUrl}/cobros/mes?anio=${anio}&mes=${mes}`);
}
}