import * as React from 'react';

import './app.scss';

type ArtPiece = string;
type Grid = Array<[ArtPiece, ArtPiece, ArtPiece, ArtPiece, ArtPiece]>;

const images: Grid = [
  [
    'https://source.unsplash.com/8wmbUbLUsz4/',
    'https://source.unsplash.com/RxE6AYn-Y5k/',
    'https://source.unsplash.com/wcE2fS3Amoc/',
    'https://source.unsplash.com/ujBYjagUDiY/',
    'https://source.unsplash.com/igLQW_yY9oo/',
  ],
  [
    'https://source.unsplash.com/Wj-GUhugkxY/',
    'https://source.unsplash.com/5tKEB1a_5Cw/',
    'https://source.unsplash.com/Q_KBDeMCo9w/',
    'https://source.unsplash.com/Ep_T4Aepor8/',
    'https://source.unsplash.com/Oq13yYb3eHI/',
  ],
  [
    'https://source.unsplash.com/LTmdkzm2y1g/',
    'https://source.unsplash.com/ibIqYtrxXds/',
    'https://source.unsplash.com/CaYxfP8IlHM/',
    'https://source.unsplash.com/l0iOHra9kNc/',
    'https://source.unsplash.com/vHgeNO82JMc/',
  ],
  [
    'https://source.unsplash.com/eKKaiHgJitE/',
    'https://source.unsplash.com/7i2by8a0tK8/',
    'https://source.unsplash.com/v0a-jLLPYL8/',
    'https://source.unsplash.com/2_Q61ZrCzMQ/',
    'https://source.unsplash.com/g71SbI2oGbs/',
  ],
  [
    'https://source.unsplash.com/1XvjS1fCrms/',
    'https://source.unsplash.com/0rjY456aTiE/',
    'https://source.unsplash.com/ykK6Kmh9LL8/',
    'https://source.unsplash.com/fGXqq6HU2-4/',
    'https://source.unsplash.com/IjPWFZncmxs/',
  ],
];

interface Coordinates {
  x: number;
  y: number;
}

interface GalleryItemProps {
  selected: Coordinates;
  offset: Coordinates;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function getPiece(coordinates: Coordinates): ArtPiece | null {
  return images[coordinates.y]?.[coordinates.x] ?? null;
}

function pieceAtCoordinatesExists(coordinates: Coordinates): boolean {
  return !!getPiece(coordinates);
}

function addOffset(coordinates: Coordinates, offset: Coordinates): Coordinates {
  return { x: coordinates.x + offset.x, y: coordinates.y + offset.y };
}

function GalleryItem({ offset, onClick, selected }: GalleryItemProps) {
  const coordinates = addOffset(selected, offset);
  const imageSource = getPiece(coordinates);
  const isSelected = offset.x === 0 && offset.y === 0;

  return (
    <button
      className="galleryItem"
      data-selected={isSelected || null}
      data-x-offset={offset.x}
      data-y-offset={offset.y}
      onClick={onClick}
    >
      {imageSource && <img src={imageSource} alt="" />}
    </button>
  );
}

const offsetRange = [-2, -1, 0, 1, 2];
const offsets: Array<Coordinates> = offsetRange.flatMap((yOffset) => {
  return offsetRange.map((xOffset) => ({ x: xOffset, y: yOffset }));
});

interface GalleryState {
  animationOffset: Coordinates;
  mode: 'gallery' | 'detail';
  selected: Coordinates;
}

type GalleryAction = { type: 'panToTile'; offset: Coordinates } | { type: 'toggleDetailView' };

function galleryReducer(previousState: GalleryState, action: GalleryAction): GalleryState {
  switch (action.type) {
    case 'panToTile': {
      if (previousState.mode !== 'gallery') {
        return previousState;
      }

      return {
        ...previousState,
        animationOffset: action.offset,
        selected: addOffset(previousState.selected, action.offset),
      };
    }
    case 'toggleDetailView': {
      if (!pieceAtCoordinatesExists(previousState.selected)) {
        return previousState;
      }

      return {
        ...previousState,
        mode: previousState.mode === 'detail' ? 'gallery' : 'detail',
      };
    }
  }
}

function App() {
  const galleryReference = React.useRef<HTMLDivElement>(null);
  const detailReference = React.useRef<HTMLButtonElement>(null);

  const [state, dispatch] = React.useReducer(galleryReducer, {
    mode: 'gallery',
    animationOffset: { x: 0, y: 0 },
    selected: { x: 3, y: 3 },
  });

  const { animationOffset, mode, selected } = state;
  const selectedPiece = getPiece(selected);

  React.useLayoutEffect(() => {
    if (!galleryReference.current) return;

    const galleryElement = galleryReference.current;
    const animation = galleryElement.animate(
      [
        {
          transform: `
          translateX(calc( ${animationOffset.x} * var(--unit-width) )) 
          translateY(calc( ${animationOffset.y} * var(--unit-height) ))
        `,
        },
        {
          transform: 'translateX(0px) translateY(0px)',
        },
      ],
      {
        duration: 600,
        easing: 'cubic-bezier(0.5, 0, 0, 1)',
      },
    );

    return () => {
      animation.cancel();
    };
  }, [animationOffset, selected]);

  React.useLayoutEffect(() => {
    if (mode === 'detail') {
      if (!(detailReference.current && galleryReference.current)) return;

      // DETAIL VIEW ANIMATION
      // ---------------------

      const detailElement = detailReference.current;

      detailElement.dataset.transitioning = 'true';
      detailElement
        .animate(
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
          {
            duration: 600,
            easing: 'cubic-bezier(0.5, 0, 0, 1)',
          },
        )
        .addEventListener('finish', () => {
          delete detailElement.dataset.transitioning;
        });

      // GALLERY ANIMATION
      // -----------------

      const galleryElement = galleryReference.current;
      const tileWidth = document.querySelector('.galleryItem')!.clientWidth;
      const zoom = window.innerWidth / tileWidth;

      galleryElement.animate(
        [
          {
            transform: `scale(${zoom})`,
          },
        ],
        {
          duration: 600,
          easing: 'cubic-bezier(0.5, 0, 0, 1)',
        },
      );
    }

    if (mode === 'gallery') {
      if (!(detailReference.current && galleryReference.current)) return;

      // DETAIL VIEW ANIMATION
      // ---------------------

      const detailElement = detailReference.current;

      detailElement.dataset.transitioning = 'true';
      detailElement
        .animate(
          [
            {
              width: 'var(--image-width)',
              height: 'var(--image-height)',
              borderRadius: 'var(--border-radius)',
            },
          ],
          {
            duration: 600,
            easing: 'cubic-bezier(0.5, 0, 0, 1)',
          },
        )
        .addEventListener('finish', () => {
          delete detailElement.dataset.transitioning;
        });

      // GALLERY ANIMATION
      // -----------------

      const galleryElement = galleryReference.current;
      const tileWidth = document.querySelector('.galleryItem')!.clientWidth;
      const zoom = window.innerWidth / tileWidth;

      galleryElement.animate([{ transform: `scale(${zoom})` }, { transform: 'none' }], {
        duration: 600,
        easing: 'cubic-bezier(0.5, 0, 0, 1)',
      });
    }
  }, [mode]);

  return (
    <div className="app" data-mode={mode}>
      <div className="gallery" ref={galleryReference}>
        {offsets.map((offset) => (
          <GalleryItem
            key={JSON.stringify(offset)}
            offset={offset}
            onClick={() => dispatch({ type: 'panToTile', offset })}
            selected={selected}
          />
        ))}
      </div>

      <button
        className="detailView"
        ref={detailReference}
        onClick={() => dispatch({ type: 'toggleDetailView' })}
      >
        <img src={selectedPiece ?? undefined} alt="" />
      </button>
    </div>
  );
}

export default App;
