import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment';
import { Cita, CitaRequest } from '../models/cita.model';

@Injectable({ providedIn: 'root' })
export class CitaService {
  private readonly apiUrl = `${environment.apiUrl}/citas`;

  constructor(private http: HttpClient) {}

  getByRango(desde: Date, hasta: Date): Observable<Cita[]> {
    const params = new HttpParams()
      .set('desde', desde.toISOString())
      .set('hasta', hasta.toISOString());
    return this.http.get<Cita[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Cita> {
    return this.http.get<Cita>(`${this.apiUrl}/${id}`);
  }

  create(cita: CitaRequest): Observable<Cita> {
    return this.http.post<Cita>(this.apiUrl, cita);
  }

  update(id: number, cita: CitaRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, cita);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}