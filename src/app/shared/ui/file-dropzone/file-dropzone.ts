import { Component, input, output, signal } from '@angular/core';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-file-dropzone',
  imports: [Icon],
  templateUrl: './file-dropzone.html',
  styleUrl: './file-dropzone.css',
})
export class FileDropzone {
  readonly accept = input('.pdf,application/pdf');
  readonly maxSizeMb = input(10);
  readonly disabled = input(false);

  readonly fileSelected = output<File>();
  readonly fileRejected = output<string>();

  protected readonly dragging = signal(false);

  protected openPicker(picker: HTMLInputElement): void {
    if (this.disabled()) {
      return;
    }

    picker.click();
  }

  protected onPick(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.emitFile(file);
    }

    input.value = '';
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();

    if (!this.disabled()) {
      this.dragging.set(true);
    }
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);

    if (this.disabled()) {
      return;
    }

    const file = event.dataTransfer?.files?.[0];

    if (file) {
      this.emitFile(file);
    }
  }

  private emitFile(file: File): void {
    const error = this.validate(file);

    if (error) {
      this.fileRejected.emit(error);
      return;
    }

    this.fileSelected.emit(file);
  }

  private validate(file: File): string | null {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      return 'Solo se permiten archivos PDF.';
    }

    if (file.size > this.maxSizeMb() * 1024 * 1024) {
      return `El archivo supera el límite de ${this.maxSizeMb()} MB.`;
    }

    return null;
  }
}
