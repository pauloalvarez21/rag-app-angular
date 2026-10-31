import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('lists documents', async () => {
    const promise = firstValueFrom(service.listDocuments());
    const request = httpMock.expectOne('/api/documents');

    expect(request.request.method).toBe('GET');
    request.flush({ documents: [] });

    await expect(promise).resolves.toEqual({ documents: [] });
  });

  it('uploads a document as multipart form data', async () => {
    const file = new File(['contenido'], 'contrato.pdf', { type: 'application/pdf' });
    const promise = firstValueFrom(service.uploadDocument(file));
    const request = httpMock.expectOne('/api/documents/upload');

    expect(request.request.method).toBe('POST');
    expect(request.request.body instanceof FormData).toBe(true);
    expect((request.request.body as FormData).get('file')).toBeInstanceOf(File);

    request.flush({ message: 'Subido', documentId: 'doc-1', chunks: 4 });

    await expect(promise).resolves.toEqual({
      message: 'Subido',
      documentId: 'doc-1',
      chunks: 4,
    });
  });

  it('asks a question', async () => {
    const promise = firstValueFrom(service.askQuestion('¿Qué es el contrato?'));
    const request = httpMock.expectOne('/api/rag/ask');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ question: '¿Qué es el contrato?' });

    request.flush({ answer: 'Un acuerdo.', sources: ['contrato.pdf'] });

    await expect(promise).resolves.toEqual({
      answer: 'Un acuerdo.',
      sources: ['contrato.pdf'],
    });
  });
});
