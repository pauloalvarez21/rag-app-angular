export interface Document {
  id: string;
  filename: string;
  filepath: string;
  uploaded_at: string;
}

export interface DocumentsResponse {
  documents: Document[];
}

export interface UploadDocumentResponse {
  message: string;
  documentId: string;
  chunks: number;
}
