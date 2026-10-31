import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'documents',
      },
      {
        path: 'documents',
        title: 'Documentos · RAG Console',
        data: { title: 'Documentos' },
        loadComponent: () =>
          import('./features/documents/pages/documents-page').then((m) => m.DocumentsPage),
      },
      {
        path: 'chat',
        title: 'Chat · RAG Console',
        data: { title: 'Chat' },
        loadComponent: () => import('./features/chat/pages/chat-page').then((m) => m.ChatPage),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
