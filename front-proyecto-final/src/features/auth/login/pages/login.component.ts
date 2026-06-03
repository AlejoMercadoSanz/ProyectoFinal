import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../../shared/toast/toast.service';

const MOCK_USER = 'admin';
const MOCK_PASS = 'Admin123';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastService,
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldError(field: string): string {
    const control = this.loginForm.get(field);
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'Este campo es obligatorio.';
    if (control.errors['minlength']) {
      const min = control.errors['minlength'].requiredLength;
      return `Mínimo ${min} caracteres.`;
    }
    return 'Campo inválido.';
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toast.warning('Completá todos los campos correctamente.');
      return;
    }

    this.isLoading = true;

    // TODO: api
    setTimeout(() => {
      const { username, password } = this.loginForm.value;
      if (username === MOCK_USER && password === MOCK_PASS) {
        this.toast.success('Sesión iniciada correctamente.');
        this.router.navigate(['/dashboard']);
      } else {
        this.toast.error('Usuario o contraseña incorrectos.');
        this.loginForm.get('password')?.reset();
      }
      this.isLoading = false;
    }, 1200);
  }
}