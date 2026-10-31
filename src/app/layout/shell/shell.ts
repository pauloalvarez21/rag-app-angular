import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastHost } from '../../shared/ui/toast-host/toast-host';
import { Sidebar } from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Sidebar, Topbar, ToastHost],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {}
