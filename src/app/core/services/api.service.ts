import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { AskResponse } from '../models/chat.model';
import { DocumentsResponse, UploadDocumentResponse } from '../models/document.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL).replace(/\/+$/, '');

  listDocuments(): Observable<DocumentsResponse> {
    return this.http.get<DocumentsResponse>(`${this.baseUrl}/documents`);
  }

  uploadDocument(file: File): Observable<UploadDocumentResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<UploadDocumentResponse>(`${this.baseUrl}/documents/upload`, formData);
  }

  askQuestion(question: string): Observable<AskResponse> {
    return this.http.post<AskResponse>(`${this.baseUrl}/rag/ask`, { question });
  }
}
