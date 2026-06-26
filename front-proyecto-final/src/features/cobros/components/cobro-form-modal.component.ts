import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cobro } from '../models/cobro.model';

@Component({
  selector: 'app-cobro-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cobro-form-modal.component.html',
  styleUrls: ['./cobro-form-modal.component.css'],
})
export class CobroFormModalComponent implements OnChanges {
  @Input() visible = false;
  @Input() cobro: Cobro | null = null;
  @Input() isSubmitting = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<any>();

  modoPagoSeleccionado: 'Efectivo' | 'Tarjeta' | 'Transferencia' = 'Efectivo';
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      concepto: ['', Validators.required],
      fechaProcedimiento: ['', Validators.required],
      monto: [null, [Validators.required, Validators.min(0.01)]],
      estado: ['Pagado', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cobro'] && this.cobro) {
      this.form.patchValue({
        concepto: this.cobro.concepto,
        fechaProcedimiento: this.cobro.fechaProcedimiento.split('T')[0],
        monto: this.cobro.monto,
        estado: this.cobro.estado,
      });
      this.modoPagoSeleccionado = this.cobro.modoPago as any;
    }
  }

  seleccionarModoPago(modo: 'Efectivo' | 'Tarjeta' | 'Transferencia'): void {
    this.modoPagoSeleccionado = modo;
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
    this.guardar.emit({ ...this.form.value, modoPago: this.modoPagoSeleccionado });
  }

  onCerrar(): void {
    this.cerrar.emit();
  }
}