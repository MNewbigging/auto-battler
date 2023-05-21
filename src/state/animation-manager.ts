/**
 * Register ids for any number of animations and a callback onEnd for when they're all done.
 * Every onAnimationEnd from a react component is routed through this class' onAnimationEnd.
 * When all registered ids have called their onAnimEnd, will fire the onEnd callback.
 *
 * There can only be one set of registered ids at any time - registering clears any existing ids.
 */

export type AnimationEndCallback = () => void;

export class AnimationManager {
  // For listening for a group of animations to all finish
  groupAnimationIds: string[] = [];
  onGroupEnd?: AnimationEndCallback;

  // For listening to individual animations
  onceCallbacks = new Map<string, AnimationEndCallback[]>();

  // Once this animation occurs, the callback is fired once and then removed
  onOnce(animationId: string, callback: AnimationEndCallback) {
    const existing = this.onceCallbacks.get(animationId) ?? [];
    existing.push(callback);
    this.onceCallbacks.set(animationId, existing);
  }

  off(animationId: string, callback: AnimationEndCallback) {
    let existing = this.onceCallbacks.get(animationId);
    if (!existing) {
      return;
    }

    existing = existing.filter((cb) => cb !== callback);
    this.onceCallbacks.set(animationId, existing);
  }

  onGroup(animationIds: string[], onGroupEnd: AnimationEndCallback) {
    this.groupAnimationIds = animationIds;
    this.onGroupEnd = onGroupEnd;
  }

  addToGroup(ids: string[]) {
    ids.forEach((id) => this.groupAnimationIds.push(id));
  }

  // Called by all react components that animate when an animation finishes
  onAnimationEnd(animationId: string) {
    // Get any listeners for this animation
    const onceCallbacks = this.onceCallbacks.get(animationId);
    if (onceCallbacks?.length) {
      // Fire all listeners
      onceCallbacks.forEach((cb) => cb());
      // Then delete them
      this.onceCallbacks.delete(animationId);
    }

    // Check for group listeners
    if (!this.groupAnimationIds.includes(animationId)) {
      return;
    }

    // Remove the id from the registered list
    this.groupAnimationIds = this.groupAnimationIds.filter(
      (id) => id !== animationId
    );

    // If all registered animations have finished, fire callback on the next frame
    if (!this.groupAnimationIds.length) {
      this.onGroupEnd?.();
    }
  }
}
