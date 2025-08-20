# CODSuite Backend – Multi-tenant & JWT

## Installation

1. Créer et activer l'environnement virtuel (Windows PowerShell):
```bash
python -m venv env
./env/Scripts/Activate.ps1
```

2. Installer les dépendances:
```bash
pip install -r requirements.txt
```

3. Appliquer les migrations:
```bash
python manage.py migrate
```

4. Créer un tenant et un utilisateur:
```bash
python manage.py bootstrap_multi_tenant --tenant "Default" --slug default \
  --username yoan --password test12345 --email yoan@example.com
```

5. Lancer le serveur:
```bash
python manage.py runserver 0.0.0.0:8000
```

## JWT avec informations de tenant

- Endpoint login: `POST /api/token/` avec `{ username, password }`
- Réponse enrichie via `fournisseurs.auth.TenantTokenObtainPairView`:
  - `access`, `refresh`
  - `user`: id, username, email, is_active
  - `tenant`: name, slug

- Refresh: `POST /api/token/refresh/` avec `{ refresh }`

## Administration

- Accès: `/admin/`
- `Tenant`, `UserProfile` enregistrés dans l'admin.

## Notes Multi-tenant

- Ce projet inclut un modèle `Tenant` et `UserProfile` liant l'utilisateur au tenant.
- Pour un vrai découpage par schéma DB (PostgreSQL), ajouter et activer `django-tenants` / `django-tenant-users` (déjà listés dans `requirements.txt`).
- Exemple de commande pour provisionner un tenant + user: voir `bootstrap_multi_tenant`.

## Sécurité

- Ajuster `SIMPLE_JWT` (clés, durées) en production.
- Restreindre `CORS_ALLOWED_ORIGINS` et désactiver `CORS_ALLOW_ALL_ORIGINS`.
