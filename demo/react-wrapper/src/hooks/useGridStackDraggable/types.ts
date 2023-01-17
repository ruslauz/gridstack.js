import { GridStackWidget } from "gridstack";
import { DDDraggableOpt } from "gridstack/dist/dd-draggable";

// export type UseGridStackAttribute = keyof Omit<
//     GridStackWidget,
//     'content' | 'subGrid' | 'autoPosition' | 'x' | 'y'
// >;

export type UseGridStackAttribute = {
    w: number;
    h: number;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
    noResize?: boolean;
    noMove?: boolean;
    locked?: boolean;
    id?: string;
};

export type UseGridStackDraggableOptions = UseGridStackAttribute &
    DDDraggableOpt;

