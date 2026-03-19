# Documentation du Système de Settings et Profil Utilisateur

## Résumé du système implémenté

Ce document décrit le système complet de gestion des paramètres utilisateur (settings) et du profil pour l'application FitnessAnim.

---

## 1. Architecture

### Fichiers créés/modifiés

| Fichier | Description |
|---------|-------------|
| `src/models/userSettings.model.js` | Modèle Sequelize pour les paramètres utilisateur |
| `src/models/user/index.js` | Export des modèles avec UserSettings |
| `src/models/user.model.js` | Ajout de l'association UserSettings |
| `src/repositories/userSettings.repository.js` | Couche d'accès aux données |
| `src/services/userSettings.service.js` | Logique métier |
| `src/controllers/userSettings.controller.js` | Contrôleur API |
| `src/routes/settings.route.js` | Routes API |
| `src/app.js` | Enregistrement des routes |
| `src/middlewares/errorHandler/errorTypes.middleware.js` | Ajout NotFoundError |
| `swagger.js` | Définitions Swagger |

---

## 2. Modèle de données UserSettings

### Table: `User_Settings`

Le modèle inclut **34 paramètres** organisés en catégories:

### 2.1 Paramètres généraux
| Champ | Type | Défaut | Description |
|-------|------|--------|-------------|
| `language` | ENUM | 'en' | Langue de l'app (en, fr, es, de, it, pt, ja, zh) |
| `theme` | ENUM | 'auto' | Thème visuel (light, dark, auto) |
| `measurementUnit` | ENUM | 'metric' | Unités (metric, imperial) |
| `timezone` | STRING | 'UTC' | Fuseau horaire |

### 2.2 Notifications
| Champ | Type | Défaut | Description |
|-------|------|--------|-------------|
| `emailNotifications` | BOOLEAN | true | Notifications par email |
| `pushNotifications` | BOOLEAN | true | Notifications push |
| `workoutReminders` | BOOLEAN | true | Rappels d'entraînement |
| `reminderTime` | STRING | '09:00' | Heure de rappel |
| `challengeNotifications` | BOOLEAN | true | Notifications de challenges |
| `goalNotifications` | BOOLEAN | true | Notifications d'objectifs |
| `achievementNotifications` | BOOLEAN | true | Notifications de succès |
| `newsletterSubscription` | BOOLEAN | false | Abonnement newsletter |
| `marketingEmails` | BOOLEAN | false | Emails marketing |

### 2.3 Confidentialité
| Champ | Type | Défaut | Description |
|-------|------|--------|-------------|
| `profileVisibility` | ENUM | 'friends' | Visibilité (public, friends, private) |
| `showWeight` | BOOLEAN | true | Afficher le poids |
| `showProgress` | BOOLEAN | true | Afficher la progression |
| `showStats` | BOOLEAN | true | Afficher les stats |
| `showLevel` | BOOLEAN | true | Afficher le niveau |
| `shareProgressWithFriends` | BOOLEAN | false | Partager avec amis |
| `allowDataAnalytics` | BOOLEAN | true | Autoriser l'analyse de données |

### 2.4 Préférences d'entraînement
| Champ | Type | Défaut | Description |
|-------|------|--------|-------------|
| `weeklyWorkoutGoal` | INTEGER | 3 | Objectif hebdomadaire |
| `preferredWorkoutDays` | JSON | [t,t,t,t,t,f,f] | Jours preferrés |
| `preferredWorkoutTime` | ENUM | 'morning' | Moment (morning, afternoon, evening, night) |
| `autoStartNextExercise` | BOOLEAN | false | Démarrage auto |
| `showRestTimer` | BOOLEAN | true | Afficher temps de repos |
| `restTimerDuration` | INTEGER | 60 | Durée repos (secondes) |

### 2.5 Paramètres audiovisuels
| Champ | Type | Défaut | Description |
|-------|------|--------|-------------|
| `soundEffects` | BOOLEAN | true | Effets sonores |
| `musicEnabled` | BOOLEAN | true | Musique |
| `hapticFeedback` | BOOLEAN | true | Retour haptique |
| `showMotivationalQuotes` | BOOLEAN | true | Citations motivantes |

### 2.6 Sécurité
| Champ | Type | Défaut | Description |
|-------|------|--------|-------------|
| `twoFactorEnabled` | BOOLEAN | false | Authentification à 2 facteurs |
| `sessionTimeout` | INTEGER | 30 | Timeout session (minutes) |
| `lastPasswordChange` | DATE | NOW | Dernier changement mot de passe |

---

## 3. API Endpoints

### 3.1 Récupérer les paramètres
```
GET /api/settings/:id
```
**Authentification:** Required (Bearer token)

**Réponse:**
```json
{
  "settingsId": 1,
  "userId": 1,
  "language": "fr",
  "theme": "dark",
  "measurementUnit": "metric",
  "emailNotifications": true,
  ...
}
```

### 3.2 Mettre à jour les paramètres
```
PUT /api/settings/:id
```
**Authentification:** Required

**Body:**
```json
{
  "language": "fr",
  "theme": "dark",
  "measurementUnit": "imperial"
}
```

### 3.3 Paramètres de notification
```
PUT /api/settings/:id/notifications
```

### 3.4 Paramètres de confidentialité
```
PUT /api/settings/:id/privacy
```

### 3.5 Préférences d'entraînement
```
PUT /api/settings/:id/workout
```

### 3.6 Paramètres de sécurité
```
PUT /api/settings/:id/security
```

### 3.7 Réinitialiser les paramètres
```
POST /api/settings/:id/reset
```

---

## 4. Intégration avec le profil existant

Le système complète le profil fitness existant:

### User (src/models/user.model.js)
- Identité: surname, name, email, password

### UserProfile (src/models/userProfile.model.js)
- Données physiques: weight, size, age, gender
- Fitness: fitnessGoal, fitnessLevel
- Personnalisation: favoriteAnime, profilePicturePath

### UserSettings (nouveau)
- Paramètres application
- Notifications
- Confidentialité
- Préférences d'entraînement
- Sécurité

---

## 5. Middleware utilisé

- **authenticateToken**: Vérifie le JWT
- **isOwner**: Vérifie que l'utilisateur accede à ses propres données

---

## 6. Structure des dossiers

```
src/
├── controllers/
│   └── userSettings.controller.js
├── models/
│   ├── userSettings.model.js
│   └── user/index.js
├── repositories/
│   └── userSettings.repository.js
├── routes/
│   └── settings.route.js
├── services/
│   └── userSettings.service.js
```

---

## 7. Sécurité

- Toutes les routes都需要 authentication
- Vérification ownership via isOwner middleware
- Champs filtrés pour éviter l'injection de données
- Timestamps automatique (createdAt, updatedAt)

---

## 8. Documentation Swagger

Accédez à: `/api-docs`

Nouvelle section **Settings** disponible dans la documentation avec tous les endpoints documentés.

---

## 9. Utilisation

### Créer les tables
Les tables sont créées automatiquement par Sequelize lors du démarrage de l'application.

### Exemple de requête curl
```bash
curl -X PUT http://localhost:3001/api/settings/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"theme": "dark", "weeklyWorkoutGoal": 5}'
```

---

*Document généré le 19 Mars 2026*
