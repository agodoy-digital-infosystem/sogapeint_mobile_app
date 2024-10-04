# Définit le chemin du répertoire de projet
$projectPath = 'C:\Projets\appli_smartphone'  # Remplace par le chemin vers ton projet
$outputFile = Join-Path $projectPath 'project_files.md'

# Initialise le fichier Markdown
Set-Content -Path $outputFile -Value '## Contenu des fichiers du projet (excluant node_modules, .vscode, .git et commentaires)' -Encoding UTF8

# Fonction pour retirer les commentaires
function Remove-Comments {
    param (
        [string]$content,
        [string]$fileExtension
    )

    switch ($fileExtension) {
        '.js' {
            # Enlève les commentaires pour les fichiers JS
            # Suppression des commentaires mono-lignes // et multi-lignes /* */
            return $content -replace '(?s)/\*.*?\*/|//.*?$' -replace '^\s*$\n' -replace '\s+$'
        }
        '.json' {
            # JSON ne supporte pas les commentaires, donc aucun traitement n'est nécessaire
            return $content
        }
        '.html' {
            # Enlève les commentaires HTML <!-- -->
            return $content -replace '<!--.*?-->' -replace '^\s*$\n' -replace '\s+$'
        }
        default {
            return $content
        }
    }
}

# Parcours récursivement les fichiers du projet
Get-ChildItem -Path $projectPath -Recurse -File | Where-Object {
    $_.FullName -notlike '*\node_modules\*' -and 
    $_.FullName -notlike '*\.vscode\*' -and 
    $_.FullName -notlike '*\.git\*' -and 
    $_.Extension -in @('.js', '.json', '.html')
} | ForEach-Object {
    $filePath = $_.FullName
    $relativePath = $_.FullName.Substring($projectPath.Length + 1)
    $fileContent = Get-Content -Path $filePath -Raw -Encoding UTF8
    $cleanedContent = Remove-Comments -content $fileContent -fileExtension $_.Extension

    # Ajoute le contenu nettoyé au fichier Markdown
    Add-Content -Path $outputFile -Value "`n### Fichier : $relativePath" -Encoding UTF8
    Add-Content -Path $outputFile -Value "```$($_.Extension.TrimStart('.'))" -Encoding UTF8
    Add-Content -Path $outputFile -Value $cleanedContent -Encoding UTF8
    Add-Content -Path $outputFile -Value '```' -Encoding UTF8
}

# Message de confirmation
Write-Host 'Le contenu des fichiers a ete exporte dans' $outputFile