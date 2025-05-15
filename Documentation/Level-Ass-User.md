```
# README - Analyse du problème de synchronisation des niveaux dans l'interface utilisateur

## Introduction

Ce document détaille l'analyse du problème où l'interface graphique de LevelScreen ne reflète pas la mise à jour du niveau de l'utilisateur dans la base de données User_Avatar. Malgré la mise à jour de `Current_Level` à 3 pour un utilisateur, le niveau "Débutant" reste marqué comme "en cours" et les niveaux suivants restent verrouillés. L'objectif de cette analyse est d'identifier les causes possibles et de proposer des étapes pour diagnostiquer et corriger ce comportement.

## Analyse du problème

### Contexte de la gestion des niveaux

La gestion des niveaux dans l'application repose sur la valeur de `user.currentLevel` obtenue via le hook `useAuth`. Cette valeur est initialement chargée dans `AuthContext.tsx` à partir de l'endpoint GET `/api/user/:userId`, qui récupère le champ `Current_Level` de la table `User_Avatar`.

Dans `LevelScreen.tsx`, l'état de chaque niveau (complété, en cours, verrouillé) est déterminé en comparant son `Level_Id` avec `user.currentLevel`.

- `isCompleted`: `level.Level_Id < currentLevel`
- `isProcessing`: `level.Level_Id === currentLevel`
- `isLocked`: `level.Level_Id > currentLevel`

Le problème observé suggère que malgré une mise à jour de `Current_Level` à 3 dans la base de données, `user.currentLevel` dans le frontend reste à 1.

### Causes possibles

1.  **Mise à jour non propagée dans AuthContext :**
    * La requête GET `/api/user/:userId` dans `AuthContext` ne récupère pas la valeur mise à jour de `Current_Level`.
    * Les données stockées dans `AsyncStorage` ne sont pas actualisées après la modification du niveau dans la base de données.

2.  **Cache ou absence de rechargement :**
    * Le frontend utilise une version en cache de l'objet `user` (stockée dans `AsyncStorage`) qui contient l'ancienne valeur de `currentLevel` (1), et cette valeur n'est pas mise à jour après le changement dans la base de données.
    * L'application ne force pas un rechargement des données utilisateur après une mise à jour du niveau.

3.  **Problème avec l'endpoint GET /api/user/:userId :**
    * L'endpoint backend pourrait ne pas retourner la valeur correcte de `Current_Level` depuis la base de données.
    * L'endpoint pourrait retourner une réponse en cache.

4.  **Logique de rendu dans LevelScreen :**
    * La logique dans `LevelScreen` pourrait ne pas traiter correctement la valeur de `user.currentLevel`.
    * Les niveaux pourraient ne pas être rechargés après une mise à jour potentielle de `user.currentLevel`.

5.  **Données de la base :**
    * Bien que la table `User_Avatar` ait été mise à jour, il est important de s'assurer que la table `Levels` contient les données attendues pour les niveaux 1, 2 et 3.

## Étapes pour diagnostiquer et corriger

1.  **Vérifier la récupération de Current\_Level dans AuthContext**
    * Tester l'endpoint GET `/api/user/:userId` avec l'identifiant utilisateur concerné (13) et le token d'authentification pour confirmer que la réponse contient `avatar.Current_Level: 3`.
    * Vérifier directement la base de données avec une requête SQL pour s'assurer que `Current_Level` est bien 3 pour l'utilisateur.
    * Ajouter des logs dans la fonction `loadAuthData` de `AuthContext.tsx` pour examiner les données chargées depuis `AsyncStorage` et celles récupérées de l'API, en particulier la valeur de `currentLevel`.

2.  **Forcer la mise à jour des données utilisateur**
    * Implémenter une fonction `refreshUserData` dans `AuthContext.tsx` qui effectue une nouvelle requête GET `/api/user/:userId` et met à jour l'état `user` et `AsyncStorage`.
    * Appeler cette fonction au montage du composant `LevelScreen.tsx` pour s'assurer que les données utilisateur sont à jour.

3.  **Vérifier la mise à jour manuelle du niveau**
    * Si la mise à jour du niveau est effectuée manuellement dans la base de données, il est nécessaire de forcer un rechargement des données dans l'application (par exemple, en se déconnectant et en se reconnectant, ou en appelant `refreshUserData`).
    * Si la mise à jour du niveau se produit via une action dans l'application, implémenter un endpoint backend pour mettre à jour `User_Avatar` et appeler `refreshUserData` dans le frontend après la mise à jour.

4.  **Vérifier les niveaux dans la base de données**
    * S'assurer que la table `Levels` contient les entrées pour tous les niveaux pertinents (au moins jusqu'au niveau 3).
    * Tester l'endpoint GET `/api/levels` pour vérifier que tous les niveaux sont correctement retournés par l'API.

5.  **Forcer un rechargement manuel (solution temporaire)**
    * Tenter d'effacer les données de l'application stockées dans `AsyncStorage` (`user` et `token`) et se reconnecter pour forcer un nouveau chargement des données.
    * Redémarrer l'application après une mise à jour manuelle de la base de données peut également forcer le rechargement de `AuthContext`.

## Étapes de test

1.  **Vérifier les logs dans AuthContext :** Examiner les logs pour confirmer que `currentLevel` est correctement récupéré et stocké après le chargement initial et après un éventuel rafraîchissement.
2.  **Vérifier les logs dans LevelScreen :** S'assurer que `user.currentLevel` dans `LevelScreen` est la valeur attendue (3) et que les niveaux sont enrichis en conséquence (`isCompleted`, `isProcessing`, `isLocked`).
3.  **Tester l'interface :** Naviguer vers `LevelScreen` avec l'utilisateur concerné et vérifier que les niveaux sont affichés correctement (niveaux 1 et 2 complétés, niveau 3 en cours, les autres verrouillés).
4.  **Simuler une mise à jour :** Si un endpoint de mise à jour du niveau est implémenté, le tester et vérifier que l'interface se met à jour après l'appel à `refreshUserData`.

## Conclusion

Le problème de non-synchronisation des niveaux est probablement dû à une gestion inadéquate du cache ou à un manque de mécanisme de rafraîchissement des données utilisateur après une modification dans la base de données. L'implémentation de la fonction `refreshUserData` dans `AuthContext` et son appel dans `LevelScreen` devraient permettre de s'assurer que l'interface utilisateur affiche toujours la dernière version du niveau de l'utilisateur.

Si le problème persiste après l'application de ces solutions, il sera nécessaire d'examiner plus en détail les logs et la structure des données pour identifier la cause sous-jacente.
```