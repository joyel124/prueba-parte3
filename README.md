# Mini‑proyecto (Parte 3): Gestión de Expedientes — Next.js + AWS Amplify (Cognito + Data)

Este mini‑proyecto implementa **autenticación** y un **CRUD de expedientes (casos)** con Next.js 14+ y TypeScript.
La autenticación se resuelve con **AWS Cognito** usando `@aws-amplify/ui-react` y el backend de datos con **Amplify Gen 2 (Data)**.
El módulo de expedientes incluye formulario de alta/edición, listado en tabla y eliminación con confirmación. La UI muestra
**estados de carga**, **validaciones** y **toasts** (éxito/error).

---

## Stack
- **Next.js 14+** (App Router) + **TypeScript**
- **AWS Amplify (Gen 2)**: Cognito (Auth) + Data (modelo `Case`)
- **@aws-amplify/ui-react** (`<Authenticator />`)
- **shadcn/ui**, **TailwindCSS**, **lucide-react** (iconos), **sonner** (toasts)

---

## Requisitos
- **Node.js 18+** y **npm**
- Cuenta AWS con permisos para usar **Amplify**, **Cognito**, **AppSync**, **SSM**, **S3** y **CloudFormation** (si usas Amplify)
- Un **perfil AWS** válido si vas a usar Amplify Sandbox (ver más abajo)

---

## Estructura
```
/app
  /cases
    page.tsx                 # Página con <Authenticator> + <CasesScreen/>
  amplifyClient.ts           # Configuración de Amplify (carga amplify_outputs.json)
/amplify                     # Definición del backend de Amplify Gen 2 (Data/Auth)
/components/ui               # shadcn/ui
/amplify_outputs.json        # Config (se genera con sandbox)
README.md
```

---

## Modelo de datos (`Case`)
- **id** (string, autogenerado por el backend)
- **nombre** (string, requerido)
- **descripcion** (string, requerido)
- **estado** (string, requerido) — valores usados por la UI: `abierto`, `en_proceso`, `cerrado`

---

## Puesta en marcha (con Amplify)

> Estos pasos generan el archivo **`amplify_outputs.json`** que el front necesita para conectarse a Auth/Data.

1) **Configura un perfil AWS (una sola vez)**  
   Crea un usuario IAM con Access Keys. Luego:
   ```bash
   npx ampx configure profile
   ```

2) **Arranca el Sandbox de Amplify en este repo**  
   En la raíz del proyecto (donde está la carpeta `amplify/`):
   ```bash
   npx ampx sandbox
   ```
   Esto desplegará el backend “de prueba” y generará/actualizará **`amplify_outputs.json`** en el directorio actual.

3) **Instala dependencias y ejecuta el front:**
   ```bash
   npm install
   npm run dev
   ```
   Abre `http://localhost:3000` y verás la pantalla de login de Cognito. Tras iniciar sesión, se mostrará el CRUD.

### Configuración de Amplify en el front
Asegúrate de tener `app/amplifyClient.ts` con algo como:
```ts
// app/amplifyClient.ts
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);
```

Y en la página del CRUD, importa ese módulo **una sola vez** (antes de usar `Authenticator` o `generateClient`):
```ts
import '../app/amplifyClient';
```

> Si modificas el backend (modelo/autorization), vuelve a ejecutar el sandbox para regenerar `amplify_outputs.json`.

---

## Uso del CRUD
- **Crear**: botón *“Nuevo expediente”* → completa **nombre**, **descripción**, **estado** → **Crear**
- **Editar**: botón **Editar** en la tabla → modifica los campos → **Guardar**
- **Eliminar**: botón **Eliminar** → confirmación en modal → se elimina el registro
- **Feedback**: toasts de éxito/error y spinners de carga
- **Labels** de estado: la UI muestra “Abierto / En proceso / Cerrado”


---

## Scripts útiles
```bash
npm run dev        # desarrollo
npm run build      # build de producción
```

---

## Despliegue
- **Amplify Hosting**: conecta tu repo en Amplify Console y configura build (Next.js). El backend (Auth/Data) puede apuntar al stack de Sandbox o a un entorno dedicado.
- **Vercel/Netlify**: si usas Amplify solo para datos, basta con que incluyas `amplify_outputs.json` en el build y configures las variables de entorno necesarias si cambias rutas.
