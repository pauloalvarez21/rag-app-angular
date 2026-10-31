import { httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api.config';
import {
  Document,
  DocumentsResponse,
  UploadDocumentResponse,
} from '../../../core/models/document.model';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { errorMessage } from '../../../core/utils/error-message';

@Injectable({ providedIn: 'root' })
export class DocumentsStore {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);
  private readonly baseUrl = inject(API_BASE_URL).replace(/\/+$/, '');

  private readonly resource = httpResource<DocumentsResponse>(() => `${this.baseUrl}/documents`, {
    defaultValue: { documents: [] },
  });

  readonly documents = computed<Document[]>(() => this.resource.value().documents);
  readonly count = computed(() => this.documents().length);
  readonly loading = this.resource.isLoading;
  readonly loadingFirst = computed(() => this.resource.isLoading() && this.count() === 0);
  readonly loadError = computed<string | null>(() => {
    const error = this.resource.error();
    return error ? errorMessage(error, 'No se pudieron cargar los documentos.') : null;
  });

  readonly uploading = signal(false);

  reload(): void {
    this.resource.reload();
  }

  async upload(file: File): Promise<UploadDocumentResponse | null> {
    if (this.uploading()) {
      return null;
    }

    this.uploading.set(true);

    try {
      const result = await firstValueFrom(this.api.uploadDocument(file));
      const detail = result.chunks
        ? `${result.message} · ${result.chunks} fragmentos indexados.`
        : result.message;

      this.toast.success(detail);
      this.resource.reload();
      return result;
    } catch (error) {
      this.toast.error(errorMessage(error, 'No se pudo subir el PDF.'));
      return null;
    } finally {
      this.uploading.set(false);
    }
  }

  async copyId(id: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(id);
      this.toast.info('ID del documento copiado.');
    } catch {
      this.toast.error('No se pudo copiar el ID.');
    }
  }
}
