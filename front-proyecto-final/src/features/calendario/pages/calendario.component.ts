import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CitaService } from '../services/cita.service';
import { Cita } from '../models/cita.model';
import { AuthService } from '../../auth/login/services/auth.service';
import { ToastService } from '../../../shared/toast/toast.service';

interface DiaCalendario {
  fecha: Date;
  numero: number;
  esDelMesActual: boolean;
  esHoy: boolean;
  citas: Cita[];
}

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css'],
})
export class CalendarioComponent implements OnInit {
  user: { nombreUsuario: string; rol: string } | null = null;
  vistaActual: 'mes' | 'semana' | 'dia' = 'mes';

  fechaActual = new Date();
  citas: Cita[] = [];
  isLoading = false;

  diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  semanas: DiaCalendario[][] = [];

  constructor(
    private citaService: CitaService,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    this.cargarCitasDelMes();
  }

  get nombreMesAnio(): string {
    return this.fechaActual.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
      .replace(/^\w/, c => c.toUpperCase());
  }

  cargarCitasDelMes(): void {
    this.isLoading = true;
    const primerDiaMes = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth(), 1);
    const ultimoDiaMes = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth() + 1, 0, 23, 59, 59);

    // Margen para mostrar días del mes anterior/siguiente en la grilla
    const inicioGrilla = this.obtenerInicioSemana(primerDiaMes);
    const finGrilla = new Date(ultimoDiaMes);
    finGrilla.setDate(finGrilla.getDate() + (7 - this.diaSemanaISO(ultimoDiaMes)));

    this.citaService.getByRango(inicioGrilla, finGrilla).subscribe({
      next: (data) => {
        this.citas = data;
        this.generarGrillaMes();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('No se pudieron cargar las citas.');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  diaSemanaISO(fecha: Date): number {
    const dia = fecha.getDay();
    return dia === 0 ? 7 : dia; // Lunes=1 ... Domingo=7
  }

  obtenerInicioSemana(fecha: Date): Date {
    const resultado = new Date(fecha);
    const diff = this.diaSemanaISO(fecha) - 1;
    resultado.setDate(resultado.getDate() - diff);
    resultado.setHours(0, 0, 0, 0);
    return resultado;
  }

  generarGrillaMes(): void {
    const primerDiaMes = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth(), 1);
    const inicioGrilla = this.obtenerInicioSemana(primerDiaMes);
    const hoy = new Date();

    const semanas: DiaCalendario[][] = [];
    let fechaCursor = new Date(inicioGrilla);

    for (let semana = 0; semana < 6; semana++) {
      const dias: DiaCalendario[] = [];
      for (let d = 0; d < 7; d++) {
        const fecha = new Date(fechaCursor);
        dias.push({
          fecha,
          numero: fecha.getDate(),
          esDelMesActual: fecha.getMonth() === this.fechaActual.getMonth(),
          esHoy: this.esMismoDia(fecha, hoy),
          citas: this.getCitasDelDia(fecha),
        });
        fechaCursor.setDate(fechaCursor.getDate() + 1);
      }
      semanas.push(dias);
    }
    this.semanas = semanas;
  }

  getCitasDelDia(fecha: Date): Cita[] {
    return this.citas
      .filter(c => this.esMismoDia(new Date(c.fechaHora), fecha))
      .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());
  }

  esMismoDia(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  mesAnterior(): void {
    this.fechaActual = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth() - 1, 1);
    this.cargarCitasDelMes();
  }

  mesSiguiente(): void {
    this.fechaActual = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth() + 1, 1);
    this.cargarCitasDelMes();
  }

  irAHoy(): void {
    this.fechaActual = new Date();
    this.cargarCitasDelMes();
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'Confirmada': return 'cita--confirmada';
      case 'Pendiente': return 'cita--pendiente';
      case 'Cancelada': return 'cita--cancelada';
      case 'Completada': return 'cita--completada';
      default: return '';
    }
  }

  formatHora(fechaHora: string): string {
    return new Date(fechaHora).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}