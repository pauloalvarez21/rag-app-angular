import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { ConnectionService } from '../services/connection.service';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const connection = inject(ConnectionService);

  return next(request).pipe(
    tap(() => connection.markOnline()),
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 0) {
          connection.markOffline();
        } else {
          connection.markOnline();
        }

        return throwError(() => new Error(extractMessage(error)));
      }

      return throwError(() => error);
    }),
  );
};

function extractMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'No se pudo conectar con el servidor. Verifica que el backend esté en marcha.';
  }

  const body: unknown = error.error;

  if (body && typeof body === 'object' && 'message' in body) {
    const message = (body as { message: unknown }).message;

    if (typeof message === 'string' && message.trim()) {
      return message;
    }

    if (Array.isArray(message)) {
      const details = message.filter((item): item is string => typeof item === 'string');
      if (details.length) {
        return details.join('. ');
      }
    }
  }

  if (typeof body === 'string' && body.trim()) {
    return body;
  }

  if (error.status === 413) {
    return 'El archivo supera el tamaño permitido por el servidor.';
  }

  return `Error del servidor (${error.status}). Inténtalo de nuevo.`;
}
