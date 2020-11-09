// timestamp, price, status and snapshot are the original fields.
// index field added to iterate easier,
// previous and next are meant to give it double-link list features of access neighbour elements
// - to reduce complexity - (every element can access to its neighbours in O(1) instead of O(n))

export interface IEvent {
  timestamp: number;
  price: string;
  status: string;
  snapshot: {
    BID: Array<string>;
    ASK: Array<string>;
  };
  index: number;
  previous?: IEvent;
  next?: IEvent;
}
