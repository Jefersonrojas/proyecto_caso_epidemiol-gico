import React from 'react';

const Header = () => {
  return (
    <header className="header-custom bg-white">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid px-3">
          {/* Logo and Brand */}
          <div className="d-flex align-items-center me-3">
            <div className="logo-badge">S</div>
            <a className="navbar-brand fw-bold text-dark mb-0" href="#" style={{fontSize: '1.2rem', lineHeight: '1'}}>
              SIVAPRE
            </a>
          </div>

          {/* Title - centered */}
          <div className="flex-grow-1 text-center d-none d-lg-block">
            <span className="text-dark" style={{fontSize: '0.95rem', fontWeight: '500'}}>
              Dashboard de Vigilancia Integrada
            </span>
          </div>

          {/* Icons */}
          <div className="d-flex align-items-center gap-1">
            <button className="btn btn-link text-secondary position-relative p-2" style={{width: 'auto'}}>
              <i className="bi bi-bell-fill" style={{fontSize: '1.2rem'}}></i>
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style={{width: '10px', height: '10px'}}></span>
            </button>
            <button className="btn btn-link text-secondary p-2" style={{width: 'auto'}}>
              <i className="bi bi-person-circle" style={{fontSize: '1.2rem'}}></i>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;