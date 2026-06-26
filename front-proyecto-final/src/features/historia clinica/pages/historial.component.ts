import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PacienteService } from '../../pacientes/services/paciente.service';
import { Paciente } from '../../pacientes/models/paciente.model';
import { AuthService } from '../../auth/login/services/auth.service';
import { ToastService } from '../../../shared/toast/toast.service';


@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css'],
})
export class HistorialComponent {
  pacientes: Paciente[] = [];
  isLoading = false;
  buscado = false;
  user: { nombreUsuario: string; rol: string } | null = null;
  dropdownAbierto = false;

  searchControl = new FormControl('');

  constructor(
    private pacienteService: PacienteService,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.user = this.authService.getUser();

    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        if (value && value.trim().length >= 2) {
          this.buscarPacientes(value.trim());
        } else {
          this.pacientes = [];
          this.buscado = false;
          this.cdr.detectChanges();
        }
      });
  }

  buscarPacientes(search: string): void {
    this.isLoading = true;
    this.buscado = true;
    this.pacienteService.getAll(search).subscribe({
      next: (data) => {
        this.pacientes = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('No se pudieron buscar los pacientes.');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  getInitials(nombre: string, apellido: string): string {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}