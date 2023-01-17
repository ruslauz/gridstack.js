import {
    GridItemHTMLElement,
    GridStackOptions,
    GridStackWidget,
} from 'gridstack';

export type GridStackComponentProps = {
    className?: string;
    children?: JSX.Element[];
    widgets?: GridStackWidget[];

    /**
     *  Occurs when layout of a grid has been changed
     */
    onChange?: (event: Event, nodes: GridStackWidget[]) => void;

    /**
     *  Called when widgets are being added to a grid
     */
    onAdded?: (event: Event, nodes: GridStackWidget[]) => void;

    /**
     *  Called when items are being removed from the grid
     */
    onRemoved?: (event: Event, nodes: GridStackWidget[]) => void;

    /**
     * Called while a grid item is being dragged, for each new row/column value (not every pixel)
     */
    onDrag?: (event: Event, element: GridItemHTMLElement) => void;

    /**
     * Called when a grid item is starting to be dragged
     * */
    onDragStart?: (event: Event, element: GridItemHTMLElement) => void;

    /**
     * Called after the user is done moving the item, with updated DOM attributes
     */
    onDragEnd?: (event: Event, element: GridItemHTMLElement) => void;

    /**
     * Called when an item has been dropped and accepted over a grid.
     */
    onDropped?: (
        event: Event,
    ) => void;

    /**
     * Called while a grid item is being resized, for each new row/column value (not every pixel)
     */
    onResize?: (event: Event, element: GridItemHTMLElement) => void;

    /**
     * Called before the user starts resizing an item
     */
    onResizeStart?: (event: Event, element: GridItemHTMLElement) => void;

    /**
     * Called after the user is done resizing the item, with updated DOM attributes
     */
    onResizeEnd?: (event: Event, element: GridItemHTMLElement) => void;
    innerRef?: { current: null | HTMLDivElement };
} & Omit<GridStackOptions, 'class' | 'children'>;

