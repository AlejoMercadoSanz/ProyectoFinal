import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkeletonVariant = 'text' | 'title' | 'avatar' | 'card' | 'table-row' | 'rect';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.css'],
})
export class SkeletonComponent {
  @Input() variant: SkeletonVariant = 'text';
  @Input() rows: number = 1;
  @Input() width?: string;
  @Input() height?: string;

  get rowArray(): number[] {
    return Array(this.rows).fill(0);
  }
}