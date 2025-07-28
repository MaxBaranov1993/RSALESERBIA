import React from 'react';

const MapMarker = ({ product, t, translateCity }) => {
  return (
    <div className="custom-marker" style={{
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      padding: '8px',
      minWidth: '120px',
      maxWidth: '150px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: '2px solid transparent',
    }}>
      <div style={{
        width: '100%',
        height: '80px',
        backgroundImage: `url('${product.photo}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '6px',
        marginBottom: '6px',
      }}></div>
      <div style={{
        fontWeight: '600',
        fontSize: '12px',
        color: '#1f2937',
        marginBottom: '4px',
        lineHeight: '1.2',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>{product.title}</div>
      <div style={{
        fontWeight: '700',
        fontSize: '14px',
        color: '#7c3aed',
      }}>€{product.price}</div>
      <div style={{
        fontSize: '10px',
        color: '#6b7280',
        marginTop: '2px',
      }}>{translateCity(product.city, t)}</div>
    </div>
  );
};

export default MapMarker; 