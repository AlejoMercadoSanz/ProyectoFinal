# OdontoGest Pro

Sistema de gestión clínica para consultorios odontológicos desarrollado como Trabajo Final de Grado – Universidad Siglo 21.

---

## Tecnologías utilizadas

### Frontend
- Angular 18 (Standalone Components)
- TypeScript
- CSS puro (sin frameworks de UI)
- Bootstrap (solo grid y utilidades básicas)
- jsPDF + jspdf-autotable (generación de PDF)

### Backend
- .NET 8 (C#)
- Clean Architecture (Domain / Application / Infrastructure / API)
- Entity Framework Core
- JWT (autenticación)
- BCrypt (hash de contraseñas)
- SendGrid SDK (notificaciones por email)

### Base de datos
- SQL Server en Amazon RDS (AWS)

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [Angular CLI](https://angular.io/cli) v18: `npm install -g @angular/cli`
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) o [VS Code](https://code.visualstudio.com/)
- Git

---

## Estructura del proyecto

```
ProyectoFinal/
├── front-proyecto-final/        # Aplicación Angular
└── Back/
    └── src/
        ├── OdontoGestPro.Api/            # Capa de presentación (Controllers)
        ├── OdontoGestPro.Application/    # Casos de uso, DTOs, interfaces
        ├── OdontoGestPro.Domain/         # Entidades del dominio
        └── OdontoGestPro.Infrastructure/ # Repositorios, servicios, EF Core
```

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/AlejoMercadoSanz/ProyectoFinal.git
cd ProyectoFinal
```

### 2. Backend (.NET 8)

```bash
cd Back/src/OdontoGestPro.Api
```

La connection string y las variables de configuración ya están incluidas en `appsettings.json` apuntando a la base de datos en AWS RDS.

Restaurar dependencias y ejecutar:

```bash
dotnet restore
dotnet run
```

La API quedará disponible en `https://localhost:7020` y la documentación Swagger en `https://localhost:7020/swagger`.

### 3. Frontend (Angular)

```bash
cd front-proyecto-final
npm install
ng serve -o
```

La aplicación quedará disponible en `http://localhost:4200`.

---

## Configuración de Email

Las notificaciones por email se envían a través de SendGrid. Para habilitarlas, reemplazar el valor `INSERTAR_API_KEY_AQUI` en `Back/src/OdontoGestPro.Api/appsettings.json`:

```json
"EmailSettings": {
  "SendGridApiKey": "INSERTAR_API_KEY_AQUI",
  "SenderEmail": "tu_email@gmail.com",
  "SenderName": "Nombre del Consultorio"
}
```

> La API Key de SendGrid configurada para este proyecto se encuentra en el documento PDF adjunto junto con el repositorio.

---

## Credenciales de acceso

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin   | admin123   | Admin |

---

## Funcionalidades principales

- Gestión de pacientes (alta, baja, modificación, búsqueda)
- Historia clínica con timeline cronológico
- Odontograma interactivo con 5 caras por diente (adulto y pediátrico)
- Calendario de turnos con vistas mensual y diaria
- Notificaciones automáticas por email (confirmación, modificación y recordatorio de turnos)
- Módulo de cobros con historial de pagos por paciente
- Módulo de finanzas con resumen mensual de ingresos y gastos
- Gestión de usuarios con roles (Admin, Odontólogo, Recepcionista)
- Generación de consentimiento informado en PDF
- Adjuntos de archivos en historia clínica

---

## Autor

**Alejo Miguel Mercado Sanz**  
Universidad Siglo 21 – Ingeniería en Sistemas  
Trabajo Final de Grado – 2026  
Tutor: Jorge Humberto Cassi
