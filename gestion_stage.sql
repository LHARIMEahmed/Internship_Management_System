-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 07 mai 2025 à 17:36
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gestion_stage`
--

-- --------------------------------------------------------

--
-- Structure de la table `admin`
--

CREATE TABLE `admin` (
  `service` varchar(255) DEFAULT NULL,
  `cin` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `admin`
--

INSERT INTO `admin` (`service`, `cin`) VALUES
('Administration', 'admin2'),
('Administration', 'Administrateur');

-- --------------------------------------------------------

--
-- Structure de la table `appreciation_globale`
--

CREATE TABLE `appreciation_globale` (
  `id_appreciation` int(11) NOT NULL,
  `implication` int(11) DEFAULT NULL,
  `observations` text DEFAULT NULL,
  `ouverture` int(11) DEFAULT NULL,
  `qualite_productions` int(11) DEFAULT NULL,
  `id_periode` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `appreciation_globale`
--

INSERT INTO `appreciation_globale` (`id_appreciation`, `implication`, `observations`, `ouverture`, `qualite_productions`, `id_periode`) VALUES
(3, NULL, '', NULL, NULL, 13),
(4, 5, 'Mlle Azzaoui Najlaa a su s’intégrer rapidement dans l’équipe et a fait preuve de sérieux, de motivation et d’une bonne capacité d’adaptation. Elle a su assimiler de nouvelles technologies et méthodologies, et a respecté les délais et consignes qui lui ont été confiés. Son travail a été satisfaisant et ses livrables ont répondu aux attentes. Nous la félicitons pour ses efforts et son implication tout au long du stage.', 5, 5, 14),
(9, 3, 'Mr. Maher a montré sérieux, autonomie et bonne capacité d’adaptation. Stage satisfaisant.', 4, 4, 19),
(10, 5, 'Najlaa a montré sérieux, autonomie et bonne capacité d’adaptation. Stage satisfaisant.', 5, 5, 20),
(15, 1, 'Bon travail, mais peut améliorer', 1, 1, 25),
(16, 2, 'Pas mal', 2, 2, 26),
(19, NULL, '', NULL, NULL, 13),
(20, NULL, '', NULL, NULL, 13),
(21, NULL, '', NULL, NULL, 13),
(23, NULL, '', NULL, NULL, 13),
(24, NULL, '', NULL, NULL, 13),
(25, NULL, '', NULL, NULL, 13),
(26, NULL, '', NULL, NULL, 13),
(27, NULL, '', NULL, NULL, 13),
(28, NULL, '', NULL, NULL, 13),
(29, NULL, '', NULL, NULL, 13),
(30, NULL, '', NULL, NULL, 13),
(31, NULL, '', NULL, NULL, 13),
(32, NULL, '', NULL, NULL, 13),
(33, NULL, '', NULL, NULL, 13),
(34, NULL, '', NULL, NULL, 13),
(35, NULL, '', NULL, NULL, 13),
(36, NULL, '', NULL, NULL, 13),
(37, NULL, '', NULL, NULL, 13),
(38, NULL, '', NULL, NULL, 13),
(39, NULL, '', NULL, NULL, 13),
(40, NULL, '', NULL, NULL, 13),
(50, 5, 'Très bien!', 4, 4, 30);

-- --------------------------------------------------------

--
-- Structure de la table `competences_specifique`
--

CREATE TABLE `competences_specifique` (
  `id` int(11) NOT NULL,
  `competence` varchar(255) NOT NULL,
  `evaluation` int(11) DEFAULT NULL,
  `periode_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `competences_specifique`
--

INSERT INTO `competences_specifique` (`id`, `competence`, `evaluation`, `periode_id`) VALUES
(2, 'Java', 3, 13),
(3, 'MySql', 3, 13),
(4, 'JavaScript', 3, 13),
(5, 'Cassandra', 3, 13),
(6, 'Spark', 3, 13),
(7, 'HBase', 3, 14),
(8, 'Hive', 3, 14),
(9, 'Python', 3, 14),
(10, 'MySql', 3, 14),
(11, 'Bootstrap', 3, 14),
(32, 'Cassandra', 3, 19),
(33, 'Hive', 2, 19),
(34, 'HBase', 2, 19),
(35, 'ElasticSearch', 3, 19),
(36, 'Hadoop', 3, 19),
(37, 'CNN', 3, 20),
(38, 'Arbre de d?cision', 3, 20),
(39, 'Spark', 3, 20),
(40, 'Hadoop', 3, 20),
(41, 'Elasticsearch', 3, 20),
(58, 'JavaScript', 3, 25),
(59, 'Spring', 2, 25),
(60, 'MySQL', 2, 26),
(64, 'JavaScript', 1, 30),
(65, 'Python', 3, 30),
(66, 'Java', 3, 30);

-- --------------------------------------------------------

--
-- Structure de la table `competence_entreprise`
--

CREATE TABLE `competence_entreprise` (
  `id` int(11) NOT NULL,
  `demarche_projet` int(11) DEFAULT NULL,
  `fonctionnement_entreprise` int(11) DEFAULT NULL,
  `note_globale` double DEFAULT NULL,
  `politique_environnementale` int(11) DEFAULT NULL,
  `recherche_information` int(11) DEFAULT NULL,
  `id_periode` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `competence_entreprise`
--

INSERT INTO `competence_entreprise` (`id`, `demarche_projet`, `fonctionnement_entreprise`, `note_globale`, `politique_environnementale`, `recherche_information`, `id_periode`) VALUES
(2, 3, 3, 20, 3, 3, 13),
(3, 3, 3, 20, 3, 3, 14),
(8, 2, 2, 18, 2, 2, 19),
(9, 3, 3, 20, 3, 3, 20),
(14, 2, 2, 14.7, 1, 1, 25),
(15, 3, 1, 13.8, 2, 1, 26),
(19, 3, 2, 19.2, 3, 2, 30);

-- --------------------------------------------------------

--
-- Structure de la table `competence_etudiant`
--

CREATE TABLE `competence_etudiant` (
  `id` int(11) NOT NULL,
  `analyse_synthese` int(11) DEFAULT NULL,
  `auto_evaluation` int(11) DEFAULT NULL,
  `contexte_international` int(11) DEFAULT NULL,
  `faire_adherer_acteurs` int(11) DEFAULT NULL,
  `identifier_problemes` int(11) DEFAULT NULL,
  `methodes_axes_travail` int(11) DEFAULT NULL,
  `note_globale` double DEFAULT NULL,
  `id_periode` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `competence_etudiant`
--

INSERT INTO `competence_etudiant` (`id`, `analyse_synthese`, `auto_evaluation`, `contexte_international`, `faire_adherer_acteurs`, `identifier_problemes`, `methodes_axes_travail`, `note_globale`, `id_periode`) VALUES
(2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 13),
(3, 3, 3, 3, 3, 3, 3, 20, 14),
(8, 2, 2, 2, 2, 2, 2, 18, 19),
(9, 0, 3, 3, 3, 3, 3, 20, 20),
(14, 2, 2, 2, 2, 2, 2, 17.9, 25),
(15, 2, 1, 1, 2, 3, 1, 13.2, 26),
(18, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 13),
(19, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 13),
(20, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 13),
(22, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 13),
(23, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 13),
(24, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 13),
(25, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 13),
(26, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 13),
(27, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 13),
(28, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 13),
(29, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 13),
(30, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 13),
(34, 2, 3, 2, 2, 2, 2, 19.3, 30);

-- --------------------------------------------------------

--
-- Structure de la table `competence_scientifique_technique`
--

CREATE TABLE `competence_scientifique_technique` (
  `id` int(11) NOT NULL,
  `conception_preliminaire` int(11) DEFAULT NULL,
  `note_globale` double DEFAULT NULL,
  `id_periode` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `competence_scientifique_technique`
--

INSERT INTO `competence_scientifique_technique` (`id`, `conception_preliminaire`, `note_globale`, `id_periode`) VALUES
(2, 3, 19, 13),
(3, 3, 20, 14),
(8, 2, 18, 19),
(9, 3, 20, 20),
(14, 2, 15.1, 25),
(15, 1, 12.8, 26),
(19, 3, 19.8, 30);

-- --------------------------------------------------------

--
-- Structure de la table `periode`
--

CREATE TABLE `periode` (
  `id` int(11) NOT NULL,
  `stagiaire_cin` varchar(20) DEFAULT NULL,
  `tuteur_cin` varchar(20) DEFAULT NULL,
  `stage_id` int(11) DEFAULT NULL,
  `date_debut` datetime(6) DEFAULT NULL,
  `date_fin` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `periode`
--

INSERT INTO `periode` (`id`, `stagiaire_cin`, `tuteur_cin`, `stage_id`, `date_debut`, `date_fin`) VALUES
(13, 'Q331980', 'Q3333', 11, '2024-12-11 01:00:00.000000', '2025-04-11 01:00:00.000000'),
(14, 'Q334456', 'Q3333', 12, '2024-12-11 01:00:00.000000', '2025-02-11 01:00:00.000000'),
(19, 'Q334456', 'Q9999', 17, '2024-09-09 01:00:00.000000', '2025-09-09 01:00:00.000000'),
(20, 'Q331980', 'Q9999', 18, '2024-01-11 01:00:00.000000', '2024-11-11 01:00:00.000000'),
(25, 'Q1234', 'Q3333', 23, '2025-04-05 01:00:00.000000', '2025-06-05 01:00:00.000000'),
(26, 'Q1234', 'Q9999', 24, '2024-12-11 01:00:00.000000', '2025-12-11 01:00:00.000000'),
(30, 'Q4444', 'Q3333', 29, '2025-01-07 01:00:00.000000', '2026-01-07 01:00:00.000000');

-- --------------------------------------------------------

--
-- Structure de la table `personne`
--

CREATE TABLE `personne` (
  `cin` varchar(20) NOT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `prenom` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('STAGIAIRE','TUTEUR') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `personne`
--

INSERT INTO `personne` (`cin`, `nom`, `prenom`, `email`, `password`, `role`) VALUES
('admin', 'AZAOUI', 'Najla', 'admin@gmail.com', NULL, NULL),
('admin2', 'L\'HARIME', 'Ahmed', 'ahmed04lharim@gmail.com', NULL, NULL),
('Administrateur', 'AZZAOUI', 'Najlaa', 'n.azzaoui2314@uca.ac.ma', NULL, NULL),
('Q1234', 'HAIZOUN', 'Salma', 'salmahaizoun@gmail.com', NULL, NULL),
('Q331980', 'AZZAOUI', 'Najlaa', 'najlaa98azzaoui@gmail.com', NULL, NULL),
('Q3333', 'HAMDANI', 'Bouchra', 'bouchra.hamdani@gmail.com', NULL, NULL),
('Q33331', 'L\'HARIME', 'Ahmed', 'Ahmed04lharim@gmail.com', NULL, NULL),
('Q334456', 'ZAIN', 'Maher', 'maher12zain@gmail.com', NULL, NULL),
('Q336656', 'ELKHIARI', 'Othmane', 'elkhiari04othmane@gmail.com', NULL, NULL),
('Q337756', 'AZZAOUI', 'Ayoub', 'azzaoui96ayoub@gmail.com', NULL, NULL),
('Q353535', 'ELHASSANI', 'Soukaina', 'elhassani04soukaina@gmail.com', NULL, NULL),
('Q3727', 'ELMRABTI', 'Nadia', 'nadia@gmail.com', NULL, NULL),
('Q4444', 'L\'HARIM', 'Ahmed', 'Ahmed04lharim@gmail.com', NULL, NULL),
('Q9999', 'EL ASRAOUI', 'Hafida', 'hafida@gmail.com', NULL, NULL),
('Stagiaire', 'Stagiaire', 'Stagiaire', 'Stagiaire.uca@gmail.com', NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `stage`
--

CREATE TABLE `stage` (
  `id` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `objectif` varchar(255) DEFAULT NULL,
  `entreprise` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `stage`
--

INSERT INTO `stage` (`id`, `description`, `objectif`, `entreprise`) VALUES
(1, 'Stage en développement web full-stack avec une équipe dynamique, travaillant sur des projets innovants.', 'Acquérir des compétences en React, Node.js et gestion de bases de données, tout en participant à la conception d\'applications web.', 'TechInnovate Solutions'),
(2, 'Stage en marketing digital axé sur la gestion des campagnes publicitaires et l\'analyse des performances.', 'Développer des compétences en SEO, SEA et analyse de données marketing via Google Analytics.', 'DigitalGrow Agency'),
(3, 'Stage en ingénierie logicielle pour le développement d\'une application mobile cross-platform.', 'Maîtriser Flutter et Dart, collaborer avec une équipe agile et contribuer à la livraison d\'une application.', 'MobileTech Innovations'),
(4, 'Stage en gestion de projet au sein d\'une startup spécialisée dans les solutions IoT.', 'Apprendre les méthodologies agiles (Scrum) et coordonner des équipes pluridisciplinaires pour livrer des projets IoT.', 'IoTConnect Solutions'),
(11, 'Elle a su assimiler de nouvelles technologies et méthodologies, et a respecté les délais et consignes qui lui ont été confiés.', 'Permettre à la stagiaire de mettre en pratique ses connaissances en développement web full-stack, d’apprendre à utiliser les outils de travail collaboratif (Git, Jira), et de participer à un projet agile en conditions réelles.', 'TechSolutions SARL'),
(12, 'il a participé activement au projet de développement d’une application de gestion des ressources humaines, en contribuant à l’implémentation des fonctionnalités backend sous Spring Boot et à l’intégration du frontend en React.js.', 'Permettre au stagiaire de mettre en pratique ses connaissances en développement web full-stack, d’apprendre à utiliser les outils de travail collaboratif (Git, Jira), et de participer à un projet agile en conditions réelles.', 'TechSolutions SARL'),
(17, 'Participation au développement d’une application web en Java Spring Boot et Angular, avec intégration de fonctionnalités de gestion des utilisateurs.', 'Découvrir le cycle de développement d’une application web et acquérir des compétences en programmation full-stack.', 'AWS'),
(18, 'Participation au développement d’une application web en Java Spring Boot et Angular, avec intégration de fonctionnalités de gestion des utilisateurs.', 'Découvrir le cycle de développement d’une application web et acquérir des compétences en programmation full-stack.', 'DevTech'),
(23, 'Stage en développement web full-stack avec une équipe dynamique, travaillant sur des projets innovants.', 'Acquérir des compétences en React, Node.js et gestion de bases de données, tout en participant à la conception d\'applications web.', 'IBM'),
(24, 'Stage en développement web full-stack avec une équipe dynamique, travaillant sur des projets innovants.', 'Acquérir des compétences en React, Node.js et gestion de bases de données, tout en participant à la conception d\'applications web.', 'TechInnovate Solutions'),
(26, 'Stage en développement web full-stack avec une équipe dynamique, travaillant sur des projets innovants.', 'Acquérir des compétences en React, Node.js et gestion de bases de données, tout en participant à la conception d\'applications web.', 'TechInnovate Solutions'),
(29, 'Stage en développement web full-stack avec une équipe dynamique, travaillant sur des projets innovants.', 'Acquérir des compétences en React, Node.js et gestion de bases de données, tout en participant à la conception d\'applications web.', 'IBM');

-- --------------------------------------------------------

--
-- Structure de la table `stagiaire`
--

CREATE TABLE `stagiaire` (
  `cin` varchar(20) NOT NULL,
  `institution` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `stagiaire`
--

INSERT INTO `stagiaire` (`cin`, `institution`) VALUES
('Q1234', 'FSSM'),
('Q331980', 'FSSM'),
('Q334456', 'ESTF'),
('Q3727', 'FSTS'),
('Q4444', 'FSSM');

-- --------------------------------------------------------

--
-- Structure de la table `tuteur`
--

CREATE TABLE `tuteur` (
  `cin` varchar(20) NOT NULL,
  `entreprise` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `tuteur`
--

INSERT INTO `tuteur` (`cin`, `entreprise`) VALUES
('Q3333', 'IBM'),
('Q337756', 'AWS'),
('Q353535', 'IBM'),
('Q9999', 'IBM');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `username` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`username`, `password`, `role`) VALUES
('admin2', '$2a$10$.f9GBdJxfj0OJQhFepCHNerr8.x.R4sU06R.OSTGscqxwU85GDFs.', 'ROLE_ADMIN'),
('Administrateur', '$2a$10$e7TfXck7K0ITVU9yAX11quMgKjQZ/B4NZ4qDMrb4I8v1XrD8M8pP.', 'ROLE_ADMIN'),
('Q1234', '$2a$10$u/7IJ7bb5X6/Qw9mNo98mOpRyHbTiHtSpz83JuYSpEoXJJcadqxQS', 'ROLE_STAGIAIRE'),
('Q3333', '$2a$10$Da6vrJ.YZMftaWewmVnq5u67RR0JzOGaSxZc/MWJYsOVjnSyEb0p.', 'ROLE_TUTEUR'),
('Q353535', '$2a$10$5OdJpJ1kjktyc13vsgKVfuwenxdcYoIYUiZIbp2S4kIkDUTxoMa3K', 'ROLE_TUTEUR'),
('Q3727', '$2a$10$Z2ZFnIYqa35ZqqkXBoMUIuzCrFKv2118z.GZyuAWpdhm/yUFeNAay', 'ROLE_STAGIAIRE'),
('Q4444', '$2a$10$r9MtFm11ynrykrTSWfmKK.NT/K4CVXElGq5vmKBTFZyIXPrsGjSZq', 'ROLE_STAGIAIRE'),
('Q9999', '$2a$10$yO.NLSYzGqGA89lM/o37AOc34/JIilThGK95TASncIj8YuC0.59Ze', 'ROLE_TUTEUR'),
('Stagiaire', '$2a$10$OrjOhHosxGWleDmM2qe90uHYAJ.GaOWzuaO47RRNU/lC./YBicPYi', 'ROLE_STAGIAIRE');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `id` int(11) NOT NULL,
  `cin` varchar(255) DEFAULT NULL,
  `mot_de_passe` varchar(255) DEFAULT NULL,
  `role` enum('STAGIAIRE','TUTEUR') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id`, `cin`, `mot_de_passe`, `role`) VALUES
(1, 'XY123456', '$2a$10$RhUDy62cDVXiezKOlx3IeOJ.YNl4fKKguT7Up15BC/qTRFvzYho0.', 'STAGIAIRE');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`cin`);

--
-- Index pour la table `appreciation_globale`
--
ALTER TABLE `appreciation_globale`
  ADD PRIMARY KEY (`id_appreciation`),
  ADD KEY `FKg2118m6hx1qtqxvsmteouuae8` (`id_periode`);

--
-- Index pour la table `competences_specifique`
--
ALTER TABLE `competences_specifique`
  ADD PRIMARY KEY (`id`),
  ADD KEY `competences_specifique_ibfk_1` (`periode_id`);

--
-- Index pour la table `competence_entreprise`
--
ALTER TABLE `competence_entreprise`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKkmm6ix9kdbllwvq13x7ox0pm6` (`id_periode`);

--
-- Index pour la table `competence_etudiant`
--
ALTER TABLE `competence_etudiant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKkxl79r9hdbebw5o3wvj5un9j2` (`id_periode`);

--
-- Index pour la table `competence_scientifique_technique`
--
ALTER TABLE `competence_scientifique_technique`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKb4vky2nva2pfqdhond6by1ujc` (`id_periode`);

--
-- Index pour la table `periode`
--
ALTER TABLE `periode`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stage_id` (`stage_id`),
  ADD KEY `periode_ibfk_1` (`stagiaire_cin`),
  ADD KEY `periode_ibfk_2` (`tuteur_cin`);

--
-- Index pour la table `personne`
--
ALTER TABLE `personne`
  ADD PRIMARY KEY (`cin`);

--
-- Index pour la table `stage`
--
ALTER TABLE `stage`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `stagiaire`
--
ALTER TABLE `stagiaire`
  ADD PRIMARY KEY (`cin`);

--
-- Index pour la table `tuteur`
--
ALTER TABLE `tuteur`
  ADD PRIMARY KEY (`cin`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`username`);

--
-- Index pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKsb09lhymuesdq09oktbf4fj3u` (`cin`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `appreciation_globale`
--
ALTER TABLE `appreciation_globale`
  MODIFY `id_appreciation` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT pour la table `competences_specifique`
--
ALTER TABLE `competences_specifique`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT pour la table `competence_entreprise`
--
ALTER TABLE `competence_entreprise`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT pour la table `competence_etudiant`
--
ALTER TABLE `competence_etudiant`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT pour la table `competence_scientifique_technique`
--
ALTER TABLE `competence_scientifique_technique`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT pour la table `periode`
--
ALTER TABLE `periode`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT pour la table `stage`
--
ALTER TABLE `stage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `FKhy0pfandm5rtf8eao2ib2blhx` FOREIGN KEY (`cin`) REFERENCES `personne` (`cin`);

--
-- Contraintes pour la table `appreciation_globale`
--
ALTER TABLE `appreciation_globale`
  ADD CONSTRAINT `FKg2118m6hx1qtqxvsmteouuae8` FOREIGN KEY (`id_periode`) REFERENCES `periode` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `competences_specifique`
--
ALTER TABLE `competences_specifique`
  ADD CONSTRAINT `competences_specifique_ibfk_1` FOREIGN KEY (`periode_id`) REFERENCES `periode` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `competence_entreprise`
--
ALTER TABLE `competence_entreprise`
  ADD CONSTRAINT `FKkmm6ix9kdbllwvq13x7ox0pm6` FOREIGN KEY (`id_periode`) REFERENCES `periode` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `competence_etudiant`
--
ALTER TABLE `competence_etudiant`
  ADD CONSTRAINT `FKkxl79r9hdbebw5o3wvj5un9j2` FOREIGN KEY (`id_periode`) REFERENCES `periode` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `competence_scientifique_technique`
--
ALTER TABLE `competence_scientifique_technique`
  ADD CONSTRAINT `FKb4vky2nva2pfqdhond6by1ujc` FOREIGN KEY (`id_periode`) REFERENCES `periode` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `periode`
--
ALTER TABLE `periode`
  ADD CONSTRAINT `periode_ibfk_1` FOREIGN KEY (`stagiaire_cin`) REFERENCES `stagiaire` (`cin`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `periode_ibfk_2` FOREIGN KEY (`tuteur_cin`) REFERENCES `tuteur` (`cin`) ON DELETE CASCADE,
  ADD CONSTRAINT `periode_ibfk_3` FOREIGN KEY (`stage_id`) REFERENCES `stage` (`id`);

--
-- Contraintes pour la table `stagiaire`
--
ALTER TABLE `stagiaire`
  ADD CONSTRAINT `stagiaire_ibfk_1` FOREIGN KEY (`cin`) REFERENCES `personne` (`cin`);

--
-- Contraintes pour la table `tuteur`
--
ALTER TABLE `tuteur`
  ADD CONSTRAINT `tuteur_ibfk_1` FOREIGN KEY (`cin`) REFERENCES `personne` (`cin`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
