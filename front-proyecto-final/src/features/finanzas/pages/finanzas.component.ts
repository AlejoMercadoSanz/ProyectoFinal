import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinanzasService } from '../services/finanzas.service';
import { Gasto, ResumenFinanciero } from '../models/gasto.model';
import { AuthService } from '../../auth/login/services/auth.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { ConfirmDeleteModalComponent } from '../../../shared/confirm-delete-modal/confirm-delete-modal.component';
import { Cobro } from '../../cobros/models/cobro.model';

@Component({
  selector: 'app-finanzas',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule, ConfirmDeleteModalComponent],
  templateUrl: './finanzas.component.html',
  styleUrls: ['./finanzas.component.css'],
  
})
export class FinanzasComponent implements OnInit {
  user: { nombreUsuario: string; rol: string } | null = null;
  dropdownAbierto = false;

  mesActual: number;
  anioActual: number;
  resumen: ResumenFinanciero | null = null;
  gastos: Gasto[] = [];
  isLoading = false;
  isSubmitting = false;
  cobrosDelMes: Cobro[] = [];

  showModal = false;
  gastoEditar: Gasto | null = null;
  showDeleteModal = false;
  gastoAEliminar: Gasto | null = null;

  form: FormGroup;

  categorias = ['Insumos', 'Alquiler', 'Servicios', 'Equipamiento', 'Personal', 'Otros'];

  meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  constructor(
    private finanzasService: FinanzasService,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    this.user = this.authService.getUser();
    const hoy = new Date();
    this.mesActual = hoy.getMonth() + 1;
    this.anioActual = hoy.getFullYear();

    this.form = this.fb.group({
      descripcion: ['', Validators.required],
      categoria: ['Insumos', Validators.required],
      monto: [null, [Validators.required, Validators.min(0.01)]],
      fecha: [new Date().toISOString().split('T')[0], Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.isLoading = true;
    this.finanzasService.getResumen(this.anioActual, this.mesActual).subscribe({
      next: (data) => {
        this.resumen = data;
        this.cdr.detectChanges();
      },
    });

    this.finanzasService.getByMes(this.anioActual, this.mesActual).subscribe({
      next: (data) => {
        this.gastos = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });

    this.finanzasService.getCobrosDelMes(this.anioActual, this.mesActual).subscribe({
      next: (data) => {
        this.cobrosDelMes = data;
        this.cdr.detectChanges();
      },
    });
  }

  mesAnterior(): void {
    if (this.mesActual === 1) {
      this.mesActual = 12;
      this.anioActual--;
    } else {
      this.mesActual--;
    }
    this.cargarDatos();
  }

  mesSiguiente(): void {
    if (this.mesActual === 12) {
      this.mesActual = 1;
      this.anioActual++;
    } else {
      this.mesActual++;
    }
    this.cargarDatos();
  }

  get mesLabel(): string {
    return `${this.meses[this.mesActual - 1]} ${this.anioActual}`;
  }

  abrirModalNuevo(): void {
    this.gastoEditar = null;
    this.form.reset({ categoria: 'Insumos', fecha: new Date().toISOString().split('T')[0] });
    this.showModal = true;
  }

  abrirModalEditar(gasto: Gasto): void {
    this.gastoEditar = gasto;
    this.form.patchValue({
      descripcion: gasto.descripcion,
      categoria: gasto.categoria,
      monto: gasto.monto,
      fecha: gasto.fecha.split('T')[0],
    });
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
    this.gastoEditar = null;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  guardarGasto(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const request = this.form.value;

    if (this.gastoEditar) {
      this.finanzasService.update(this.gastoEditar.id, request).subscribe({
        next: () => {
          this.toast.success('Gasto actualizado correctamente.');
          this.cerrarModal();
          this.isSubmitting = false;
          this.cargarDatos();
        },
        error: () => {
          this.toast.error('No se pudo actualizar el gasto.');
          this.isSubmitting = false;
        },
      });
    } else {
      this.finanzasService.create(request).subscribe({
        next: () => {
          this.toast.success('Gasto registrado correctamente.');
          this.cerrarModal();
          this.isSubmitting = false;
          this.cargarDatos();
        },
        error: () => {
          this.toast.error('No se pudo registrar el gasto.');
          this.isSubmitting = false;
        },
      });
    }
  }

  abrirModalEliminar(gasto: Gasto): void {
    this.gastoAEliminar = gasto;
    this.showDeleteModal = true;
  }

  cerrarModalEliminar(): void {
    this.showDeleteModal = false;
    this.gastoAEliminar = null;
  }

  confirmarEliminar(): void {
    if (!this.gastoAEliminar) return;
    this.finanzasService.delete(this.gastoAEliminar.id).subscribe({
      next: () => {
        this.toast.success('Gasto eliminado correctamente.');
        this.cerrarModalEliminar();
        this.cargarDatos();
      },
      error: () => {
        this.toast.error('No se pudo eliminar el gasto.');
        this.cerrarModalEliminar();
      },
    });
  }

  getCategoriaClass(categoria: string): string {
    switch (categoria) {
      case 'Insumos': return 'badge--insumos';
      case 'Alquiler': return 'badge--alquiler';
      case 'Servicios': return 'badge--servicios';
      case 'Equipamiento': return 'badge--equipamiento';
      case 'Personal': return 'badge--personal';
      default: return 'badge--otros';
    }
  }

  formatMonto(monto: number): string {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(monto);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}