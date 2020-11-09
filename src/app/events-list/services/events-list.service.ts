import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IEvent } from '../../models/event.model';
import { EVENTS } from '../config/events-list.config';

@Injectable()
export class EventsListService {
  // for player (disable player when the table list is not sorted by ascending timestamps)
  public isDefaultSort: BehaviorSubject<boolean>;

  // all events
  private readonly eventsListSubject: BehaviorSubject<IEvent[]>;

  // filtered by status
  private readonly filteredEventsListSubject: BehaviorSubject<IEvent[]>;

  constructor() {
    this.eventsListSubject = new BehaviorSubject<IEvent[]>(EVENTS());
    this.filteredEventsListSubject = new BehaviorSubject<IEvent[]>(EVENTS());
    this.isDefaultSort = new BehaviorSubject<boolean>(true);
  }

  public get eventsList(): Observable<IEvent[]> {
    return this.eventsListSubject.asObservable();
  }

  public get filteredEventsList(): Observable<IEvent[]> {
    return this.filteredEventsListSubject.asObservable();
  }

  public setFilteredEventsList(filteredEvents: IEvent[]): void {
    const indexedFilteredEvents: IEvent[] = filteredEvents.map(
      (event: IEvent, index: number) => {
        return {
          ...event,
          index,
        };
      }
    );
    this.filteredEventsListSubject.next(indexedFilteredEvents);
  }

  // for player (stop on last)
  public get eventListLength(): number {
    return this.filteredEventsListSubject.getValue().length;
  }

  // for player (previous and next buttons)
  public getPreviousEvent(index: number): IEvent {
    return this.filteredEventsListSubject.getValue()[index - 1];
  }

  public getNextEvent(index: number): IEvent {
    return this.filteredEventsListSubject.getValue()[index + 1];
  }

  // for chart bars
  public getMinPrice(): number {
    return Math.min(
      ...this.filteredEventsListSubject
        .getValue()
        .map((event: IEvent) => Number(event.price))
    );
  }

  public getEventByIndex(index: number): IEvent {
    return this.eventsListSubject
      .getValue()
      .find((event: IEvent) => event.index === index);
  }

  public getMaxPrice(): number {
    return Math.max(
      ...this.filteredEventsListSubject
        .getValue()
        .map((event: IEvent) => Number(event.price))
    );
  }
}
