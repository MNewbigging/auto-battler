/**
 * Register ids for any number of animations and a callback onEnd for when they're all done.
 * Every onAnimationEnd from a react component is routed through this class' onAnimationEnd.
 * When all registered ids have called their onAnimEnd, will fire the onEnd callback.
 *
 * There can only be one set of registered ids at any time - registering clears any existing ids.
 */

export class AnimationManagerV2 {
  animationIds: string[] = [];
  onEnd?: () => void;

  registerAnimationIds(ids: string[], onEnd: () => void) {
    this.animationIds = ids;
    this.onEnd = onEnd;
  }

  onAnimationEnd(animationId: string) {
    console.log("AM anim end for " + animationId);

    this.animationIds = this.animationIds.filter((id) => id !== animationId);

    if (!this.animationIds.length) {
      // All registered animations have finished
      this.onEnd?.();
    }
  }
}
