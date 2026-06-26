import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from '../services/paciente.service';
import { Paciente } from '../models/paciente.model';
import { AuthService } from '../../auth/login/services/auth.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-paciente-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './paciente-detalle.component.html',
  styleUrls: ['./paciente-detalle.component.css'],
})
export class PacienteDetalleComponent implements OnInit {
  paciente: Paciente | null = null;
  isLoading = true;
  showEditModal = false;
  isSubmitting = false;
  editForm!: FormGroup;
  user: { nombreUsuario: string; rol: string } | null = null;
  dropdownAbierto = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService,
    private authService: AuthService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {
    this.user = this.authService.getUser();

    this.editForm = this.fb.group({
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
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/pacientes']);
      return;
    }

    this.pacienteService.getById(id).subscribe({
      next: (data) => {
        this.paciente = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('No se pudo cargar el paciente.');
        this.router.navigate(['/pacientes']);
      },
    });
  }

  getInitials(nombre: string, apellido: string): string {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  }

  calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  abrirEditModal(): void {
    if (!this.paciente) return;
    this.editForm.patchValue({
      nombre: this.paciente.nombre,
      apellido: this.paciente.apellido,
      dni: this.paciente.dni,
      email: this.paciente.email,
      telefono: this.paciente.telefono,
      fechaNacimiento: this.paciente.fechaNacimiento.split('T')[0],
      direccion: this.paciente.direccion,
      estado: this.paciente.estado,
    });
    this.showEditModal = true;
  }

  cerrarEditModal(): void {
    this.showEditModal = false;
    this.editForm.reset();
  }

  isFieldInvalid(field: string): boolean {
    const control = this.editForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  guardarEdicion(): void {
  if (this.editForm.invalid) {
    this.editForm.markAllAsTouched();
    return;
  }

  if (!this.paciente) return;

  this.isSubmitting = true;
  this.pacienteService.update(this.paciente.id, this.editForm.value).subscribe({
    next: () => {
      this.toast.success('Paciente actualizado correctamente.');
      this.cerrarEditModal();
      this.pacienteService.getById(this.paciente!.id).subscribe({
        next: (data) => {
          this.paciente = data;
          this.isSubmitting = false;
          this.cdr.detectChanges();
        },
      });
    },
    error: () => {
      this.toast.error('No se pudo actualizar el paciente.');
      this.isSubmitting = false;
    },
  });
}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}