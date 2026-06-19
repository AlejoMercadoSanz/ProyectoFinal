import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-delete-modal.component.html',
  styleUrls: ['./confirm-delete-modal.component.css'],
})
export class ConfirmDeleteModalComponent {
  @Input() visible = false;
  @Input() titulo = 'Confirmar Eliminación';
  @Input() mensaje = '¿Estás seguro de que querés eliminar este elemento?';
  @Input() subtitulo = 'Esta acción no se puede deshacer.';
  @Output() cerrar = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<void>();

  onCerrar(): void {
    this.cerrar.emit();
  }

  onConfirmar(): void {
    this.confirmar.emit();
  }
}