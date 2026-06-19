import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment';
import { Tratamiento, TratamientoRequest } from '../models/tratamiento.model';

export interface Adjunto {
  id: number;
  tratamientoId: number;
  nombreArchivo: string;
  rutaArchivo: string;
  tipoArchivo: string;
  tamanoBytes: number;
  fechaSubida: string;
}

@Injectable({ providedIn: 'root' })
export class TratamientoService {
  private readonly apiUrl = `${environment.apiUrl}/tratamientos`;

  constructor(private http: HttpClient) {}

  getByPaciente(pacienteId: number): Observable<Tratamiento[]> {
    return this.http.get<Tratamiento[]>(`${this.apiUrl}/paciente/${pacienteId}`);
  }

  create(tratamiento: TratamientoRequest): Observable<Tratamiento> {
    return this.http.post<Tratamiento>(this.apiUrl, tratamiento);
  }

  update(id: number, tratamiento: TratamientoRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, tratamiento);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAdjuntos(tratamientoId: number): Observable<Adjunto[]> {
    return this.http.get<Adjunto[]>(`${environment.apiUrl}/tratamientos/${tratamientoId}/adjuntos`);
  }

  subirAdjunto(tratamientoId: number, archivo: File): Observable<Adjunto> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return this.http.post<Adjunto>(
      `${environment.apiUrl}/tratamientos/${tratamientoId}/adjuntos`,
      formData
    );
  }

  eliminarAdjunto(tratamientoId: number, adjuntoId: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/tratamientos/${tratamientoId}/adjuntos/${adjuntoId}`
    );
  }
  getById(id: number): Observable<Tratamiento> {
  return this.http.get<Tratamiento>(`${this.apiUrl}/${id}`);
}
}