import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Document } from '../../../core/models/document.model';
import { ApiService } from '../../../core/services/api.service';
import { DocumentsStore } from './documents.store';

describe('DocumentsStore', () => {
  let store: DocumentsStore;
  let httpMock: HttpTestingController;
  let uploadDocument: ReturnType<typeof vi.fn>;

  const documents: Document[] = [
    {
      id: 'doc-1',
      filename: 'contrato.pdf',
      filepath: '/tmp/contrato.pdf',
      uploaded_at: '2026-01-01T10:00:00.000Z',
    },
  ];

  beforeEach(() => {
    uploadDocument = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ApiService, useValue: { uploadDocument } },
      ],
    });

    store = TestBed.inject(DocumentsStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads the indexed documents', async () => {
    TestBed.tick();
    const request = httpMock.expectOne('/api/documents');
    expect(request.request.method).toBe('GET');
    request.flush({ documents });

    await TestBed.inject(ApplicationRef).whenStable();

    expect(store.documents()).toEqual(documents);
    expect(store.count()).toBe(1);
    expect(store.loadError()).toBeNull();
  });

  it('uploads a PDF and reloads the list', async () => {
    TestBed.tick();
    httpMock.expectOne('/api/documents').flush({ documents });
    await TestBed.inject(ApplicationRef).whenStable();

    const newDocument: Document = {
      id: 'doc-2',
      filename: 'anexo.pdf',
      filepath: '/tmp/anexo.pdf',
      uploaded_at: '2026-01-02T10:00:00.000Z',
    };
    uploadDocument.mockReturnValue(
      of({ message: 'Documento indexado', documentId: 'doc-2', chunks: 3 }),
    );

    const result = await store.upload(
      new File(['contenido'], 'anexo.pdf', { type: 'application/pdf' }),
    );

    expect(result).toEqual({ message: 'Documento indexado', documentId: 'doc-2', chunks: 3 });
    expect(store.uploading()).toBe(false);

    TestBed.tick();
    httpMock.expectOne('/api/documents').flush({ documents: [...documents, newDocument] });
    await TestBed.inject(ApplicationRef).whenStable();

    expect(store.count()).toBe(2);
    expect(store.documents()[1].filename).toBe('anexo.pdf');
  });

  it('returns null when the upload fails', async () => {
    TestBed.tick();
    httpMock.expectOne('/api/documents').flush({ documents });
    await TestBed.inject(ApplicationRef).whenStable();

    uploadDocument.mockReturnValue(throwError(() => new Error('No se pudo indexar')));

    const result = await store.upload(
      new File(['contenido'], 'anexo.pdf', { type: 'application/pdf' }),
    );

    expect(result).toBeNull();
    expect(store.uploading()).toBe(false);
  });
});
