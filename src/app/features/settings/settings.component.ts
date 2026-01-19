import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold text-slate-800 mb-4">Settings</h1>
      <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-slate-500">
        System settings and profile management will be implemented here.
      </div>
    </div>
  `
})
export class SettingsComponent {}
