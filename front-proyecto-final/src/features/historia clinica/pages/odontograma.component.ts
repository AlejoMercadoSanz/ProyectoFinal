import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/login/services/auth.service';

export type EstadoCara = 'sano' | 'caries' | 'obturacion';

export interface CarasDiente {
  V: EstadoCara;
  O: EstadoCara;
  L: EstadoCara;
  M: EstadoCara;
  D: EstadoCara;
}

export interface Diente {
  numero: number;
  caras: CarasDiente;
  extraido: 'no' | 'existente' | 'aExtraer';
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
  user: { nombreUsuario: string; rol: string } | null = null;
  dropdownAbierto = false;

  modo: 'adulto' | 'nino' = 'adulto';
  estadoActivo: EstadoCara | 'extraidoExistente' | 'aExtraer' = 'caries';

  estados: { valor: EstadoCara | 'extraidoExistente' | 'aExtraer'; label: string; color: string }[] = [
    { valor: 'sano', label: 'Sano', color: '#ffffff' },
    { valor: 'caries', label: 'A trabajar', color: '#2563eb' },
    { valor: 'obturacion', label: 'Realizado', color: '#dc2626' },
    { valor: 'extraidoExistente', label: 'Extraído', color: '#dc2626' },
    { valor: 'aExtraer', label: 'A extraer', color: '#2563eb' },
  ];

  cuadrante1: Diente[] = [18,17,16,15,14,13,12,11].map(n => this.crearDiente(n));
  cuadrante2: Diente[] = [21,22,23,24,25,26,27,28].map(n => this.crearDiente(n));
  cuadrante3: Diente[] = [31,32,33,34,35,36,37,38].map(n => this.crearDiente(n));
  cuadrante4: Diente[] = [48,47,46,45,44,43,42,41].map(n => this.crearDiente(n));

  cuadrante5: Diente[] = [55,54,53,52,51].map(n => this.crearDiente(n));
  cuadrante6: Diente[] = [61,62,63,64,65].map(n => this.crearDiente(n));
  cuadrante7: Diente[] = [71,72,73,74,75].map(n => this.crearDiente(n));
  cuadrante8: Diente[] = [81,82,83,84,85].map(n => this.crearDiente(n));

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
    const dienteParam = this.route.snapshot.queryParamMap.get('diente') ?? '';
    if (dienteParam) {
      this.parsearDientesDesdeString(dienteParam);
    }
  }

  crearDiente(numero: number): Diente {
    return {
      numero,
      extraido: 'no',
      caras: { V: 'sano', O: 'sano', L: 'sano', M: 'sano', D: 'sano' },
    };
  }

  get todosLosDientesAdulto(): Diente[] {
    return [...this.cuadrante1, ...this.cuadrante2, ...this.cuadrante3, ...this.cuadrante4];
  }

  get todosLosDientesNino(): Diente[] {
    return [...this.cuadrante5, ...this.cuadrante6, ...this.cuadrante7, ...this.cuadrante8];
  }

  get todosLosDientes(): Diente[] {
    return [...this.todosLosDientesAdulto, ...this.todosLosDientesNino];
  }

  get dientesModificados(): Diente[] {
    const dientes = this.modo === 'adulto' ? this.todosLosDientesAdulto : this.todosLosDientesNino;
    return dientes.filter(d =>
      d.extraido !== 'no' ||
      d.caras.V !== 'sano' || d.caras.O !== 'sano' ||
      d.caras.L !== 'sano' || d.caras.M !== 'sano' || d.caras.D !== 'sano'
    );
  }

  cambiarModo(nuevoModo: 'adulto' | 'nino'): void {
    this.modo = nuevoModo;
  }

  parsearDientesDesdeString(str: string): void {
    if (!str) return;

    if (str.startsWith('tipo=')) {
      const [tipoParte, ...resto] = str.split('|');
      this.modo = tipoParte.replace('tipo=', '') as 'adulto' | 'nino';
      str = resto.join('|');
    }

    str.split('|').forEach(parte => {
      if (!parte) return;
      const [numStr, carasStr] = parte.split(':');
      const diente = this.todosLosDientes.find(d => d.numero === Number(numStr));
      if (!diente || !carasStr) return;

      if (carasStr === 'extraido-existente') {
        diente.extraido = 'existente';
        return;
      }
      if (carasStr === 'extraido-aextraer') {
        diente.extraido = 'aExtraer';
        return;
      }

      carasStr.split(',').forEach(caraPar => {
        const [cara, estado] = caraPar.split('=');
        if (cara && estado && diente.caras.hasOwnProperty(cara)) {
          (diente.caras as any)[cara] = estado as EstadoCara;
        }
      });
    });
  }

  generarStringDientes(): string {
    const dientes = this.modo === 'adulto' ? this.todosLosDientesAdulto : this.todosLosDientesNino;
    const modificados = dientes.filter(d =>
      d.extraido !== 'no' ||
      d.caras.V !== 'sano' || d.caras.O !== 'sano' ||
      d.caras.L !== 'sano' || d.caras.M !== 'sano' || d.caras.D !== 'sano'
    );

    const dientesStr = modificados.map(d => {
      if (d.extraido === 'existente') return `${d.numero}:extraido-existente`;
      if (d.extraido === 'aExtraer') return `${d.numero}:extraido-aextraer`;
      const caras = Object.entries(d.caras).map(([c, e]) => `${c}=${e}`).join(',');
      return `${d.numero}:${caras}`;
    }).join('|');

    return dientesStr ? `tipo=${this.modo}|${dientesStr}` : '';
  }

  clickCara(diente: Diente, cara: keyof CarasDiente, event: MouseEvent): void {
    event.preventDefault();
    if (diente.extraido !== 'no') return;
    if (this.estadoActivo === 'extraidoExistente') {
      diente.extraido = 'existente';
      diente.caras = { V: 'sano', O: 'sano', L: 'sano', M: 'sano', D: 'sano' };
      return;
    }
    if (this.estadoActivo === 'aExtraer') {
      diente.extraido = 'aExtraer';
      diente.caras = { V: 'sano', O: 'sano', L: 'sano', M: 'sano', D: 'sano' };
      return;
    }
    diente.caras[cara] = this.estadoActivo as EstadoCara;
  }

  clickCaraDerecha(diente: Diente, cara: keyof CarasDiente, event: MouseEvent): void {
    event.preventDefault();
    if (diente.extraido !== 'no') {
      diente.extraido = 'no';
      return;
    }
    diente.caras[cara] = 'sano';
  }

  getColorCara(estado: EstadoCara): string {
    switch (estado) {
      case 'caries': return '#2563eb';
      case 'obturacion': return '#dc2626';
      default: return '#ffffff';
    }
  }

  private buildRuta(): any[] {
    const ruta: any[] = ['/historial-clinica', this.pacienteId, 'nueva-atencion'];
    if (this.tratamientoId) ruta.push(this.tratamientoId);
    return ruta;
  }

  confirmarSeleccion(): void {
    const valor = this.generarStringDientes();
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