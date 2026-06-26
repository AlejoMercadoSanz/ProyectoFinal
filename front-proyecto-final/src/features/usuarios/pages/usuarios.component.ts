import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario.model';
import { AuthService } from '../../auth/login/services/auth.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { ConfirmDeleteModalComponent } from '../../../shared/confirm-delete-modal/confirm-delete-modal.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule, ConfirmDeleteModalComponent],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  user: { nombreUsuario: string; rol: string } | null = null;
  dropdownAbierto = false;
  usuarios: Usuario[] = [];
  isLoading = false;
  isSubmitting = false;
  showModal = false;
  usuarioEditar: Usuario | null = null;
  form: FormGroup;
  showDeleteModal = false;
  usuarioAEliminar: Usuario | null = null;

  roles = ['Admin', 'Odontologo', 'Recepcionista'];

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    this.user = this.authService.getUser();
    this.form = this.fb.group({
      nombreUsuario: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.minLength(6)],
      rol: ['Odontologo', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.isLoading = true;
    this.usuarioService.getAll().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('No se pudieron cargar los usuarios.');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  abrirModalNuevo(): void {
    this.usuarioEditar = null;
    this.form.reset({ rol: 'Odontologo', nombreUsuario: '', email: '', password: '' });
    this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.form.get('password')?.updateValueAndValidity();
    this.showModal = true;
  }

  abrirModalEditar(usuario: Usuario): void {
    this.usuarioEditar = usuario;
    this.form.patchValue({
      nombreUsuario: usuario.nombreUsuario,
      email: usuario.email,
      rol: usuario.rol,
      password: '',
    });
    this.form.get('password')?.setValidators([Validators.minLength(6)]);
    this.form.get('password')?.updateValueAndValidity();
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
    this.usuarioEditar = null;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  guardarUsuario(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.warning('Completá todos los campos requeridos.');
      return;
    }

    this.isSubmitting = true;
    const request = this.form.value;

    if (this.usuarioEditar) {
      this.usuarioService.update(this.usuarioEditar.id, request).subscribe({
        next: () => {
          this.toast.success('Usuario actualizado correctamente.');
          this.cerrarModal();
          this.isSubmitting = false;
          this.cargarUsuarios();
        },
        error: () => {
          this.toast.error('No se pudo actualizar el usuario.');
          this.isSubmitting = false;
        },
      });
    } else {
      this.usuarioService.create(request).subscribe({
        next: () => {
          this.toast.success('Usuario creado correctamente.');
          this.cerrarModal();
          this.isSubmitting = false;
          this.cargarUsuarios();
        },
        error: () => {
          this.toast.error('No se pudo crear el usuario.');
          this.isSubmitting = false;
        },
      });
    }
  }

  abrirModalEliminar(usuario: Usuario): void {
  this.usuarioAEliminar = usuario;
  this.showDeleteModal = true;
}

cerrarModalEliminar(): void {
  this.showDeleteModal = false;
  this.usuarioAEliminar = null;
}

confirmarEliminar(): void {
  if (!this.usuarioAEliminar) return;
  this.usuarioService.delete(this.usuarioAEliminar.id).subscribe({
    next: () => {
      this.toast.success('Usuario eliminado correctamente.');
      this.cerrarModalEliminar();
      this.cargarUsuarios();
    },
    error: () => {
      this.toast.error('No se pudo eliminar el usuario.');
      this.cerrarModalEliminar();
    },
  });
}

  getRolClass(rol: string): string {
    switch (rol) {
      case 'Admin': return 'badge--admin';
      case 'Odontologo': return 'badge--odontologo';
      case 'Recepcionista': return 'badge--recepcionista';
      default: return '';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}