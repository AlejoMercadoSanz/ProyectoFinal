import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TratamientoService } from '../services/tratamiento.service';
import { PacienteService } from '../../pacientes/services/paciente.service';
import { Paciente } from '../../pacientes/models/paciente.model';
import { AuthService } from '../../auth/login/services/auth.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { environment } from '../../../enviroments/environment';

@Component({
  selector: 'app-nueva-atencion',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './nueva-atencion.component.html',
  styleUrls: ['./nueva-atencion.component.css'],
})
export class NuevaAtencionComponent implements OnInit {
  paciente: Paciente | null = null;
  pacienteId!: number;
  tratamientoId: number | null = null;
  isLoading = true;
  isSubmitting = false;
  user: { nombreUsuario: string; rol: string } | null = null;

  adjuntosSeleccionados: File[] = [];
  adjuntosPreview: { nombre: string; tipo: string; url?: string }[] = [];

  form: FormGroup;

  tiposTratamiento = [
    'Endodoncia', 'Profilaxis', 'Extracción', 'Ortodoncia',
    'Implante', 'Blanqueamiento', 'Restauración', 'Periodoncia',
    'Cirugía Oral', 'Otro',
  ];

  atajosRapidos = [
    'Sin complicaciones',
    'Requiere seguimiento',
    'Sangrado leve',
    'Receta emitida',
    'Derivado a especialista',
    'Control en 7 días',
  ];

  get esEdicion(): boolean {
    return this.tratamientoId !== null;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private tratamientoService: TratamientoService,
    private pacienteService: PacienteService,
    private authService: AuthService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.user = this.authService.getUser();
    this.form = this.fb.group({
      tipo: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(3)]],
      notasClinicas: [''],
      estado: ['Completado', Validators.required],
      fecha: [new Date().toISOString().split('T')[0], Validators.required],
      dienteAfectado: [''],
    });
  }

  ngOnInit(): void {
    this.pacienteId = Number(this.route.snapshot.paramMap.get('pacienteId'));
    if (!this.pacienteId) {
      this.router.navigate(['/historial-clinica']);
      return;
    }

    const tratamientoIdParam = this.route.snapshot.paramMap.get('tratamientoId');
    this.tratamientoId = tratamientoIdParam ? Number(tratamientoIdParam) : null;

    const dienteQueryParam = this.route.snapshot.queryParamMap.get('diente');
    if (dienteQueryParam) {
      this.form.get('dienteAfectado')?.setValue(dienteQueryParam);
    }

    this.pacienteService.getById(this.pacienteId).subscribe({
      next: (paciente) => {
        this.paciente = paciente;

        if (this.esEdicion) {
          this.cargarTratamientoExistente();
        } else {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.toast.error('No se pudo cargar el paciente.');
        this.router.navigate(['/historial-clinica']);
      },
    });
  }

  cargarTratamientoExistente(): void {
    this.tratamientoService.getById(this.tratamientoId!).subscribe({
      next: (tratamiento) => {
        console.log('Tratamiento cargado:', tratamiento);
        this.form.patchValue({
          tipo: tratamiento.tipo,
          descripcion: tratamiento.descripcion,
          notasClinicas: tratamiento.notasClinicas,
          estado: tratamiento.estado,
          fecha: tratamiento.fecha.split('T')[0],
          dienteAfectado: tratamiento.dienteAfectado,
        });

        if (tratamiento.adjuntos && tratamiento.adjuntos.length > 0) {
          this.adjuntosPreview = tratamiento.adjuntos.map(a => ({
            nombre: a.nombreArchivo,
            tipo: a.tipoArchivo,
            url: a.tipoArchivo.startsWith('image/') ? `${environment.apiUrl.replace('/api', '')}/${a.rutaArchivo}` : undefined,
          }));
        }

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('No se pudo cargar el tratamiento.');
        this.router.navigate(['/historial-clinica', this.pacienteId]);
      },
    });
  }

  getInitials(nombre: string, apellido: string): string {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  agregarAtajo(atajo: string): void {
    const notas = this.form.get('notasClinicas')?.value ?? '';
    const nuevoValor = notas ? `${notas}\n+ ${atajo}` : `+ ${atajo}`;
    this.form.get('notasClinicas')?.setValue(nuevoValor);
  }

  irAlOdontograma(): void {
    this.router.navigate(
      ['/historial-clinica', this.pacienteId, 'odontograma'],
      { queryParams: { diente: this.form.get('dienteAfectado')?.value } }
    );
  }

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach(file => {
      this.adjuntosSeleccionados.push(file);
      const preview: { nombre: string; tipo: string; url?: string } = {
        nombre: file.name,
        tipo: file.type,
      };
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          preview.url = e.target?.result as string;
          this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
      }
      this.adjuntosPreview.push(preview);
    });
  }

  eliminarAdjunto(index: number): void {
    this.adjuntosSeleccionados.splice(index, 1);
    this.adjuntosPreview.splice(index, 1);
  }

  async guardarAtencion(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.warning('Completá todos los campos requeridos.');
      return;
    }

    this.isSubmitting = true;

    const request = {
      ...this.form.value,
      pacienteId: this.pacienteId,
    };

    if (this.esEdicion) {
      this.tratamientoService.update(this.tratamientoId!, request).subscribe({
        next: async () => {
          if (this.adjuntosSeleccionados.length > 0) {
            for (const archivo of this.adjuntosSeleccionados) {
              await this.tratamientoService.subirAdjunto(this.tratamientoId!, archivo).toPromise();
            }
          }
          this.toast.success('Atención actualizada correctamente.');
          this.isSubmitting = false;
          this.router.navigate(['/historial-clinica', this.pacienteId]);
        },
        error: () => {
          this.toast.error('No se pudo actualizar la atención.');
          this.isSubmitting = false;
        },
      });
    } else {
      this.tratamientoService.create(request).subscribe({
        next: async (tratamiento) => {
          if (this.adjuntosSeleccionados.length > 0) {
            for (const archivo of this.adjuntosSeleccionados) {
              await this.tratamientoService.subirAdjunto(tratamiento.id, archivo).toPromise();
            }
          }
          this.toast.success('Atención registrada correctamente.');
          this.isSubmitting = false;
          this.router.navigate(['/historial-clinica', this.pacienteId]);
        },
        error: () => {
          this.toast.error('No se pudo guardar la atención.');
          this.isSubmitting = false;
        },
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/historial-clinica', this.pacienteId]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  verAdjunto(adj: { nombre: string; tipo: string; url?: string }): void {
  if (adj.url) {
    window.open(adj.url, '_blank');
  }
}
}