export function getBackupMetadata() {
  return {};
}

export function getBackupSummary() {
  return 'No backup summary available';
}

export function parseInspectionBackup() {
  return {};
}

export function selectInspectionRestorePayload() {
  return null;
}

export function serializeInspectionBackup() {
  return JSON.stringify({});
}

export function upsertToolNote() {
  return null;
}

export function removeToolNote() {
  return null;
}

export function getToolNoteEditorState() {
  return { text: '', visible: false };
}

export function getToolNoteTimeline() {
  return [];
}

export function filterToolNoteTimeline() {
  return [];
}

export function filterToolNoteTimelineBySource() {
  return [];
}
