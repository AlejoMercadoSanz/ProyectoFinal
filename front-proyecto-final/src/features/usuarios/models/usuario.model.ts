export interface Usuario {
  id: number;
  nombreUsuario: string;
  email: string;
  rol: string;
  activo: boolean;
}

export interface UsuarioRequest {
  nombreUsuario: string;
  email: string;
  password: string;
  rol: string;
}