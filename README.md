# RAG App Angular

Frontend corporativo para un sistema RAG (Retrieval-Augmented Generation) construido con Angular 22. Permite indexar documentos PDF y conversar con ellos a través de un backend NestJS.

## Características

- **Documentos**: listado de PDFs indexados, subida con drag & drop, validación de tipo y tamaño (10 MB), copia del ID y estados de carga/error.
- **Chat**: preguntas al asistente, respuestas en Markdown, chips de fuentes, reintento de la última pregunta fallida, limpieza de conversación y autoscroll.
- **UI**: diseño "Executive Slate" con sidebar/topbar responsive, sistema de tokens CSS, iconos SVG propios, toasts y skeletons.
- **Técnico**: componentes standalone, zoneless, signals, `httpResource`, interceptor de errores y estado de conexión.

## Stack

- Angular 22 (standalone, zoneless, signals)
- TypeScript 6
- Vitest 5 + jsdom
- ESLint 10 + angular-eslint 22 + Prettier
- `marked` + `DOMPurify` para renderizar Markdown de forma segura

## Requisitos

- Node.js 20.19+ (recomendado 22+)
- npm 11+
- Backend NestJS disponible en `http://localhost:3000`

## Puesta en marcha

```bash
npm install
npm start
```

La app queda disponible en `http://localhost:4200/` y redirige las peticiones `/api/*` al backend mediante `proxy.conf.json`:

```json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true,
    "pathRewrite": { "^/api": "" }
  }
}
```

Por tanto, el frontend llama a `/api/documents` y el backend recibe `/documents`.

### Endpoints consumidos

| Método | Endpoint            | Descripción                               |
| ------ | ------------------- | ----------------------------------------- |
| GET    | `/documents`        | Lista los documentos indexados            |
| POST   | `/documents/upload` | Sube un PDF (multipart, campo `file`)     |
| POST   | `/rag/ask`          | Pregunta al RAG con `{ "question": "…" }` |

La URL base se configura con `apiUrl` en `src/environments/environment*.ts` y se inyecta con el token `API_BASE_URL`.

## Scripts

| Comando                  | Descripción                                   |
| ------------------------ | --------------------------------------------- |
| `npm start`              | Servidor de desarrollo con proxy al backend   |
| `npm run build`          | Build de producción en `dist/rag-app-angular` |
| `npm run watch`          | Build en modo development con watch           |
| `npm test`               | Tests unitarios con Vitest                    |
| `npm run lint`           | Análisis estático con ESLint                  |
| `npx prettier --write .` | Formatea el código                            |

Ejecutar la verificación completa antes de publicar:

```bash
npx prettier --check .
npm run lint
npm test -- --watch=false
npm run build
```

## Estructura

```text
src/app
├── core/          # configuración, modelos, servicios e interceptor
├── layout/        # shell, sidebar y topbar
├── shared/        # UI reutilizable, pipes y utilidades
└── features/
    ├── documents/ # store, página y tabla de documentos
    └── chat/      # store, página, burbujas y composer
```

- Los stores usan `signal`/`computed` y `httpResource` para el listado.
- El interceptor normaliza los errores HTTP y actualiza el estado de conexión.
- Las rutas `/documents` y `/chat` se cargan de forma diferida.

## Despliegue

```bash
npm run build
```

Los archivos estáticos quedan en `dist/rag-app-angular/browser`. Sírvelos con cualquier servidor estático y configura un reverse proxy para `/api` y fallback de SPA hacia `index.html`.

Ejemplo con nginx:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

El `/` final en `proxy_pass` elimina el prefijo `/api`, igual que el `pathRewrite` del proxy de desarrollo.

> Si el backend se publica bajo `/api`, elimina la barra final de `proxy_pass` y ajusta `apiUrl` si fuera necesario.

## Solución de problemas

- **Error de conexión en la UI**: comprueba que el backend responde en `http://localhost:3000` y que el proxy está activo.
- **Las rutas dan 404 en producción**: falta el fallback de SPA (`try_files ... /index.html`).
- **PDF rechazado**: solo se aceptan archivos PDF de hasta 10 MB.
