import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { ActiveEventComponent } from './active-event/active-event.component';
import { EventsListComponent } from './events-list/events-list.component';
import { EventsPlayerComponent } from './active-event/events-player/events-player.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EventsListService } from './events-list/services/events-list.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ActiveEventComponent,
    EventsListComponent,
    EventsPlayerComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    NgxChartsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  providers: [EventsListService, DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
