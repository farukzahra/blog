## GitHub — PAT

Arquivo canônico: `C:\repo\secrets\github\pat.txt` (atualizado 2026-07-28).

Scopes necessários: `repo`, `workflow`.

Configurar secrets automaticamente:

```powershell
$env:GITHUB_PAT = (Get-Content C:\repo\secrets\github\pat.txt | Where-Object { $_ -match '^ghp_' })
node scripts/set-github-secrets.mjs
```
