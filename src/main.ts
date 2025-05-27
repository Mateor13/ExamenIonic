import { bootstrapApplication } from '@angular/platform-browser';

import { appRouting } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { IonicModule } from '@ionic/angular';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers:[
    importProvidersFrom(IonicModule.forRoot()),
    appRouting,
    provideHttpClient(),
  ]
});
