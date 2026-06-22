import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/login/services/auth.service';

interface Diente {
  numero: number;
  estado: 'sano' | 'seleccionado' | 'caries' | 'tratado';
}

@Component({
  selector: 'app-odontograma',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './odontograma.component.html',
  styleUrls: ['./odontograma.component.css'],
})
export class OdontogramaComponent implements OnInit {
  pacienteId!: number;
  tratamientoId: string | null = null;
  dientePreseleccionado: string = '';
  user: { nombreUsuario: string; rol: string } | null = null;

  cuadrante1: Diente[] = [18,17,16,15,14,13,12,11].map(n => ({ numero: n, estado: 'sano' }));
  cuadrante2: Diente[] = [21,22,23,24,25,26,27,28].map(n => ({ numero: n, estado: 'sano' }));
  cuadrante3: Diente[] = [31,32,33,34,35,36,37,38].map(n => ({ numero: n, estado: 'sano' }));
  cuadrante4: Diente[] = [48,47,46,45,44,43,42,41].map(n => ({ numero: n, estado: 'sano' }));

  leyenda = [
    { estado: 'sano', label: 'Sano', color: '#e2e8f0' },
    { estado: 'seleccionado', label: 'Seleccionado', color: '#2563eb' },
    { estado: 'caries', label: 'Caries / Dañado', color: '#dc2626' },
    { estado: 'tratado', label: 'Tratado / Obturación', color: '#0891b2' },
  ];

  get dientesSeleccionados(): Diente[] {
    return [...this.cuadrante1, ...this.cuadrante2, ...this.cuadrante3, ...this.cuadrante4]
      .filter(d => d.estado !== 'sano');
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    this.pacienteId = Number(this.route.snapshot.paramMap.get('pacienteId'));
    this.tratamientoId = this.route.snapshot.queryParamMap.get('tratamientoId');
    this.dientePreseleccionado = this.route.snapshot.queryParamMap.get('diente') ?? '';

    if (this.dientePreseleccionado) {
      this.dientePreseleccionado.split(',').forEach(par => {
        const [numStr, estadoStr] = par.split(':');
        const diente = this.findDiente(Number(numStr));
        if (diente) {
          diente.estado = (estadoStr as Diente['estado']) ?? 'seleccionado';
        }
      });
    }
  }

  findDiente(numero: number): Diente | undefined {
    return [...this.cuadrante1, ...this.cuadrante2, ...this.cuadrante3, ...this.cuadrante4]
      .find(d => d.numero === numero);
  }

  toggleDiente(diente: Diente): void {
    if (diente.estado === 'sano') {
      diente.estado = 'seleccionado';
    } else if (diente.estado === 'seleccionado') {
      diente.estado = 'caries';
    } else if (diente.estado === 'caries') {
      diente.estado = 'tratado';
    } else {
      diente.estado = 'sano';
    }
  }

  getDienteClass(diente: Diente): string {
    return `diente diente--${diente.estado}`;
  }

  private buildRuta(): any[] {
    const ruta: any[] = ['/historial-clinica', this.pacienteId, 'nueva-atencion'];
    if (this.tratamientoId) {
      ruta.push(this.tratamientoId);
    }
    return ruta;
  }

  confirmarSeleccion(): void {
    const seleccionados = this.dientesSeleccionados;
    const valor = seleccionados.map(d => `${d.numero}:${d.estado}`).join(',');

    this.router.navigate(
      this.buildRuta(),
      { queryParams: valor ? { diente: valor } : {} }
    );
  }

  volver(): void {
    this.router.navigate(this.buildRuta());
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}