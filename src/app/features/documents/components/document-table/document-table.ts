import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Document } from '../../../../core/models/document.model';
import { Icon } from '../../../../shared/ui/icon/icon';

@Component({
  selector: 'app-document-table',
  imports: [DatePipe, Icon],
  templateUrl: './document-table.html',
  styleUrl: './document-table.css',
})
export class DocumentTable {
  readonly documents = input.required<Document[]>();
  readonly copyId = output<string>();

  protected shortId(id: string): string {
    return id.length > 12 ? `${id.slice(0, 6)}…${id.slice(-4)}` : id;
  }
}
