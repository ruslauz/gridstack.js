import { useEffect, useMemo, useRef, useState } from 'react'
import { usePrevious, useUpdateEffect } from 'react-use'
import { GridStack, GridStackNode, GridStackWidget } from 'gridstack'
import { v4 } from 'uuid'
import shallowEqual from "shallowequal";
import cn from 'classnames'

import { gridStackEventType } from '../../constants';
import { GridStackComponentProps } from './types'

import 'gridstack/dist/gridstack.min.css';
import 'gridstack/dist/gridstack-extra.min.css';

const GridStackComponent = (props: GridStackComponentProps) => {
    const {
        widgets,
        children,
        onChange,
        onAdded,
        onRemoved,
        onDrag,
        onDragStart,
        onDragEnd,
        onDropped,
        onResize,
        onResizeStart,
        onResizeEnd,
        innerRef,
        ...gridStackOptions
    } = props;
    const [innerWidgets, setInnerWidgets] = useState(widgets ?? []);
    const gridStackUniqueId = useRef<string>(v4());
    const prevGridStackOptions = usePrevious(gridStackOptions);
    const gridStackRef = useRef<GridStack | null>(null);
    const gridLayoutContainerRef = useRef<HTMLDivElement>(null);
    const childrenByKeyMap = useMemo(
        () =>
            children?.reduce((map, child) => {
                if (child.key !== null) {
                    map.set(child.key, child);
                }

                return map;
            }, new Map<string | number, JSX.Element>()),
        [children],
    );

    useUpdateEffect(() => {
        if (widgets !== undefined) {
            setInnerWidgets(widgets);
        }
    }, [widgets])


    /* Initializes GridStack */
    useEffect(() => {
        if (gridLayoutContainerRef.current === null) {
            return;
        }

        if (innerRef !== undefined) {
            innerRef.current ??= gridLayoutContainerRef.current;
        }

        if (shallowEqual(gridStackOptions, prevGridStackOptions)) {
            return;
        }
        /* Initializes GridStack instance if it has not been initialized yet */
        gridStackRef.current ??= GridStack.init(
            gridStackOptions,
            gridLayoutContainerRef.current,
        );
    }, [gridStackOptions, prevGridStackOptions, innerRef]);

    /* onChange is called when a widget's position/size has been changed */
    useEffect(() => {
        if (gridStackRef.current === null) {
            return;
        }

        gridStackRef.current.on(
            gridStackEventType.change,
            (event: Event) => {

                const currentWidgets = gridStackRef.current?.save(false)
                if (Array.isArray(currentWidgets)) {
                    setInnerWidgets(currentWidgets)
                    onChange?.(event, currentWidgets);
                }

            },
        );

        return () => {
            gridStackRef.current?.off(gridStackEventType.change);
        };
    }, [onChange]);

    /* onAdd is called when a new grid item has been added */
    useEffect(() => {
        if (gridStackRef.current === null) {
            return;
        }

        gridStackRef.current.on(
            gridStackEventType.added,
            (event: Event, nodes: GridStackNode[]) => {
                const widgets: GridStackWidget[] = []

                nodes.forEach(node => {
                    if (node.el === undefined || node.el?.dataset.id === gridStackUniqueId.current) {
                        return
                    }
                    //@ts-ignore
                    const { _id, el, grid, ...newWidget } = node
                    gridStackRef.current?.removeWidget(node.el, true, false)
                    newWidget.id ??= v4();
                    widgets.push(newWidget)
                })


                if (widgets.length > 0) {
                    setInnerWidgets(prev => prev.concat(widgets))
                    onAdded?.(event, widgets);
                }
            },
        );

        return () => {
            gridStackRef.current?.off(gridStackEventType.added);
        };
    }, [onAdded]);

    /* onRemoved is called when a grid item has been removed */
    useEffect(() => {
        if (gridStackRef.current === null) {
            return;
        }

        gridStackRef.current.on(
            gridStackEventType.removed,
            (event: Event, nodes: GridStackNode[]) => {
                const currentWidgets = gridStackRef.current?.save(false)
                if (Array.isArray(currentWidgets) && gridStackRef.current !== null) {
                    setInnerWidgets(currentWidgets)
                }

                const removedWidgets = nodes.map(node => {
                    //@ts-ignore
                    const { _id, el, grid, ...widget } = node
                    return widget
                })

                onRemoved?.(event, removedWidgets);
            },
        );

        return () => {
            gridStackRef.current?.off(gridStackEventType.removed);
        };
    }, [onRemoved, onChange]);

    /* onDrag */
    useEffect(() => {
        if (gridStackRef.current === null || onDrag === undefined) {
            return;
        }

        gridStackRef.current.on(gridStackEventType.drag, onDrag);

        return () => {
            gridStackRef.current?.off(gridStackEventType.drag);
        };
    }, [onDrag]);

    /* onDragStart */
    useEffect(() => {
        if (gridStackRef.current === null || onDragStart === undefined) {
            return;
        }

        gridStackRef.current.on(gridStackEventType.dragstart, onDragStart);

        return () => {
            gridStackRef.current?.off(gridStackEventType.dragstart);
        };
    }, [onDragStart]);

    /* onDragEnd */
    useEffect(() => {
        if (gridStackRef.current === null || onDragEnd === undefined) {
            return;
        }

        gridStackRef.current.on(gridStackEventType.dragstop, onDragEnd);

        return () => {
            gridStackRef.current?.off(gridStackEventType.dragstop);
        };
    }, [onDragEnd]);

    /* onResize */
    useEffect(() => {
        if (gridStackRef.current === null || onResize === undefined) {
            return;
        }

        gridStackRef.current.on(gridStackEventType.resize, onResize);

        return () => {
            gridStackRef.current?.off(gridStackEventType.resize);
        };
    }, [onResize]);

    /* onResizeStart */
    useEffect(() => {
        if (gridStackRef.current === null || onResizeStart === undefined) {
            return;
        }

        gridStackRef.current.on(gridStackEventType.resizestart, onResizeStart);

        return () => {
            gridStackRef.current?.off(gridStackEventType.resizestart);
        };
    }, [onResizeStart]);

    /* onResizeEnd */
    useEffect(() => {
        if (gridStackRef.current === null || onResizeEnd === undefined) {
            return;
        }

        gridStackRef.current.on(gridStackEventType.resizestop, onResizeEnd);

        return () => {
            gridStackRef.current?.off(gridStackEventType.resizestop);
        };
    }, [onResizeEnd]);

    /* onDropped is called when a grid item has been dropped from the outside (side panel or another grid) */
    useEffect(() => {
        if (gridStackRef.current === null) {
            return;
        }

        gridStackRef.current.on(
            gridStackEventType.dropped,
            (
                event,
                oldNode: GridStackNode | undefined,
                newNode,
            ) => {
                if (newNode.el !== undefined && oldNode !== undefined) {
                    const nodeEl = newNode.el;
                    nodeEl.style.display = 'none';
                    oldNode.grid?.el.append(nodeEl);
                }

                onDropped?.(event);
            },
        );

        return () => {
            gridStackRef.current?.off(gridStackEventType.dropped);
        };
    }, [onDropped, props.handleClass, props.itemClass]);

    /* On "widgets" property change */
    useEffect(() => {
        if (gridStackRef.current === null) {
            return;
        }
        const gridItems = gridStackRef.current.getGridItems();

        const nodes = innerWidgets.map<GridStackNode>(widget => {
            //Todo decrease complexity from O(n^2) to O(n) - create Map from
            const el = gridItems.find(item => {
                const itemId = item.getAttribute('gs-id');
                return itemId === String(widget.id);
            });

            /* Creates new object to prevent native widget objet from mutation */
            const node: GridStackNode = { ...widget };

            if (el !== undefined) {
                /* Adds "el" property to the widget to force "load()" function call "update()""
                on each (matching by id) widget instead of adding */
                /* Looks like a bug in typing of GridStack "load" function */
                node.el = el;
            }

            /* Deletes content property to prevent it's
            rendering instead of react component */
            delete node.content;

            return node;
        });

        gridStackRef.current.load(nodes);

    }, [innerWidgets]);

    return (
        <div
            ref={gridLayoutContainerRef}
            className={cn('grid-stack', props.className)}
        >
            {innerWidgets.map(widget => {
                const { id } = widget;
                const child =
                    id !== undefined ? childrenByKeyMap?.get(id) : undefined;

                return (
                    <div
                        key={id}
                        className={cn("grid-stack-item", props.itemClass)}
                        gs-id={id}
                        data-id={gridStackUniqueId.current}
                    >
                        <div className={cn("grid-stack-item-content", props.handleClass)}>{child}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default GridStackComponent