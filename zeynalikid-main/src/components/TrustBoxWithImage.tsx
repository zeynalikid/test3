import React from 'react';

interface TrustBoxWithImageProps {
  text: string;
  imageUrl: string;
  imageAlt: string;
  imagePosition?: 'left' | 'right' | 'top' | 'bottom';
  T: any;
}

const TrustBoxWithImage: React.FC<TrustBoxWithImageProps> = ({
  text,
  imageUrl,
  imageAlt,
  imagePosition = 'left',
  T,
}) => {
  const isHorizontal = imagePosition === 'left' || imagePosition === 'right';
  const flexDirection = imagePosition === 'left' ? 'row' : imagePosition === 'right' ? 'row-reverse' : 'column';

  return (
    <div
      className="trust-box-with-image"
      style={{
        display: 'flex',
        flexDirection,
        alignItems: 'center',
        gap: '1.5rem',
        background: T.card,
        borderRadius: 20,
        padding: '1.5rem',
        boxShadow: T.neuOut,
        border: `1px solid ${T.brd}`,
      }}
    >
      <div className="trust-image" style={{ flex: '0 0 40%' }}>
        <img
          src={imageUrl}
          alt={imageAlt}
          loading="lazy"
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: 16,
            objectFit: 'cover',
            aspectRatio: '4/3',
          }}
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== '/images/trust-default.jpg') {
              target.src = '/images/trust-default.jpg';
            }
          }}
        />
      </div>
      <div className="trust-text" style={{ flex: 1 }}>
        <p
          style={{
            fontSize: 'clamp(14px, 2vw, 18px)',
            lineHeight: 1.6,
            fontWeight: 500,
            color: T.txt,
            margin: 0,
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
};

export default TrustBoxWithImage;
