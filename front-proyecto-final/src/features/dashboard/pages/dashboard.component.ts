import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../auth/login/services/auth.service';

interface Cita {
  hora: string;
  periodo: string;
  paciente: string;
  motivo: string;
  estado: 'Confirmada' | 'En espera' | 'Pendiente';
}

interface Recordatorio {
  tipo: 'alerta' | 'info';
  texto: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  user: { nombreUsuario: string; rol: string } | null = null;
  fechaHoy: string;

  citasHoy: Cita[] = [
    { hora: '09:30', periodo: 'AM', paciente: 'Roberto Jiménez', motivo: 'Profilaxis y Blanqueamiento', estado: 'Confirmada' },
    { hora: '11:00', periodo: 'AM', paciente: 'Elena Martínez', motivo: 'Revisión Ortodoncia', estado: 'En espera' },
    { hora: '12:30', periodo: 'PM', paciente: 'Carlos Ruiz', motivo: 'Extracción Tercer Molar', estado: 'Pendiente' },
  ];

  recordatorios: Recordatorio[] = [
    { tipo: 'alerta', texto: 'Confirmar pedido de resinas con proveedor.' },
    { tipo: 'info', texto: 'Mantenimiento de autoclave a las 15:00.' },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.user = this.authService.getUser();

    this.fechaHoy = new Date().toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getEstadoClass(estado: Cita['estado']): string {
    switch (estado) {
      case 'Confirmada':
        return 'badge--confirmada';
      case 'En espera':
        return 'badge--espera';
      case 'Pendiente':
        return 'badge--pendiente';
      default:
        return '';
    }
  }
}