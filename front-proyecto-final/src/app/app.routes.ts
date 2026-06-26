import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../features/auth/login/pages/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('../features/dashboard/pages/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'pacientes',
    loadComponent: () =>
      import('../features/pacientes/pages/pacientes.component').then(m => m.PacientesComponent),
    canActivate: [authGuard],
  },
  {
    path: 'pacientes/:id',
    loadComponent: () =>
      import('../features/pacientes/pages/paciente-detalle.component').then(m => m.PacienteDetalleComponent),
    canActivate: [authGuard],
  },
  {
    path: 'historial-clinica',
    loadComponent: () =>
      import('../features/historia clinica/pages/historial.component').then(m => m.HistorialComponent),
    canActivate: [authGuard],
  },
  {
    path: 'historial-clinica/:pacienteId/odontograma',
    loadComponent: () =>
      import('../features/historia clinica/pages/odontograma.component').then(m => m.OdontogramaComponent),
    canActivate: [authGuard],
  },
  {
    path: 'historial-clinica/:pacienteId/nueva-atencion/:tratamientoId',
    loadComponent: () =>
      import('../features/historia clinica/pages/nueva-atencion.component').then(m => m.NuevaAtencionComponent),
    canActivate: [authGuard],
  },
  {
    path: 'historial-clinica/:pacienteId/nueva-atencion',
    loadComponent: () =>
      import('../features/historia clinica/pages/nueva-atencion.component').then(m => m.NuevaAtencionComponent),
    canActivate: [authGuard],
  },
  {
    path: 'historial-clinica/:pacienteId',
    loadComponent: () =>
      import('../features/historia clinica/pages/historial-paciente.component').then(m => m.HistorialPacienteComponent),
    canActivate: [authGuard],
  },
  {
  path: 'calendario',
  loadComponent: () =>
    import('../features/calendario/pages/calendario.component').then(m => m.CalendarioComponent),
  canActivate: [authGuard],
},
{
  path: 'cobros',
  loadComponent: () =>
    import('../features/cobros/pages/cobros.component').then(m => m.CobrosComponent),
  canActivate: [authGuard],
},
{
  path: 'usuarios',
  loadComponent: () =>
    import('../features/usuarios/pages/usuarios.component').then(m => m.UsuariosComponent),
  canActivate: [authGuard],
},
  {
    path: '**',
    redirectTo: 'login',
  },
];