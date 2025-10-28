// src/components/Unauthorized.js
import React from 'react';
import { Link } from 'react-router-dom';

function Unauthorized() {
  return (
    <div className="container text-center py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow border-0">
            <div className="card-body p-5">
              <div className="display-1 text-danger mb-4">
                <i className="bi bi-exclamation-triangle-fill"></i>
              </div>
              <h1 className="display-5 fw-bold mb-4">Accès non autorisé</h1>
              <p className="lead mb-4">
                Vous n'avez pas les droits nécessaires pour accéder à cette page. 
                Veuillez vous connecter avec un compte disposant des autorisations requises.
              </p>
              <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                <Link to="/" className="btn btn-primary btn-lg px-4">
                  Retour à l'accueil
                </Link>
                <Link to="/login" className="btn btn-outline-secondary btn-lg px-4">
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;