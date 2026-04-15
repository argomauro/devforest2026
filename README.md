# DevForest 2026 – DevFest Basilicata Outdoor Edition

Sito ufficiale della DevFest Basilicata 2026, organizzata da GDG Basilicata.

## Architettura

Sito statico distribuito su AWS:

- **S3** – storage privato dei file statici
- **CloudFront** – CDN con HTTPS e compressione automatica
- **GitHub Actions** – deploy automatico ad ogni push su `main`

## Struttura del progetto

```
├── index.html       # Pagina principale
├── styles.css       # Stili
├── main.js          # Slider, navigazione, tema
├── robots.txt       # Direttive crawler
└── assets/          # Immagini
```

## Deploy

Il deploy è automatico: ogni push sul branch `main` sincronizza i file su S3 e invalida la cache CloudFront.

Per un deploy manuale (richiede AWS CLI configurato):

```bash
aws s3 sync . s3://devforest2026-static-assets --delete
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
```

## Secrets richiesti

| Secret | Descrizione |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | Credenziali utente IAM |
| `AWS_SECRET_ACCESS_KEY` | Chiave segreta utente IAM |
| `CLOUDFRONT_DISTRIBUTION_ID` | ID distribuzione CloudFront |

---

Organizzato da [GDG Basilicata](https://gdg.community.dev/gdg-basilicata/)
