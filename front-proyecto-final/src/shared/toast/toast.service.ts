import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  leaving?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts: Toast[] = [];
  toasts$ = new BehaviorSubject<Toast[]>([]);

  private show(message: string, type: ToastType, duration = 4000) {
    const id = crypto.randomUUID();
    this._toasts = [...this._toasts, { id, message, type }];
    this.toasts$.next(this._toasts);
    setTimeout(() => this.dismiss(id), duration);
  }

  success(message: string) { this.show(message, 'success'); }
  error(message: string)   { this.show(message, 'error'); }
  warning(message: string) { this.show(message, 'warning'); }
  info(message: string)    { this.show(message, 'info'); }

  dismiss(id: string) {
    this._toasts = this._toasts.map(t =>
      t.id === id ? { ...t, leaving: true } : t
    );
    this.toasts$.next([...this._toasts]);

    setTimeout(() => {
      this._toasts = this._toasts.filter(t => t.id !== id);
      this.toasts$.next([...this._toasts]);
    }, 180);
  }
}