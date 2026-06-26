import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/environment';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-perfil-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil-modal.component.html',
  styleUrls: ['./perfil-modal.component.css'],
})
export class PerfilModalComponent implements OnChanges {
  @Input() visible = false;
  @Input() user: { nombreUsuario: string; rol: string } | null = null;
  @Output() cerrar = new EventEmitter<void>();
  @Output() actualizado = new EventEmitter<{ nombreUsuario: string; rol: string }>();

  form: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private toast: ToastService) {
    this.form = this.fb.group({
      nombreUsuario: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.minLength(6)],
      rol: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.form.patchValue({
        nombreUsuario: this.user.nombreUsuario,
        email: '',
        password: '',
        rol: this.user.rol,
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const body = {
      nombreUsuario: this.form.get('nombreUsuario')?.value,
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value ?? '',
      rol: this.user?.rol ?? '',
    };

    this.http.put(`${environment.apiUrl}/usuarios/perfil`, body).subscribe({
      next: () => {
        this.toast.success('Perfil actualizado correctamente.');
        this.actualizado.emit({ nombreUsuario: body.nombreUsuario, rol: body.rol });
        this.isSubmitting = false;
        this.cerrar.emit();
      },
      error: () => {
        this.toast.error('No se pudo actualizar el perfil.');
        this.isSubmitting = false;
      },
    });
  }

  onCerrar(): void {
    this.cerrar.emit();
  }
}