import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ReactiveFormsModule, FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../auth/login/services/auth.service';
import { CitaService } from '../../calendario/services/cita.service';
import { Cita } from '../../calendario/models/cita.model';

interface Recordatorio {
  id: string;
  tipo: 'alerta' | 'info';
  texto: string;
  fecha: string;
}

const RECORDATORIOS_KEY = 'odontogestpro_recordatorios';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  user: { nombreUsuario: string; rol: string } | null = null;
  dropdownAbierto = false;
  fechaHoy: string;
  citasHoy: Cita[] = [];
  isLoading = true;

  recordatorios: Recordatorio[] = [];
  mostrarFormRecordatorio = false;
  formRecordatorio: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private citaService: CitaService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {
    this.user = this.authService.getUser();
    this.fechaHoy = new Date().toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    this.formRecordatorio = this.fb.group({
      tipo: ['info'],
      texto: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.cargarRecordatorios();

    const inicio = new Date();
    inicio.setHours(0, 0, 0, 0);
    const fin = new Date();
    fin.setHours(23, 59, 59, 999);

    this.citaService.getByRango(inicio, fin).subscribe({
      next: (data) => {
        this.citasHoy = data.sort((a, b) =>
          new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
        );
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  cargarRecordatorios(): void {
    const raw = localStorage.getItem(RECORDATORIOS_KEY);
    if (raw) {
      try {
        this.recordatorios = JSON.parse(raw);
      } catch {
        this.recordatorios = [];
      }
    }
  }

  guardarRecordatoriosStorage(): void {
    localStorage.setItem(RECORDATORIOS_KEY, JSON.stringify(this.recordatorios));
  }

  agregarRecordatorio(): void {
    if (this.formRecordatorio.invalid) {
      this.formRecordatorio.markAllAsTouched();
      return;
    }

    const nuevo: Recordatorio = {
      id: Date.now().toString(),
      tipo: this.formRecordatorio.get('tipo')?.value,
      texto: this.formRecordatorio.get('texto')?.value.trim(),
      fecha: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }),
    };

    this.recordatorios.unshift(nuevo);
    this.guardarRecordatoriosStorage();
    this.formRecordatorio.reset({ tipo: 'info', texto: '' });
    this.mostrarFormRecordatorio = false;
    this.cdr.detectChanges();
  }

  eliminarRecordatorio(id: string): void {
    this.recordatorios = this.recordatorios.filter(r => r.id !== id);
    this.guardarRecordatoriosStorage();
    this.cdr.detectChanges();
  }

  formatHora(fechaHora: string): string {
    return new Date(fechaHora).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  }

  formatPeriodo(fechaHora: string): string {
    return new Date(fechaHora).getHours() < 12 ? 'AM' : 'PM';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'Confirmada': return 'badge--confirmada';
      case 'Pendiente': return 'badge--pendiente';
      case 'Cancelada': return 'badge--cancelada';
      case 'Completada': return 'badge--completada';
      default: return '';
    }
  }
}