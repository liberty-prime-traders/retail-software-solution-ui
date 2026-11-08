
export namespace RtsConstants {

  export namespace ZIndexes {
    export const LOADING_BACKDROP = 9998
    export const LOADING_OVERLAY = LOADING_BACKDROP + 1
    // Held requests keep loading overlays up, so dialogs that can appear during them must sit above the overlay.
    export const DIALOG_BASE = LOADING_OVERLAY + 1
  }

}
