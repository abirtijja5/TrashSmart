# TrashSmart — Frontend Administratif Angular

Tableau de bord intelligent pour la gestion des déchets connectés.

## 🚀 Installation

```bash
npm install
ng serve
```

L'application démarre sur `http://localhost:4200`

## 📦 Build Production

```bash
ng build --configuration production
```

## 🗂️ Structure du projet

```
src/app/
├── app.module.ts               # Module principal + Routes
├── app.component.ts/html       # Composant racine
│
├── dashboard/
│   ├── dashboard.component.ts  # Logique : KPIs, graphiques, refresh auto
│   ├── dashboard.component.html # Template : sidebar, cartes, tableaux
│   └── dashboard.component.scss # Styles : design system TrashSmart
│
├── models/
│   └── waste.model.ts          # Interfaces TypeScript
│
└── services/
    └── waste.service.ts        # Service données (mock → API REST)
```

## 📊 Fonctionnalités du tableau de bord

| Bloc                    | Description                                        |
|-------------------------|----------------------------------------------------|
| **KPI Cards** (×5)      | Déchets collectés, Efficacité tri, Poubelles, Alertes, CO₂ |
| **Donut Chart**         | Répartition par type de déchet (plastique, verre, papier, métal, organique) |
| **Bar Chart empilé**    | Collecte hebdomadaire par type sur 7 jours         |
| **Line Chart**          | Évolution de l'efficacité sur 30 jours             |
| **Feed Alertes**        | Alertes temps réel par criticité                   |
| **Tableau poubelles**   | État, remplissage, statut de chaque poubelle       |
| **Refresh automatique** | Données rafraîchies toutes les 30 secondes         |

## 🔗 Connexion à l'API Backend (Spring Boot)

Dans `waste.service.ts`, remplacer les `of(...)` par des appels HTTP :

```typescript
import { HttpClient } from '@angular/common/http';

private API = 'http://localhost:8080/api';

getGlobalStats(): Observable<WasteStats> {
  return this.http.get<WasteStats>(`${this.API}/stats/global`);
}

getBinStatuses(): Observable<BinStatus[]> {
  return this.http.get<BinStatus[]>(`${this.API}/bins/status`);
}
```

## 🔐 Authentification (à implémenter)

Utiliser `@angular/auth` + JWT interceptor :

```typescript
// Ajouter dans app.module.ts :
{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
```

## 🎨 Design System

Variables SCSS disponibles :

```scss
--ts-primary    : #1D9E75   // Vert TrashSmart
--ts-blue       : #378ADD   // Informations
--ts-amber      : #EF9F27   // Avertissements
--ts-red        : #E24B4A   // Alertes critiques
--ts-sidebar-bg : #0F1F1B   // Fond sidebar sombre
```
