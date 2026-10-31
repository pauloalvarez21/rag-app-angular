import { Component, inject, signal } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import { Badge } from '../../../shared/ui/badge/badge';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { FileDropzone } from '../../../shared/ui/file-dropzone/file-dropzone';
import { Icon } from '../../../shared/ui/icon/icon';
import { Spinner } from '../../../shared/ui/spinner/spinner';
import { DocumentTable } from '../components/document-table/document-table';
import { DocumentsStore } from '../data/documents.store';

@Component({
  selector: 'app-documents-page',
  imports: [Badge, EmptyState, FileDropzone, Icon, Spinner, DocumentTable],
  templateUrl: './documents-page.html',
  styleUrl: './documents-page.css',
})
export class DocumentsPage {
  private readonly toast = inject(ToastService);
  protected readonly store = inject(DocumentsStore);

  protected readonly selectedFile = signal<File | null>(null);

  protected onFileSelected(file: File): void {
    this.selectedFile.set(file);
  }

  protected onInvalid(message: string): void {
    this.toast.error(message);
  }

  protected clearFile(): void {
    this.selectedFile.set(null);
  }

  protected async upload(): Promise<void> {
    const file = this.selectedFile();

    if (!file) {
      return;
    }

    const result = await this.store.upload(file);

    if (result) {
      this.selectedFile.set(null);
    }
  }

  protected formatSize(bytes: number): string {
    if (bytes < 1024 * 1024) {
      return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
