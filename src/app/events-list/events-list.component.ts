import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { EventsListService } from './services/events-list.service';
import { EventsTableDataSource } from './models/events-table-data-source.model';
import { IEvent } from '../models/event.model';
import { DatePipe } from '@angular/common';
import { combineLatest, Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { EventStatusFilter } from '../models/event-status-filter.type';
import { ActiveEventService } from '../active-event/services/active-event.service';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss'],
})
export class EventsListComponent implements OnInit, AfterViewInit, OnDestroy {
  public displayedColumns: string[];
  public dataSource: MatTableDataSource<EventsTableDataSource>;
  public statusControl: FormControl;

  @ViewChild(MatPaginator) public paginator: MatPaginator;
  @ViewChild(MatSort) public sort: MatSort;

  private eventsListSubscription: Subscription;

  constructor(
    private eventsListService: EventsListService,
    private activeEventService: ActiveEventService,
    private datePipe: DatePipe
  ) {
    this.statusControl = new FormControl('ALL', Validators.required);
    this.displayedColumns = [
      'timestamp',
      'parsedTime',
      'price',
      'status',
      'setEvent',
    ];
    this.dataSource = new MatTableDataSource([]);
  }

  public ngOnInit(): void {
    // map the events list to fit mat-table input
    this.eventsListSubscription = combineLatest([
      this.statusControl.valueChanges.pipe(startWith('ALL')),
      this.eventsListService.eventsList,
    ])
      .pipe(
        map((res: [EventStatusFilter, IEvent[]]) => {
          const statusFilter = res[0];
          const events = res[1];
          return events.filter((event: IEvent) => {
            return (
              event.status === (statusFilter as string) ||
              statusFilter === 'ALL'
            );
          });
        })
      )
      .subscribe((filteredEventsList: IEvent[]) => {
        this.eventsListService.setFilteredEventsList(filteredEventsList);
        this.dataSource.data = filteredEventsList.map((event: IEvent) => {
          return {
            index: event.index,
            status: event.status,
            price: Number(event.price),
            timestamp: event.timestamp,
            parsedTime: this.datePipe.transform(event.timestamp, 'short'),
          };
        });
      });
  }

  public ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public ngOnDestroy(): void {
    if (!!this.eventsListSubscription) {
      this.eventsListSubscription.unsubscribe();
    }
  }

  // for disabling player
  public onSortChange(sort: Sort): void {
    this.eventsListService.isDefaultSort.next(
      sort.active === 'timestamp' && sort.direction === 'asc'
    );
  }

  public setActiveEvent(tableEvent: EventsTableDataSource): void {
    const event: IEvent = this.eventsListService.getEventByIndex(
      tableEvent.index
    );
    this.activeEventService.eventSetByTable.next(event);
  }
}
