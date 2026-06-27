import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, ActivatedRoute, Router } from '@angular/router';
import { TratamientoService } from '../services/tratamiento.service';
import { PacienteService } from '../../pacientes/services/paciente.service';
import { Tratamiento } from '../models/tratamiento.model';
import { Paciente } from '../../pacientes/models/paciente.model';
import { AuthService } from '../../auth/login/services/auth.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { ConfirmDeleteModalComponent } from '../../../shared/confirm-delete-modal/confirm-delete-modal.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ConsentimientoService } from '../../../shared/services/consentimiento.service';

@Component({
  selector: 'app-historial-paciente',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ConfirmDeleteModalComponent, ReactiveFormsModule],
  templateUrl: './historial-paciente.component.html',
  styleUrls: ['./historial-paciente.component.css'],
})
export class HistorialPacienteComponent implements OnInit {
  paciente: Paciente | null = null;
  tratamientos: Tratamiento[] = [];
  isLoading = true;
  showModal = false;
  isSubmitting = false;
  tratamientoEditar: Tratamiento | null = null;
  showDeleteModal = false;
  searchControl = new FormControl('');
  tratamientosTodos: Tratamiento[] = [];
  tratamientoAEliminar: Tratamiento | null = null;
  user: { nombreUsuario: string; rol: string } | null = null;
  dropdownAbierto = false;
  showPerfilModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tratamientoService: TratamientoService,
    private pacienteService: PacienteService,
    private authService: AuthService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
    private consentimientoService: ConsentimientoService,
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('pacienteId'));
    if (!id) {
      this.router.navigate(['/historial-clinica']);
      return;
    }

    this.pacienteService.getById(id).subscribe({
      next: (paciente) => {
        this.paciente = paciente;
        this.loadTratamientos(id);
      },
      error: () => {
        this.toast.error('No se pudo cargar el paciente.');
        this.router.navigate(['/historial-clinica']);
      },
    });
  }

  get tratamientosFiltrados(): Tratamiento[] {
  const q = this.searchControl.value?.toLowerCase().trim() ?? '';
  if (!q) return this.tratamientosTodos;
  return this.tratamientosTodos.filter(t =>
    t.tipo?.toLowerCase().includes(q) ||
    t.descripcion?.toLowerCase().includes(q) ||
    t.notasClinicas?.toLowerCase().includes(q)
  );
}

 loadTratamientos(pacienteId: number): void {
  this.tratamientoService.getByPaciente(pacienteId).subscribe({
    next: (data) => {
      this.tratamientosTodos = data;
      this.tratamientos = data;
      this.isLoading = false;
      this.cdr.detectChanges();
    },
    error: () => {
      this.toast.error('No se pudieron cargar los tratamientos.');
      this.isLoading = false;
      this.cdr.detectChanges();
    },
  });
}

  getInitials(nombre: string, apellido: string): string {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'Completado': return 'badge--completado';
      case 'Pendiente': return 'badge--pendiente';
      case 'Próximo': return 'badge--proximo';
      default: return 'badge--default';
    }
  }

  getTimelineClass(estado: string): string {
    switch (estado) {
      case 'Completado': return 'timeline-item--completado';
      case 'Pendiente': return 'timeline-item--pendiente';
      case 'Próximo': return 'timeline-item--proximo';
      default: return '';
    }
  }

  abrirModal(tratamiento?: Tratamiento): void {
    if (tratamiento) {
      this.router.navigate(['/historial-clinica', this.paciente!.id, 'nueva-atencion', tratamiento.id]);
    } else {
      this.router.navigate(['/historial-clinica', this.paciente!.id, 'nueva-atencion']);
    }
  }

  cerrarModal(): void {
    this.showModal = false;
    this.tratamientoEditar = null;
  }

  guardarTratamiento(data: any): void {
    if (!this.paciente) return;
    this.isSubmitting = true;

    const request = { ...data, pacienteId: this.paciente.id };

    if (this.tratamientoEditar) {
      this.tratamientoService.update(this.tratamientoEditar.id, request).subscribe({
        next: () => {
          this.toast.success('Tratamiento actualizado correctamente.');
          this.cerrarModal();
          this.isSubmitting = false;
          this.loadTratamientos(this.paciente!.id);
        },
        error: () => {
          this.toast.error('No se pudo actualizar el tratamiento.');
          this.isSubmitting = false;
        },
      });
    } else {
      this.tratamientoService.create(request).subscribe({
        next: () => {
          this.toast.success('Tratamiento registrado correctamente.');
          this.cerrarModal();
          this.isSubmitting = false;
          this.loadTratamientos(this.paciente!.id);
        },
        error: () => {
          this.toast.error('No se pudo registrar el tratamiento.');
          this.isSubmitting = false;
        },
      });
    }
  }

  abrirModalEliminar(tratamiento: Tratamiento): void {
    this.tratamientoAEliminar = tratamiento;
    this.showDeleteModal = true;
  }

  cerrarModalEliminar(): void {
    this.showDeleteModal = false;
    this.tratamientoAEliminar = null;
  }

  confirmarEliminarTratamiento(): void {
    if (!this.tratamientoAEliminar) return;

    this.tratamientoService.delete(this.tratamientoAEliminar.id).subscribe({
      next: () => {
        this.toast.success('Tratamiento eliminado correctamente.');
        this.cerrarModalEliminar();
        this.loadTratamientos(this.paciente!.id);
      },
      error: () => {
        this.toast.error('No se pudo eliminar el tratamiento.');
        this.cerrarModalEliminar();
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  onPerfilActualizado(data: { nombreUsuario: string; rol: string }): void {
  this.user = data;
}
descargarConsentimiento(): void {
  if (!this.paciente) return;
  this.consentimientoService.generarPDF(this.paciente, this.tratamientosTodos);
}
}