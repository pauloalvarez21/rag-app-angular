import { Pipe, PipeTransform } from '@angular/core';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

@Pipe({ name: 'markdown' })
export class MarkdownPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    const html = marked.parse(value, {
      async: false,
      gfm: true,
      breaks: true,
    });

    return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  }
}
