import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CitaService } from '../services/cita.service';
import { Cita } from '../models/cita.model';
import { AuthService } from '../../auth/login/services/auth.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { CitaFormModalComponent } from '../components/cita-form-modal.component';

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
  imports: [CommonModule, RouterLink, RouterLinkActive, CitaFormModalComponent],
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css'],
})
export class CalendarioComponent implements OnInit {
  user: { nombreUsuario: string; rol: string } | null = null;
  vistaActual: 'mes' | 'dia' = 'mes';

  fechaActual = new Date();
  citas: Cita[] = [];
  isLoading = false;
  showModal = false;
  isSubmitting = false;
  citaEditar: Cita | null = null;
  fechaPreseleccionada: Date | null = null;
  horaPreseleccionada: string | null = null;
  fechaDiaSeleccionado = new Date();
  horasDelDia: { hora: string; citas: Cita[] }[] = [];

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
  abrirModalNueva(fecha?: Date, hora?: string): void {
  this.citaEditar = null;
  this.fechaPreseleccionada = fecha
    ? new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate())
    : null;
  this.horaPreseleccionada = hora ?? null;
  this.showModal = true;
}

abrirModalEditar(cita: Cita): void {
  this.citaEditar = cita;
  this.horaPreseleccionada = null;
  this.showModal = true;
}

cerrarModal(): void {
  this.showModal = false;
  this.citaEditar = null;
  this.fechaPreseleccionada = null;
  this.horaPreseleccionada = null;
}

guardarCita(data: any): void {
  this.isSubmitting = true;

  if (this.citaEditar) {
    this.citaService.update(this.citaEditar.id, data).subscribe({
      next: () => {
        this.toast.success('Cita actualizada correctamente.');
        this.cerrarModal();
        this.isSubmitting = false;
        this.cargarCitasDelMes();
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('No se pudo actualizar la cita.');
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
    });
  } else {
    this.citaService.create(data).subscribe({
      next: () => {
        this.toast.success('Cita creada correctamente.');
        this.cerrarModal();
        this.isSubmitting = false;
        this.cargarCitasDelMes();
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('No se pudo crear la cita.');
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
    });
  }
}

eliminarCita(): void {
  if (!this.citaEditar) return;

  this.citaService.delete(this.citaEditar.id).subscribe({
    next: () => {
      this.toast.success('Cita eliminada correctamente.');
      this.cerrarModal();
      this.cargarCitasDelMes();
      this.cdr.detectChanges();
    },
    error: () => {
      this.toast.error('No se pudo eliminar la cita.');
      this.cdr.detectChanges();
    },
  });
}
get nombreDiaCompleto(): string {
  return this.fechaDiaSeleccionado.toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).replace(/^\w/, c => c.toUpperCase());
}

cargarCitasDelDia(): void {
  this.isLoading = true;
  const inicio = new Date(this.fechaDiaSeleccionado);
  inicio.setHours(0, 0, 0, 0);
  const fin = new Date(this.fechaDiaSeleccionado);
  fin.setHours(23, 59, 59, 999);

  this.citaService.getByRango(inicio, fin).subscribe({
    next: (data) => {
      this.generarHorasDelDia(data);
      this.isLoading = false;
      this.cdr.detectChanges();
    },
    error: () => {
      this.toast.error('No se pudieron cargar las citas del día.');
      this.isLoading = false;
      this.cdr.detectChanges();
    },
  });
}

generarHorasDelDia(citas: Cita[]): void {
  const horas: { hora: string; citas: Cita[] }[] = [];
  for (let h = 8; h <= 20; h++) {
    const horaStr = `${h.toString().padStart(2, '0')}:00`;
    const citasDeEstaHora = citas.filter(c => {
      const fechaCita = new Date(c.fechaHora);
      return fechaCita.getHours() === h;
    }).sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());
    horas.push({ hora: horaStr, citas: citasDeEstaHora });
  }
  this.horasDelDia = horas;
}

diaAnterior(): void {
  this.fechaDiaSeleccionado = new Date(this.fechaDiaSeleccionado);
  this.fechaDiaSeleccionado.setDate(this.fechaDiaSeleccionado.getDate() - 1);
  this.cargarCitasDelDia();
}

diaSiguiente(): void {
  this.fechaDiaSeleccionado = new Date(this.fechaDiaSeleccionado);
  this.fechaDiaSeleccionado.setDate(this.fechaDiaSeleccionado.getDate() + 1);
  this.cargarCitasDelDia();
}

irAHoyDia(): void {
  this.fechaDiaSeleccionado = new Date();
  this.cargarCitasDelDia();
}
cambiarVista(vista: 'mes' | 'dia'): void {
  console.log('cambiarVista llamado con:', vista);
  this.vistaActual = vista;
  console.log('vistaActual ahora es:', this.vistaActual);
  if (vista === 'dia') {
    this.fechaDiaSeleccionado = new Date(this.fechaActual);
    this.cargarCitasDelDia();
  }
}
}