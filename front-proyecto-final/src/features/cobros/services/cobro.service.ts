import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment';
import { Cobro, CobroRequest } from '../models/cobro.model';

@Injectable({ providedIn: 'root' })
export class CobroService {
  private readonly apiUrl = `${environment.apiUrl}/cobros`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Cobro[]> {
    return this.http.get<Cobro[]>(this.apiUrl);
  }

  getByPaciente(pacienteId: number): Observable<Cobro[]> {
    return this.http.get<Cobro[]>(`${this.apiUrl}/paciente/${pacienteId}`);
  }

  getById(id: number): Observable<Cobro> {
    return this.http.get<Cobro>(`${this.apiUrl}/${id}`);
  }

  create(cobro: CobroRequest): Observable<Cobro> {
    return this.http.post<Cobro>(this.apiUrl, cobro);
  }

  update(id: number, cobro: CobroRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, cobro);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}