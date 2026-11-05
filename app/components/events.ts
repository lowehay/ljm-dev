// Window events that open the command palette and the AI chat from elsewhere on the site.
// Kept apart from the widgets so a file that only fires an event (the navbar button) doesn't import a whole widget.
export const OPEN_PALETTE_EVENT = "open-command-palette";
export const OPEN_ASK_EVENT = "open-ask-about-me";
export const TOGGLE_MUSIC_EVENT = "toggle-music";
