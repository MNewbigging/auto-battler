/**
 * Responsible for scheduling/triggering animations during a game, provides
 * callbacks when a set of scheduled animations have finished.
 *
 * Need to be able to schedule:
 * - animations that should run in parallel
 * - animations that should run in sequence
 *
 * Cannot pass the property to flip here, because it would be passed by value.
 *
 * Therefore this class is mostly just a scheduler, firing callbacks on start and end
 * for the consumer to flip any props that the animation requires.
 */

import { createId } from "../utils/utils";

export interface AnimationEvent {
  id: string; // id of this event, to be passed in onAnimEnd by component
  onStart: () => void; // called just before the animation property is flipped
  onEnd: () => void; // called when this event is finished
}

export interface AnimationEventGroup {
  id: string;
  events: AnimationEvent[];
  onGroupEnd?: () => void;
}

export class AnimationManager {
  events: AnimationEvent[] = [];
  eventGroups: AnimationEventGroup[] = [];
  animating = false;

  private onGroupEnd?: () => void;

  playAnimation(event: AnimationEvent) {
    // Add the event to the queue
    this.events.push(event);

    // If not currently animating an earlier scheduled event, start this immediately
    if (!this.animating) {
      this.nextEvent();
    }
  }

  playParallelAnimations(events: AnimationEvent[], onGroupEnd?: () => void) {
    // Add a group for these events
    this.eventGroups.push({
      id: createId(),
      events,
      onGroupEnd,
    });

    // These all start immediately (but should this wait for previous events to be done?)
  }

  // Comes from the react component onAnimationEnd for a particular object property
  onAnimationEnd(objectId: string) {
    // Find the event for this object id
    const event = this.events.find((e) => e.id === objectId);
    if (!event) {
      console.log("could not find animation event for ", objectId);
      return;
    }

    // Fire onEnd callbacks
    event.onEnd();

    // Remove the event
    this.events = this.events.filter((e) => e.id === objectId);

    // Go to next scheduled animation
    this.nextEvent();
  }

  nextEvent() {
    if (!this.events.length) {
      // No longer animating
      this.animating = false;

      // All events finished, fire callback if set then clear it
      this.onGroupEnd?.();
      this.onGroupEnd = undefined;

      return;
    }

    // Now animating
    this.animating = true;

    // Get the next event to fire (FIFO)
    const event = this.events[0];

    // Start it
    event.onStart();
  }
}
