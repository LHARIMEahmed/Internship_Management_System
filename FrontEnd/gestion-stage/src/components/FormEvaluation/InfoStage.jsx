import React from 'react';

/**
 * Composant pour les informations générales du stage
 * @param {Object} props - Propriétés du composant
 * @returns {JSX.Element}
 */
const InfoStage = ({ 
  donneesFormulaire, 
  stagiaires, 
  gererChangementPrincipal 
}) => {
  return (
    <div className="card mb-4 shadow-sm border">
      <div className="card-header bg-light">
        <h3 className="card-title mb-0">Informations du Stage</h3>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Nom et Prénom du stagiaire</label>
            <select
              className="form-select"
              name="nomStagiaire"
              value={donneesFormulaire.nomStagiaire}
              onChange={gererChangementPrincipal}
              required
            >
              <option value="">Sélectionner un stagiaire</option>
              {stagiaires.map(stagiaire => (
                <option 
                  key={stagiaire.cin} 
                  value={`${stagiaire.prenom} ${stagiaire.nom}`}
                >
                  {stagiaire.prenom} {stagiaire.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Nom de l'entreprise</label>
            <input
              type="text"
              className="form-control"
              name="nomEntreprise"
              value={donneesFormulaire.nomEntreprise}
              onChange={gererChangementPrincipal}
              required
            />
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Nom et Prénom du tuteur</label>
            <input
              type="text"
              className="form-control bg-light"
              name="tuteurNom"
              value={donneesFormulaire.tuteurNom}
              readOnly
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Période du stage</label>
            <div className="row">
              <div className="col">
                <input
                  type="date"
                  className="form-control"
                  name="dateDebut"
                  value={donneesFormulaire.dateDebut}
                  onChange={gererChangementPrincipal}
                  required
                />
              </div>
              <div className="col">
                <input
                  type="date"
                  className="form-control"
                  name="dateFin"
                  value={donneesFormulaire.dateFin}
                  onChange={gererChangementPrincipal}
                  required
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Description du stage</label>
            <textarea
              className="form-control"
              name="descriptionStage"
              value={donneesFormulaire.descriptionStage}
              onChange={gererChangementPrincipal}
              rows="4"
              required
            ></textarea>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-bold">Objectif du stage</label>
            <textarea
              className="form-control"
              name="objectifStage"
              value={donneesFormulaire.objectifStage}
              onChange={gererChangementPrincipal}
              rows="4"
              required
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoStage;