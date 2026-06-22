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

const DRAFT_KEY = 'odontogestpro_nueva_atencion_draft';

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
  adjuntosPreview: { nombre: string; tipo: string; url?: string; adjuntoId?: number }[] = [];
  adjuntosAEliminar: number[] = [];

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

  get dientesParseados(): { numero: string; estado: string }[] {
    const valor = this.form.get('dienteAfectado')?.value ?? '';
    if (!valor) return [];
    return valor.split(',').map((par: string) => {
      const [numero, estado] = par.split(':');
      return { numero, estado: estado ?? 'seleccionado' };
    });
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'caries': return 'Caries';
      case 'tratado': return 'Tratado';
      case 'seleccionado': return 'Seleccionado';
      default: return estado;
    }
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

    const draft = this.cargarBorrador();
    const dienteQueryParam = this.route.snapshot.queryParamMap.get('diente');

    this.pacienteService.getById(this.pacienteId).subscribe({
      next: (paciente) => {
        this.paciente = paciente;

        if (draft) {
          this.form.patchValue(draft.formValue);
          if (dienteQueryParam) {
            this.form.get('dienteAfectado')?.setValue(dienteQueryParam);
          }
          this.adjuntosPreview = draft.adjuntosPreview ?? [];
          this.isLoading = false;
          this.cdr.detectChanges();
        } else if (this.esEdicion) {
          this.cargarTratamientoExistente(dienteQueryParam);
        } else {
          if (dienteQueryParam) {
            this.form.get('dienteAfectado')?.setValue(dienteQueryParam);
          }
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

  cargarTratamientoExistente(dienteQueryParam?: string | null): void {
    this.tratamientoService.getById(this.tratamientoId!).subscribe({
      next: (tratamiento) => {
        this.form.patchValue({
          tipo: tratamiento.tipo,
          descripcion: tratamiento.descripcion,
          notasClinicas: tratamiento.notasClinicas,
          estado: tratamiento.estado,
          fecha: tratamiento.fecha.split('T')[0],
          dienteAfectado: dienteQueryParam ?? tratamiento.dienteAfectado,
        });

        if (tratamiento.adjuntos && tratamiento.adjuntos.length > 0) {
          this.adjuntosPreview = tratamiento.adjuntos.map(a => ({
            nombre: a.nombreArchivo,
            tipo: a.tipoArchivo,
            url: a.tipoArchivo.startsWith('image/') ? `${environment.apiUrl.replace('/api', '')}/${a.rutaArchivo}` : undefined,
            adjuntoId: a.id,
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
    this.guardarBorrador();
    const queryParams: any = { diente: this.form.get('dienteAfectado')?.value };
    if (this.esEdicion) {
      queryParams.tratamientoId = this.tratamientoId;
    }
    this.router.navigate(
      ['/historial-clinica', this.pacienteId, 'odontograma'],
      { queryParams }
    );
  }

  guardarBorrador(): void {
    const draft = {
      formValue: this.form.value,
      adjuntosPreview: this.adjuntosPreview.filter(a => !!a.adjuntoId || !!a.url),
    };
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }

  cargarBorrador(): { formValue: any; adjuntosPreview: any[] } | null {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(DRAFT_KEY);
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
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
  const adjunto = this.adjuntosPreview[index];

  if (adjunto.adjuntoId) {
    this.adjuntosAEliminar.push(adjunto.adjuntoId);
  } else {
    const fileIndex = this.adjuntosSeleccionados.findIndex(f => f.name === adjunto.nombre);
    if (fileIndex !== -1) this.adjuntosSeleccionados.splice(fileIndex, 1);
  }

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
          for (const adjuntoId of this.adjuntosAEliminar) {
            await this.tratamientoService.eliminarAdjunto(this.tratamientoId!, adjuntoId).toPromise();
          }
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