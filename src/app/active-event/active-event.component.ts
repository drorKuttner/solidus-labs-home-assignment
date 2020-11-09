import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActiveEventService } from './services/active-event.service';
import { IEvent } from '../models/event.model';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ChartData } from './models/chart-data.model';
import * as moment from 'moment';
import { ChartsLimits } from './models/chartsLimits.model';
import { EventsListService } from '../events-list/services/events-list.service';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-active-event',
  templateUrl: './active-event.component.html',
  styleUrls: ['./active-event.component.scss'],
})
export class ActiveEventComponent implements OnInit, OnDestroy {
  public activeEvent: Observable<IEvent>;

  // names and values of bars
  public chartData: BehaviorSubject<ChartData[]>;

  //  graph range (min and max of y axis values)
  public chartLimits: BehaviorSubject<ChartsLimits>;

  public chartColorScheme: any;

  // for making it responsive
  public chartWidth: number;

  public numberOfEvents: number;

  @ViewChild('chart') public chart;

  private activeEventSubscription: Subscription;
  private numberOfEventsSubscription: Subscription;

  constructor(
    private activeEventService: ActiveEventService,
    private eventsListService: EventsListService
  ) {
    this.chartColorScheme = {
      domain: ['#e6ebe0', '#ed6a5a', '#e6ebe0', '#e6ebe0'],
    };
    this.chartData = new BehaviorSubject<ChartData[]>([]);
    this.chartLimits = new BehaviorSubject<ChartsLimits>({
      min: this.eventsListService.getMinPrice(),
      max: this.eventsListService.getMaxPrice(),
    });
    this.chartWidth = Math.min(0.7 * window.innerWidth, 500);
  }

  public ngOnInit(): void {
    this.activeEvent = this.activeEventService.activeEvent;

    // I used here Swimlane ngx chart library
    // this subscription is responsible for updating chart data - first graph range and then the bars
    // it piped in this specific order since updating the bars value renders the component

    this.activeEventSubscription = this.activeEvent
      .pipe(
        filter((event: IEvent) => !!event),
        map((event: IEvent) => {
          this.chart.yScaleMin =
            Math.min(
              Number(event.price),
              event.previous
                ? Number(event.previous.price)
                : Number(event.price),
              event.next ? Number(event.next.price) : Number(event.price)
            ) - 50;

          this.chart.yScaleMax =
            Math.max(
              Number(event.price),
              event.previous
                ? Number(event.previous.price)
                : Number(event.price),
              event.next ? Number(event.next.price) : Number(event.price)
            ) + 50;
          return event;
        })
      )
      .subscribe((event: IEvent) => {
        const chartData = [
          {
            name: 'Active: ' + moment(event.timestamp).format('h:mm:ss'),
            value: Number(event.price),
          },
        ];
        if (event.previous) {
          chartData.unshift({
            name:
              'Prev.: ' + moment(event.previous.timestamp).format('h:mm:ss'),
            value: Number(event.previous.price),
          });
        }
        if (event.next) {
          chartData.push({
            name: 'Next: ' + moment(event.next.timestamp).format('h:mm:ss'),
            value: Number(event.next.price),
          });
        }
        this.chartData.next(chartData);
      });

    this.numberOfEventsSubscription = this.eventsListService.filteredEventsList.subscribe(
      (events: IEvent[]) => {
        this.numberOfEvents = events.length;
      }
    );
  }

  public ngOnDestroy(): void {
    if (!!this.activeEventSubscription) {
      this.activeEventSubscription.unsubscribe();
    }

    if (!!this.numberOfEventsSubscription) {
      this.numberOfEventsSubscription.unsubscribe();
    }
  }
}
