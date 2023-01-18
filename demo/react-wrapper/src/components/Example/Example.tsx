import { useState } from 'react';
import { DDUIData, GridStackWidget } from 'gridstack';
import { v4 } from 'uuid';

import GridStackComponent from '../GridStackComponent';
import GridStackDraggable from '../GridStackDraggable'
import CustomGridStackEngine from './CustomGridStackEngine'

import classes from './Example.module.scss';

const layout: GridStackWidget[] = [
  { x: 0, y: 0, w: 2, h: 1, id: '1' },
  {
    x: 0,
    y: 1,
    h: 3,
    w: 2,
    id: '2',
    noResize: true,
    noMove: false,
  },
  { x: 0, y: 2, h: 2, w: 1, id: '3' },
];

const layout2: GridStackWidget[] = [
  { x: 0, y: 0, w: 2, h: 2, id: '02' },
  { x: 4, y: 1, w: 1, h: 3, id: '22' },
];

const Example = () => {
  const [widgets, setWidgets] = useState(layout);
  /* Defines a unique id on each drag start - could be useful in some cases */
  const handleStart = (event: Event, ui: DDUIData) => {
    if (event.target instanceof HTMLElement) {
      event.target.setAttribute('gs-id', v4());
    }
  }


  return (
    <>
      <GridStackDraggable w={2} h={2} start={handleStart}>
        GridStack drag-droppable from outside item
			</GridStackDraggable>
      <button
        onClick={() =>
          setWidgets(prev =>
            prev.concat({ id: v4(), x: 0, y: 0, w: 1, h: 1 }),
          )
        }
      >
        Add widget
			</button>
      <button
        onClick={() => setWidgets(([, , , ...restWidgets]) => restWidgets)}
      >
        Remove 3 first widgets
			</button>

      {/* A fully controlled grid */}
      <GridStackComponent
        acceptWidgets
        engineClass={CustomGridStackEngine}
        widgets={widgets}
        minRow={1}
        className={classes.gridStack}
        handleClass={classes.gridStackItemContent}
        onAdded={(_, addedWidgets) => {
          setWidgets(prev => prev.concat(addedWidgets))
        }}
        onRemoved={(_, removedWidgets) => {
          setWidgets(currentWidgets =>
            currentWidgets.filter(currentWidget =>
              removedWidgets.some(removedWidget => removedWidget.id !== currentWidget.id)),
          );
        }}
        onChange={(_, widgets) => {
          setWidgets(widgets);
        }}
      >
        {widgets.map(widget => {
          const { id } = widget;
          return <div key={id}>{id}</div>;
        })}
      </GridStackComponent>
      <br />

      {/**
			 * An uncontrolled grid with initial layout. Will disappear if the grid is empty.
			 * */}
      <GridStackComponent
        acceptWidgets
        widgets={layout2}
        className={classes.gridStack}
        handleClass={classes.gridStackItemContent}
      >
      </GridStackComponent>
      <br />

      {/* Empty uncontrolled grids/multiple grids */}
      <GridStackComponent
        acceptWidgets
        minRow={1}
        className={classes.gridStack}
        handleClass={classes.gridStackItemContent}
      ></GridStackComponent>
      <br />
      <GridStackComponent
        acceptWidgets
        minRow={1}
        className={classes.gridStack}
        handleClass={classes.gridStackItemContent}
      ></GridStackComponent>
    </>
  );
}

export default Example;
