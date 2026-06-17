import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PacienteService } from '../services/paciente.service';
import { Paciente } from '../models/paciente.model';
import { AuthService } from '../../auth/login/services/auth.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css'],
})
export class PacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  isLoading = false;
  showModal = false;
  showDeleteModal = false;
  isSubmitting = false;
  pacienteForm!: FormGroup;
  pacienteAEliminar: Paciente | null = null;
  user: { nombreUsuario: string; rol: string } | null = null;

  searchControl = new FormControl('');

  pageSize = 4;
  currentPage = 1;

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.user = this.authService.getUser();

    this.pacienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      dni: ['', [Validators.required, Validators.minLength(7)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      direccion: ['', Validators.required],
      estado: ['Activo'],
    });
  }

  ngOnInit(): void {
    this.loadPacientes();

    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.currentPage = 1;
        this.loadPacientes(value ?? '');
      });
  }

  loadPacientes(search?: string): void {
    this.isLoading = true;
    this.pacienteService.getAll(search).subscribe({
      next: (data) => {
        this.pacientes = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('No se pudieron cargar los pacientes.');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get totalPacientes(): number {
    return this.pacientes.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.pacientes.length / this.pageSize));
  }

  get pacientesPaginados(): Paciente[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.pacientes.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getInitials(nombre: string, apellido: string): string {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'Próxima Cita': return 'badge--proxima';
      case 'Completado': return 'badge--completado';
      case 'Seguimiento': return 'badge--seguimiento';
      default: return 'badge--default';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  abrirModalEliminar(paciente: Paciente): void {
    this.pacienteAEliminar = paciente;
    this.showDeleteModal = true;
  }

  cerrarModalEliminar(): void {
    this.showDeleteModal = false;
    this.pacienteAEliminar = null;
  }

  confirmarEliminar(): void {
    if (!this.pacienteAEliminar) return;

    this.pacienteService.delete(this.pacienteAEliminar.id).subscribe({
      next: () => {
        this.toast.success('Paciente eliminado correctamente.');
        this.showDeleteModal = false;
        this.pacienteAEliminar = null;
        this.loadPacientes(this.searchControl.value ?? '');
      },
      error: () => {
        this.toast.error('No se pudo eliminar el paciente.');
        this.showDeleteModal = false;
        this.pacienteAEliminar = null;
      },
    });
  }

  abrirModal(): void {
    this.pacienteForm.reset({ estado: 'Activo' });
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
    this.pacienteForm.reset();
  }

  isFieldInvalid(field: string): boolean {
    const control = this.pacienteForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  guardarPaciente(): void {
    if (this.pacienteForm.invalid) {
      this.pacienteForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.pacienteService.create(this.pacienteForm.value).subscribe({
      next: () => {
        this.toast.success('Paciente registrado correctamente.');
        this.cerrarModal();
        this.currentPage = 1;
        this.isSubmitting = false;
        this.loadPacientes(this.searchControl.value ?? '');
      },
      error: () => {
        this.toast.error('No se pudo registrar el paciente.');
        this.isSubmitting = false;
      },
    });
  }
}