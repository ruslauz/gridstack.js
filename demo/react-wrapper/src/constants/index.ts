export const gridStackEventType = {
    change: 'change',
    added: 'added',
    removed: 'removed',
    drag: 'drag',
    dragstart: 'dragstart',
    dragstop: 'dragstop',
    resize: 'resize',
    resizestart: 'resizestart',
    resizestop: 'resizestop',
    dropped: 'dropped',
} as const;

export const gridStackAttributes = {
    id: 'gs-id',
    w: 'gs-w',
    h: 'gs-h',
    minW: 'gs-min-w',
    minH: 'gs-min-h',
    maxW: 'gs-max-w',
    maxH: 'gs-max-h',
    noResize: 'gs-no-resize',
    noMove: 'gs-no-move',
    locked: 'gs-locked',
} as const;

