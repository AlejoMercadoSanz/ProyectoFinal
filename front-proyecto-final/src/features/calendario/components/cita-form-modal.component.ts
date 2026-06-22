import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from '../../pacientes/services/paciente.service';
import { Paciente } from '../../pacientes/models/paciente.model';
import { Cita } from '../models/cita.model';

@Component({
  selector: 'app-cita-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cita-form-modal.component.html',
  styleUrls: ['./cita-form-modal.component.css'],
})
export class CitaFormModalComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() isSubmitting = false;
  @Input() citaEditar: Cita | null = null;
  @Input() fechaPreseleccionada: Date | null = null;
  @Input() horaPreseleccionada: string | null = null;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<any>();
  @Output() eliminar = new EventEmitter<void>();

  form: FormGroup;
  pacientes: Paciente[] = [];
  buscandoPacientes = false;

  tiposTratamiento = [
    'Consulta', 'Limpieza', 'Endodoncia', 'Profilaxis', 'Extracción',
    'Ortodoncia', 'Implante', 'Blanqueamiento', 'Restauración', 'Control',
  ];

  get esEdicion(): boolean {
    return !!this.citaEditar;
  }

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
  ) {
    this.form = this.fb.group({
      pacienteId: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      duracionMinutos: [30, Validators.required],
      tipoTratamiento: ['', Validators.required],
      estado: ['Confirmada', Validators.required],
      notas: [''],
    });
  }

  ngOnInit(): void {
    this.cargarPacientes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && changes['visible'].currentValue === true) {
      if (this.citaEditar) {
        const fecha = new Date(this.citaEditar.fechaHora);
        this.form.patchValue({
          pacienteId: this.citaEditar.pacienteId,
          fecha: this.formatDateForInput(fecha),
          hora: fecha.toTimeString().slice(0, 5),
          duracionMinutos: this.citaEditar.duracionMinutos,
          tipoTratamiento: this.citaEditar.tipoTratamiento,
          estado: this.citaEditar.estado,
          notas: this.citaEditar.notas,
        });
      } else {
        const fechaBase = this.fechaPreseleccionada ?? new Date();
        this.form.reset({
          pacienteId: '',
          fecha: this.formatDateForInput(fechaBase),
          hora: this.horaPreseleccionada ?? '09:00',
          duracionMinutos: 30,
          tipoTratamiento: '',
          estado: 'Confirmada',
          notas: '',
        });
      }
    }
  }

  private formatDateForInput(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  cargarPacientes(): void {
    this.buscandoPacientes = true;
    this.pacienteService.getAll().subscribe({
      next: (data) => {
        this.pacientes = data;
        this.buscandoPacientes = false;
      },
      error: () => {
        this.buscandoPacientes = false;
      },
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onGuardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { fecha, hora, ...resto } = this.form.value;
    const fechaHora = `${fecha}T${hora}:00`;

    this.guardar.emit({
      ...resto,
      pacienteId: Number(resto.pacienteId),
      fechaHora,
    });
  }

  onCerrar(): void {
    this.cerrar.emit();
  }

  onEliminar(): void {
    this.eliminar.emit();
  }
}