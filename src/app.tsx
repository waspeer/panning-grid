import * as React from 'react';

import './app.scss';

// TYPES
// -----

interface Coordinates {
  x: number;
  y: number;
}

interface ArtPiece {
  image: string;
  publishedOn: string;
  title: string;
}

type Grid = Array<[ArtPiece, ArtPiece, ArtPiece, ArtPiece, ArtPiece]>;

// DATA
// ----

const images: Grid = [
  [
    {
      image: 'https://source.unsplash.com/8wmbUbLUsz4/',
      title: "All We've Ever Wanted",
      publishedOn: 'July 5th, 2021',
    },
    {
      image: 'https://source.unsplash.com/RxE6AYn-Y5k/',
      title: 'Something Else',
      publishedOn: 'August 5th, 2021',
    },
    {
      image: 'https://source.unsplash.com/wcE2fS3Amoc/',
      title: 'Whenever You Want',
      publishedOn: 'January 5th, 2021',
    },
    {
      image: 'https://source.unsplash.com/ujBYjagUDiY/',
      title: 'What Is Beautiful?',
      publishedOn: 'September 5th, 2021',
    },
    {
      image: 'https://source.unsplash.com/igLQW_yY9oo/',
      title: 'Nothing Is Beautiful',
      publishedOn: 'October 5th, 2021',
    },
  ],
  [
    {
      image: 'https://source.unsplash.com/Wj-GUhugkxY/',
      title: 'Something Terrible',
      publishedOn: 'October 5th, 2021',
    },
    {
      image: 'https://source.unsplash.com/5tKEB1a_5Cw/',
      title: 'Something With All The Things',
      publishedOn: 'February 5th, 2021',
    },
    {
      image: 'https://source.unsplash.com/Q_KBDeMCo9w/',
      title: 'Something I Want',
      publishedOn: 'October 44th, 2021',
    },
    {
      image: 'https://source.unsplash.com/Ep_T4Aepor8/',
      title: 'Would You Want Something Beautiful?',
      publishedOn: 'May 5th, 2021',
    },
    {
      image: 'https://source.unsplash.com/Oq13yYb3eHI/',
      title: 'This is Beautiful!',
      publishedOn: 'April 5th, 2021',
    },
  ],
  [
    {
      image: 'https://source.unsplash.com/LTmdkzm2y1g/',
      title: 'Something Reasonable',
      publishedOn: 'October 5th, 2021',
    },
    {
      image: 'https://source.unsplash.com/ibIqYtrxXds/',
      title: 'All Things Beautiful',
      publishedOn: 'October 0th, 2021',
    },
    {
      image: 'https://source.unsplash.com/CaYxfP8IlHM/',
      title: 'Something Beautiful',
      publishedOn: 'January 5th, 2021',
    },
    {
      image: 'https://source.unsplash.com/l0iOHra9kNc/',
      title: 'Something Nasty',
      publishedOn: 'May 33th, 2021',
    },
    {
      image: 'https://source.unsplash.com/vHgeNO82JMc/',
      title: 'This Is Okay',
      publishedOn: 'December 5th, 2021',
    },
  ],
  [
    {
      image: 'https://source.unsplash.com/eKKaiHgJitE/',
      title: 'Something You Want',
      publishedOn: 'October 5th, 2021',
    },
    {
      image: 'https://source.unsplash.com/7i2by8a0tK8/',
      title: 'What Is It You Want?',
      publishedOn: 'January 5th, 2021',
    },
    {
      image: 'https://source.unsplash.com/v0a-jLLPYL8/',
      title: 'I Want Nothing',
      publishedOn: 'September 5th, 2021',
    },
    {
      image: 'https://source.unsplash.com/2_Q61ZrCzMQ/',
      title: 'Nothing Like This',
      publishedOn: 'November 5th, 2021',
    },
    {
      image: 'https://source.unsplash.com/g71SbI2oGbs/',
      title: 'Take This!',
      publishedOn: 'March 5th, 2021',
    },
  ],
  [
    {
      image: 'https://source.unsplash.com/1XvjS1fCrms/',
      title: 'Never Gonna',
      publishedOn: 'January 5th, 2021',
    },
    {
      image: 'https://source.unsplash.com/0rjY456aTiE/',
      title: 'Give You',
      publishedOn: 'February 5th, 2021',
    },
    {
      image: 'https://source.unsplash.com/ykK6Kmh9LL8/',
      title: 'Up!',
      publishedOn: 'March 5th, 2021',
    },
    {
      image: 'https://source.unsplash.com/fGXqq6HU2-4/',
      title: 'Never',
      publishedOn: 'April 5th, 2021',
    },
    {
      image: 'https://source.unsplash.com/IjPWFZncmxs/',
      title: 'Gonna Let You',
      publishedOn: 'March 5th, 2021',
    },
  ],
];

// GRID UTILTY FUNCTIONS
// ---------------------

function addOffset(coordinates: Coordinates, offset: Coordinates): Coordinates {
  return { x: coordinates.x + offset.x, y: coordinates.y + offset.y };
}

function getPieceAtCoordinates(coordinates: Coordinates): ArtPiece | null {
  return images[coordinates.y]?.[coordinates.x] ?? null;
}

function getPieceAtOffset(coordinates: Coordinates, offset: Coordinates): ArtPiece | null {
  return getPieceAtCoordinates(addOffset(coordinates, offset));
}

function pieceExistsAtCoordinates(coordinates: Coordinates): boolean {
  return !!getPieceAtCoordinates(coordinates);
}

// COMPONENTS
// ----------

/// GRID ITEM

interface GridItemProps {
  selected: Coordinates;
  offset: Coordinates;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function GridItem({ offset, onClick, selected }: GridItemProps) {
  const piece = getPieceAtOffset(selected, offset);
  const isSelectedItem = offset.x === 0 && offset.y === 0;

  return (
    <div
      className="grid-item"
      data-selected={isSelectedItem || null}
      data-x-offset={offset.x}
      data-y-offset={offset.y}
    >
      {piece && (
        <>
          <img src={piece.image} alt={piece.title} />
          <button className="visually-hidden" onClick={onClick}>
            Focus on {piece.title}
          </button>
        </>
      )}
    </div>
  );
}

/// GALLERY
//// REDUCER

interface GalleryState {
  animationOffset: Coordinates;
  mode: 'grid' | 'detail';
  selected: Coordinates;
}

type GalleryAction = { type: 'panToTile'; offset: Coordinates } | { type: 'toggleDetailView' };

function galleryReducer(previousState: GalleryState, action: GalleryAction): GalleryState {
  switch (action.type) {
    case 'panToTile': {
      if (previousState.mode !== 'grid') {
        return previousState;
      }

      return {
        ...previousState,
        animationOffset: action.offset,
        selected: addOffset(previousState.selected, action.offset),
      };
    }
    case 'toggleDetailView': {
      if (!pieceExistsAtCoordinates(previousState.selected)) {
        return previousState;
      }

      return {
        ...previousState,
        mode: previousState.mode === 'detail' ? 'grid' : 'detail',
      };
    }
  }
}

//// COMPONENT

const ANIMATION_SETTINGS = {
  duration: 600,
  easing: 'cubic-bezier(0.5, 0, 0, 1)',
};

// Create 5x5 grid of offsets ([0,0] is center, [-1,0] is tile left of center, etc...)
const offsetRange = [-2, -1, 0, 1, 2];
const offsetGrid: Array<Coordinates> = offsetRange.flatMap((yOffset) => {
  return offsetRange.map((xOffset) => ({ x: xOffset, y: yOffset }));
});

function Gallery() {
  const gridReference = React.useRef<HTMLDivElement>(null);
  const detailReference = React.useRef<HTMLDivElement>(null);

  const [state, dispatch] = React.useReducer(galleryReducer, {
    mode: 'grid',
    animationOffset: { x: 0, y: 0 },
    selected: { x: 3, y: 3 },
  });

  const { animationOffset, mode, selected } = state;
  const selectedPiece = getPieceAtCoordinates(selected);

  // FLIP animation when selected tile changes
  React.useLayoutEffect(() => {
    if (!gridReference.current) return;

    const gridElement = gridReference.current;
    const animation = gridElement.animate(
      [
        {
          transform: `
            translateX(calc( ${animationOffset.x} * var(--unit-width) )) 
            translateY(calc( ${animationOffset.y} * var(--unit-height) ))
          `,
        },
        {
          transform: 'none',
        },
      ],
      ANIMATION_SETTINGS,
    );

    return () => animation.cancel();
  }, [animationOffset, selected]);

  // FLIP animations on mode change
  React.useLayoutEffect(() => {
    if (mode === 'detail') {
      if (!(detailReference.current && gridReference.current)) return;

      // DETAIL VIEW ANIMATION
      // ---------------------

      const detailElement = detailReference.current;
      const detailAnimation = detailElement.animate(
        [
          {
            display: 'block',
            width: 'var(--image-width)',
            height: 'var(--image-height)',
            borderRadius: 'var(--border-radius)',
          },
          {
            borderRadius: 0,
            width: '100vw',
            height: '100vh',
          },
        ],
        ANIMATION_SETTINGS,
      );

      detailElement.dataset.transitioning = 'true';
      detailAnimation.addEventListener('finish', () => {
        delete detailElement.dataset.transitioning;
      });

      // GRID ANIMATION
      // --------------

      const gridElement = gridReference.current;
      const itemWidth = document.querySelector('.grid-item')!.clientWidth;
      const zoom = window.innerWidth / itemWidth;

      const gridAnimation = gridElement.animate(
        [{ transform: `scale(${zoom})` }],
        ANIMATION_SETTINGS,
      );

      // CLEANUP
      // -------

      return () => {
        detailAnimation.cancel();
        gridAnimation.cancel();
      };
    }

    if (mode === 'grid') {
      if (!(detailReference.current && gridReference.current)) return;

      // DETAIL VIEW ANIMATION
      // ---------------------

      const detailElement = detailReference.current;
      const detailAnimation = detailElement.animate(
        [
          {
            width: 'var(--image-width)',
            height: 'var(--image-height)',
            borderRadius: 'var(--border-radius)',
          },
        ],
        ANIMATION_SETTINGS,
      );

      detailElement.dataset.transitioning = 'true';
      detailAnimation.addEventListener('finish', () => {
        delete detailElement.dataset.transitioning;
      });

      // GRID ANIMATION
      // --------------

      const gridElement = gridReference.current;
      const itemWidth = document.querySelector('.grid-item')!.clientWidth;
      const zoom = window.innerWidth / itemWidth;

      const gridAnimation = gridElement.animate(
        [{ transform: `scale(${zoom})` }, { transform: 'none' }],
        ANIMATION_SETTINGS,
      );

      // CLEANUP
      // -------

      return () => {
        detailAnimation.cancel();
        gridAnimation.cancel();
      };
    }
  }, [mode]);

  return (
    <div className="gallery" data-mode={mode}>
      <div className="grid" ref={gridReference}>
        {offsetGrid.map((offset) => (
          <GridItem
            key={JSON.stringify(offset)}
            offset={offset}
            onClick={() => dispatch({ type: 'panToTile', offset })}
            selected={selected}
          />
        ))}
      </div>

      <div className="detail-view" ref={detailReference}>
        {selectedPiece && (
          <>
            <img src={selectedPiece.image} alt={selectedPiece.title} />

            <div className="overlay">
              <h2>{selectedPiece.title}</h2>
              <time>{selectedPiece.publishedOn}</time>
            </div>

            <button
              className="visually-hidden"
              onClick={() => dispatch({ type: 'toggleDetailView' })}
            >
              {mode === 'grid'
                ? `Read more about ${selectedPiece.title}`
                : `Go back to detail view`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Gallery;
