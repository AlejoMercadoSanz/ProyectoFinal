import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CobroService } from '../services/cobro.service';
import { PacienteService } from '../../pacientes/services/paciente.service';
import { TratamientoService } from '../../historia clinica/services/tratamiento.service';
import { Cobro } from '../models/cobro.model';
import { Paciente } from '../../pacientes/models/paciente.model';
import { Tratamiento } from '../../historia clinica/models/tratamiento.model';
import { AuthService } from '../../auth/login/services/auth.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { CobroFormModalComponent } from '../components/cobro-form-modal.component';
import { ConfirmDeleteModalComponent } from '../../../shared/confirm-delete-modal/confirm-delete-modal.component';

@Component({
  selector: 'app-cobros',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule, CobroFormModalComponent, ConfirmDeleteModalComponent],
  templateUrl: './cobros.component.html',
  styleUrls: ['./cobros.component.css'],
})
export class CobrosComponent implements OnInit {
  user: { nombreUsuario: string; rol: string } | null = null;
  dropdownAbierto = false;

  searchControl = new FormControl('');
  pacientes: Paciente[] = [];
  pacienteSeleccionado: Paciente | null = null;
  tratamientos: Tratamiento[] = [];
  cobrosDelPaciente: Cobro[] = [];
  buscando = false;
  isSubmitting = false;
  showEditModal = false;
  isSubmittingEdit = false;
  cobroEditar: Cobro | null = null;
  showDeleteModal = false;
  cobroAEliminar: Cobro | null = null;
  showPerfilModal = false;

  modoPagoSeleccionado: 'Efectivo' | 'Tarjeta' | 'Transferencia' = 'Efectivo';
  tratamientoSeleccionadoObj: Tratamiento | undefined = undefined;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cobroService: CobroService,
    private pacienteService: PacienteService,
    private tratamientoService: TratamientoService,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {
    this.user = this.authService.getUser();
    this.form = this.fb.group({
      tratamientoId: [null],
      concepto: ['', Validators.required],
      fechaProcedimiento: [new Date().toISOString().split('T')[0], Validators.required],
      monto: [null, [Validators.required, Validators.min(0.01)]],
      estado: ['Pagado', Validators.required],
    });
  }

  ngOnInit(): void {
    const pacienteId = this.route.snapshot.queryParamMap.get('pacienteId');
    const tratamientoId = this.route.snapshot.queryParamMap.get('tratamientoId');

    if (pacienteId) {
      this.pacienteService.getById(Number(pacienteId)).subscribe({
        next: (paciente) => {
          this.pacienteSeleccionado = paciente;
          this.cargarTratamientosYCobros(paciente.id);

          if (tratamientoId) {
            this.tratamientoService.getById(Number(tratamientoId)).subscribe({
              next: (t) => {
                this.tratamientoSeleccionadoObj = t;
                const dientes = this.formatDientesAfectados(t.dienteAfectado);
                const concepto = t.tipo
                  + (t.descripcion ? ' - ' + t.descripcion : '')
                  + (dientes ? ' | ' + dientes : '');
                this.form.patchValue({
                  tratamientoId: t.id,
                  concepto,
                  fechaProcedimiento: t.fecha.split('T')[0],
                });
                this.cdr.detectChanges();
              },
            });
          }
          this.cdr.detectChanges();
        },
      });
    }

    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        if (value && value.trim().length >= 2) {
          this.buscarPacientes(value.trim());
        } else {
          this.pacientes = [];
          this.buscando = false;
          this.cdr.detectChanges();
        }
      });
  }

  buscarPacientes(search: string): void {
    this.buscando = true;
    this.pacienteService.getAll(search).subscribe({
      next: (data) => {
        this.pacientes = data;
        this.buscando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.buscando = false;
        this.cdr.detectChanges();
      },
    });
  }

  seleccionarPaciente(paciente: Paciente): void {
    this.pacienteSeleccionado = paciente;
    this.pacientes = [];
    this.tratamientoSeleccionadoObj = undefined;
    this.searchControl.setValue('', { emitEvent: false });
    this.cargarTratamientosYCobros(paciente.id);
    this.cdr.detectChanges();
  }

  cargarTratamientosYCobros(pacienteId: number): void {
    this.tratamientoService.getByPaciente(pacienteId).subscribe({
      next: (data) => {
        this.tratamientos = data;
        this.cdr.detectChanges();
      },
    });

    this.cobroService.getByPaciente(pacienteId).subscribe({
      next: (data) => {
        this.cobrosDelPaciente = data;
        this.cdr.detectChanges();
      },
    });
  }

  onTratamientoChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const tratamientoId = Number(select.value);

    if (!tratamientoId) {
      this.tratamientoSeleccionadoObj = undefined;
      this.form.get('concepto')?.setValue('');
      this.form.get('tratamientoId')?.setValue(null);
      this.cdr.detectChanges();
      return;
    }

    const tratamiento = this.tratamientos.find(t => t.id === tratamientoId);
    if (tratamiento) {
      this.tratamientoSeleccionadoObj = tratamiento;
      const dientes = this.formatDientesAfectados(tratamiento.dienteAfectado);
      const concepto = tratamiento.tipo
        + (tratamiento.descripcion ? ' - ' + tratamiento.descripcion : '')
        + (dientes ? ' | ' + dientes : '');
      this.form.patchValue({
        tratamientoId: tratamiento.id,
        concepto,
        fechaProcedimiento: tratamiento.fecha.split('T')[0],
      });
      this.cdr.detectChanges();
    }
  }

  seleccionarModoPago(modo: 'Efectivo' | 'Tarjeta' | 'Transferencia'): void {
    this.modoPagoSeleccionado = modo;
  }

  cambiarPaciente(): void {
    this.pacienteSeleccionado = null;
    this.tratamientos = [];
    this.cobrosDelPaciente = [];
    this.tratamientoSeleccionadoObj = undefined;
    this.form.reset({
      tratamientoId: null,
      concepto: '',
      fechaProcedimiento: new Date().toISOString().split('T')[0],
      monto: null,
      estado: 'Pagado',
    });
    this.modoPagoSeleccionado = 'Efectivo';
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get totalResumen(): number {
    return this.form.get('monto')?.value ?? 0;
  }

  registrarCobro(): void {
    if (!this.pacienteSeleccionado) {
      this.toast.warning('Seleccioná un paciente primero.');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.warning('Completá todos los campos requeridos.');
      return;
    }

    this.isSubmitting = true;

    const request = {
      ...this.form.value,
      pacienteId: this.pacienteSeleccionado.id,
      modoPago: this.modoPagoSeleccionado,
      tratamientoId: this.form.get('tratamientoId')?.value || null,
    };

    this.cobroService.create(request).subscribe({
      next: () => {
        this.toast.success('Cobro registrado correctamente.');
        this.isSubmitting = false;
        this.tratamientoSeleccionadoObj = undefined;
        this.cargarTratamientosYCobros(this.pacienteSeleccionado!.id);
        this.form.reset({
          tratamientoId: null,
          concepto: '',
          fechaProcedimiento: new Date().toISOString().split('T')[0],
          monto: null,
          estado: 'Pagado',
        });
        this.modoPagoSeleccionado = 'Efectivo';
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('No se pudo registrar el cobro.');
        this.isSubmitting = false;
      },
    });
  }

  getEstadoClass(estado: string): string {
    return estado === 'Pagado' ? 'badge--completado' : 'badge--pendiente';
  }

  formatMonto(monto: number): string {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(monto);
  }

  formatDientesAfectados(dienteAfectado: string): string {
  if (!dienteAfectado) return '';
  return dienteAfectado.split('|').map(parte => {
    const [numero, carasStr] = parte.split(':');
    if (!carasStr) return `Diente ${numero}`;
    const carasAfectadas = carasStr.split(',')
      .map(par => {
        const [cara, estado] = par.split('=');
        return { cara, estado };
      })
      .filter(c => c.estado !== 'sano')
      .map(c => {
        const caraLabel: Record<string, string> = { V: 'Vestibular', O: 'Oclusal', L: 'Lingual', M: 'Mesial', D: 'Distal' };
        const estadoLabel: Record<string, string> = { caries: 'Caries', obturacion: 'Obturación', corona: 'Corona' };
        return `${caraLabel[c.cara] ?? c.cara} (${estadoLabel[c.estado] ?? c.estado})`;
      });
    return carasAfectadas.length > 0 ? `Diente ${numero}: ${carasAfectadas.join(', ')}` : '';
  }).filter(Boolean).join(' | ');
}

  getInitials(nombre: string, apellido: string): string {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  abrirModalEditar(cobro: Cobro): void {
  this.cobroEditar = cobro;
  this.showEditModal = true;
}

cerrarModalEditar(): void {
  this.showEditModal = false;
  this.cobroEditar = null;
}

guardarEdicion(data: any): void {
  if (!this.cobroEditar) return;
  this.isSubmittingEdit = true;
  const request = { ...data, pacienteId: this.cobroEditar.pacienteId, tratamientoId: this.cobroEditar.tratamientoId };
  this.cobroService.update(this.cobroEditar.id, request).subscribe({
    next: () => {
      this.toast.success('Cobro actualizado correctamente.');
      this.cerrarModalEditar();
      this.isSubmittingEdit = false;
      this.cargarTratamientosYCobros(this.pacienteSeleccionado!.id);
      this.cdr.detectChanges();
    },
    error: () => {
      this.toast.error('No se pudo actualizar el cobro.');
      this.isSubmittingEdit = false;
    },
  });
}

abrirModalEliminar(cobro: Cobro): void {
  this.cobroAEliminar = cobro;
  this.showDeleteModal = true;
}

cerrarModalEliminar(): void {
  this.showDeleteModal = false;
  this.cobroAEliminar = null;
}

confirmarEliminar(): void {
  if (!this.cobroAEliminar) return;
  this.cobroService.delete(this.cobroAEliminar.id).subscribe({
    next: () => {
      this.toast.success('Cobro eliminado correctamente.');
      this.cerrarModalEliminar();
      this.cargarTratamientosYCobros(this.pacienteSeleccionado!.id);
      this.cdr.detectChanges();
    },
    error: () => {
      this.toast.error('No se pudo eliminar el cobro.');
      this.cerrarModalEliminar();
    },
  });
}
onPerfilActualizado(data: { nombreUsuario: string; rol: string }): void {
  this.user = data;
}
}