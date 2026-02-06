import React from 'react';

const Header = () => {
  return (
    <header className="bg-white border-bottom py-2">
      <div className="container-fluid d-flex align-items-center justify-content-between px-4">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-primary rounded-2 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
            <span className="text-white fw-bold" style={{ fontSize: '1rem' }}>S</span>
          </div>
          <div className="d-flex align-items-center">
            <h1 className="h5 mb-0 fw-bold text-dark me-3">SIVAPRE</h1>
            <div className="vr d-none d-md-block mx-2" style={{ height: '20px' }}></div>
            <span className="text-secondary d-none d-md-block ms-2" style={{ fontSize: '0.9rem' }}>Dashboard de Vigilancia Integrada</span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="position-relative">
            <i className="bi bi-bell text-secondary fs-5" style={{ cursor: 'pointer' }}></i>
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style={{ padding: '2px' }}></span>
          </div>
          <i className="bi bi-person text-secondary fs-4" style={{ cursor: 'pointer' }}></i>
        </div>
      </div>
    </header>
  );
};

export default Header;