import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  PieChart, Pie, BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

function AdminDashboard() {
  // États pour stocker les données des différentes API
  const [generalStats, setGeneralStats] = useState(null);
  const [compEtudiantStats, setCompEtudiantStats] = useState(null);
  const [compEntrepriseStats, setCompEntrepriseStats] = useState(null);
  const [compScientifiqueStats, setCompScientifiqueStats] = useState(null);
  const [appreciationStats, setAppreciationStats] = useState(null);
  const [entrepriseStats, setEntrepriseStats] = useState([]);
  const [institutionStats, setInstitutionStats] = useState([]);
  const [evolutionStats, setEvolutionStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  // Couleurs pour les graphiques
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Récupération des données lors du chargement du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les données générales
        const generalResponse = await axios.get('http://localhost:8080/api/statistics/general', {
          headers: getAuthHeaders()
        });
        setGeneralStats(generalResponse.data);
        
        // Récupérer les statistiques des compétences étudiant
        const compEtudiantResponse = await axios.get('http://localhost:8080/api/statistics/competences-etudiant', {
          headers: getAuthHeaders()
        });
        setCompEtudiantStats(compEtudiantResponse.data);
        
        // Récupérer les statistiques des compétences entreprise
        const compEntrepriseResponse = await axios.get('http://localhost:8080/api/statistics/competences-entreprise', {
          headers: getAuthHeaders()
        });
        setCompEntrepriseStats(compEntrepriseResponse.data);
        
        // Récupérer les statistiques des compétences scientifiques
        const compScientifiqueResponse = await axios.get('http://localhost:8080/api/statistics/competences-scientifiques', {
          headers: getAuthHeaders()
        });
        setCompScientifiqueStats(compScientifiqueResponse.data);
        
        // Récupérer les statistiques des appréciations
        const appreciationResponse = await axios.get('http://localhost:8080/api/statistics/appreciations', {
          headers: getAuthHeaders()
        });
        setAppreciationStats(appreciationResponse.data);
        
        // Récupérer les statistiques par entreprise
        const entrepriseResponse = await axios.get('http://localhost:8080/api/statistics/entreprises', {
          headers: getAuthHeaders()
        });
        setEntrepriseStats(entrepriseResponse.data);
        
        // Récupérer les statistiques par institution
        const institutionResponse = await axios.get('http://localhost:8080/api/statistics/institutions', {
          headers: getAuthHeaders()
        });
        setInstitutionStats(institutionResponse.data);
        
        // Récupérer les statistiques d'évolution
        const evolutionResponse = await axios.get('http://localhost:8080/api/statistics/evolution', {
          headers: getAuthHeaders()
        });
        setEvolutionStats(evolutionResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération des statistiques:", err);
        setError("Impossible de charger les statistiques. Veuillez réessayer plus tard.");
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Fonction utilitaire pour obtenir les en-têtes d'authentification
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };
  
  // Fonction pour préparer les données pour le graphique en radar
  const prepareRadarData = (stats, keys) => {
    if (!stats) return [];
    
    return keys.map(key => {
      const keyParts = key.split('.');
      const label = keyParts[keyParts.length - 1].replace(/([A-Z])/g, ' $1').trim();
      
      let value = stats;
      for (const part of keyParts) {
        value = value[part];
      }
      
      return {
        subject: label.charAt(0).toUpperCase() + label.slice(1),
        value: value || 0
      };
    });
  };
  
  // Fonction pour préparer les données pour le graphique d'évolution
  const prepareEvolutionData = () => {
    if (!evolutionStats?.evolution) return [];
    
    return Object.entries(evolutionStats.evolution).map(([year, data]) => ({
      year: year,
      totalPeriodes: data.totalPeriodes || 0,
      periodesEvaluees: data.periodesEvaluees || 0,
      tauxEvaluation: data.tauxEvaluation || 0,
      moyenneImplication: data.moyenneImplication || 0,
      moyenneNoteGlobale: data.moyenneNoteGlobaleEtudiant || 0
    }));
  };
  
  // Fonction pour préparer les données des distributions
  const prepareDistributionData = (distributions, category) => {
    if (!distributions || !distributions[category]) return [];
    
    return Object.entries(distributions[category]).map(([note, count]) => ({
      note: note,
      count: count
    }));
  };
  
  // Rendu du tableau de bord
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p className="text-xl">{error}</p>
      </div>
    );
  }
  
  // Pour formater les grands nombres
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tableau de Bord Administratif</h1>
      
      {/* Navigation des onglets */}
      <div className="mb-8 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              className={`inline-block py-4 px-4 ${activeTab === 'general' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('general')}
            >
              Vue Générale
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block py-4 px-4 ${activeTab === 'competences' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('competences')}
            >
              Compétences
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block py-4 px-4 ${activeTab === 'organisations' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('organisations')}
            >
              Organisations
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block py-4 px-4 ${activeTab === 'evolution' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('evolution')}
            >
              Évolution
            </button>
          </li>
        </ul>
      </div>
      
      {/* Onglet Vue Générale */}
      {activeTab === 'general' && generalStats && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-600 mb-2">Stagiaires</h3>
              <p className="text-3xl font-bold text-blue-600">{formatNumber(generalStats.totalStagiaires)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-600 mb-2">Tuteurs</h3>
              <p className="text-3xl font-bold text-green-600">{formatNumber(generalStats.totalTuteurs)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-600 mb-2">Stages</h3>
              <p className="text-3xl font-bold text-orange-600">{formatNumber(generalStats.totalStages)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-600 mb-2">Taux d'Évaluation</h3>
              <p className="text-3xl font-bold text-purple-600">{generalStats.tauxEvaluation}%</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Répartition des Évaluations</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Évaluées', value: generalStats.periodesEvaluees },
                        { name: 'Non évaluées', value: generalStats.totalPeriodes - generalStats.periodesEvaluees }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                      dataKey="value"
                    >
                      <Cell fill="#8884d8" />
                      <Cell fill="#d0cfd5" />
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Nombre de périodes']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {appreciationStats && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Moyennes Générales des Appréciations</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Implication', value: appreciationStats.moyenneImplication },
                        { name: 'Ouverture', value: appreciationStats.moyenneOuverture },
                        { name: 'Qualité', value: appreciationStats.moyenneQualiteProductions }
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip formatter={(value) => [value.toFixed(2), 'Moyenne']} />
                      <Bar dataKey="value" fill="#8884d8">
                        {[0, 1, 2].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
          
          {/* Principales entreprises et institutions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Top 5 Entreprises</h3>
              <div className="overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entreprise</th>
                      <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stages</th>
                      <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taux d'Évaluation</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {entrepriseStats.slice(0, 5).map((entreprise, index) => (
                      <tr key={index}>
                        <td className="py-3 px-4 whitespace-nowrap">{entreprise.entreprise}</td>
                        <td className="py-3 px-4 whitespace-nowrap">{entreprise.totalStages}</td>
                        <td className="py-3 px-4 whitespace-nowrap">{entreprise.tauxEvaluation}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Top 5 Institutions</h3>
              <div className="overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                      <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stagiaires</th>
                      <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taux d'Évaluation</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {institutionStats.slice(0, 5).map((institution, index) => (
                      <tr key={index}>
                        <td className="py-3 px-4 whitespace-nowrap">{institution.institution}</td>
                        <td className="py-3 px-4 whitespace-nowrap">{institution.totalStagiaires}</td>
                        <td className="py-3 px-4 whitespace-nowrap">{institution.tauxEvaluation}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Onglet Compétences */}
      {activeTab === 'competences' && (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Compétences Étudiant */}
            {compEtudiantStats && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Compétences Étudiant</h3>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart 
                      outerRadius={120} 
                      data={prepareRadarData(compEtudiantStats, [
                        'moyenneAnalyseSynthese', 
                        'moyenneMethodesAxesTravail', 
                        'moyenneFaireAdhererActeurs',
                        'moyenneContexteInternational',
                        'moyenneAutoEvaluation',
                        'moyenneIdentifierProblemes'
                      ])}
                    >
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 5]} />
                      <Radar 
                        name="Moyennes" 
                        dataKey="value" 
                        stroke="#8884d8" 
                        fill="#8884d8" 
                        fillOpacity={0.6} 
                      />
                      <Tooltip formatter={(value) => [value.toFixed(2), 'Moyenne']} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-4 text-sm text-gray-600">Note globale moyenne: <span className="font-bold">{compEtudiantStats.moyenneNoteGlobale}/20</span></p>
              </div>
            )}
            
            {/* Compétences Entreprise */}
            {compEntrepriseStats && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Compétences Entreprise</h3>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart 
                      outerRadius={120} 
                      data={prepareRadarData(compEntrepriseStats, [
                        'moyenneFonctionnementEntreprise', 
                        'moyenneDemarcheProjet', 
                        'moyennePolitiqueEnvironnementale',
                        'moyenneRechercheInformation'
                      ])}
                    >
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 5]} />
                      <Radar 
                        name="Moyennes" 
                        dataKey="value" 
                        stroke="#00C49F" 
                        fill="#00C49F" 
                        fillOpacity={0.6} 
                      />
                      <Tooltip formatter={(value) => [value.toFixed(2), 'Moyenne']} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-4 text-sm text-gray-600">Note globale moyenne: <span className="font-bold">{compEntrepriseStats.moyenneNoteGlobale}/20</span></p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Distributions des notes pour les compétences étudiant */}
            {compEtudiantStats?.distributions && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Distribution - Analyse et Synthèse</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={prepareDistributionData(compEtudiantStats.distributions, 'analyseSynthese')}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="note" />
                      <YAxis />
                      <Tooltip formatter={(value) => [value, 'Nombre d\'évaluations']} />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            
            {/* Distributions des notes pour les appréciations */}
            {appreciationStats?.distributions && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Distribution - Implication</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={prepareDistributionData(appreciationStats.distributions, 'implication')}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="note" />
                      <YAxis />
                      <Tooltip formatter={(value) => [value, 'Nombre d\'évaluations']} />
                      <Bar dataKey="count" fill="#FF8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
          
          {/* Compétences scientifiques et techniques */}
          {compScientifiqueStats && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Compétences Scientifiques et Techniques</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-600 mb-3">Conception Préliminaire</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareDistributionData(compScientifiqueStats.distributions, 'conceptionPreliminaire')}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="note" />
                        <YAxis />
                        <Tooltip formatter={(value) => [value, 'Nombre d\'évaluations']} />
                        <Bar dataKey="count" fill="#FFBB28" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-gray-600 mb-2">Moyenne Conception Préliminaire</div>
                    <div className="text-4xl font-bold text-yellow-500">{compScientifiqueStats.moyenneConceptionPreliminaire} / 5</div>
                    <div className="mt-6 text-gray-600 mb-2">Note Globale Moyenne</div>
                    <div className="text-5xl font-bold text-yellow-600">{compScientifiqueStats.moyenneNoteGlobale} / 20</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Onglet Organisations */}
      {activeTab === 'organisations' && (
        <div className="grid grid-cols-1 gap-6">
          {/* Statistiques des entreprises */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Statistiques par Entreprise</h3>
            <div className="overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entreprise</th>
                    <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stages</th>
                    <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Périodes</th>
                    <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taux d'Évaluation</th>
                    <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note Moyenne</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {entrepriseStats.map((entreprise, index) => (
                    <tr key={index}>
                      <td className="py-3 px-4 whitespace-nowrap">{entreprise.entreprise}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{entreprise.totalStages}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{entreprise.totalPeriodes || 0}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{entreprise.tauxEvaluation || 0}%</td>
                      <td className="py-3 px-4 whitespace-nowrap">{entreprise.moyenneNoteGlobale || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Statistiques des institutions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Statistiques par Institution</h3>
            <div className="overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                    <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stagiaires</th>
                    <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Périodes</th>
                    <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taux d'Évaluation</th>
                    <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note Moyenne</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {institutionStats.map((institution, index) => (
                    <tr key={index}>
                      <td className="py-3 px-4 whitespace-nowrap">{institution.institution}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{institution.totalStagiaires}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{institution.totalPeriodes || 0}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{institution.tauxEvaluation || 0}%</td>
                      <td className="py-3 px-4 whitespace-nowrap">{institution.moyenneNoteGlobale || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Onglet Évolution */}
      {activeTab === 'evolution' && evolutionStats && (
        <div className="grid grid-cols-1 gap-6">
          {/* Évolution du nombre de périodes */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Évolution du Nombre de Périodes</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={prepareEvolutionData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={(value, name) => [value, name]} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="totalPeriodes"
                    name="Total Périodes"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="periodesEvaluees"
                    name="Périodes Évaluées"
                    stroke="#82ca9d"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Évolution des taux d'évaluation */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Évolution du Taux d'Évaluation</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={prepareEvolutionData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value, name) => [value, name]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="tauxEvaluation"
                    name="Taux d'Évaluation (%)"
                    stroke="#ff7300"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Évolution des moyennes */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Évolution des Moyennes</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={prepareEvolutionData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip formatter={(value, name) => [value, name]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="moyenneImplication"
                    name="Moyenne Implication"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="moyenneNoteGlobale"
                    name="Moyenne Note Globale"
                    stroke="#82ca9d"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;