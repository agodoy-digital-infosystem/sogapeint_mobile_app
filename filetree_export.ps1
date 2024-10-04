# Définir le chemin de base du projet
$projectPath = ".\"

# Définir le fichier de sortie pour l'arborescence
$outputFile = ".\arborescence_projet.txt"

# Obtenir l'arborescence des fichiers tout en excluant node_modules et .git
Get-ChildItem -Path $projectPath -Recurse -Directory | Where-Object { $_.FullName -notlike "*node_modules*" -and $_.FullName -notlike "*.git*" } |
    ForEach-Object { $_.FullName.Replace($projectPath, "") } > $outputFile

# Ajout des fichiers dans l'arborescence
Get-ChildItem -Path $projectPath -Recurse -File | Where-Object { $_.FullName -notlike "*node_modules*" -and $_.FullName -notlike "*.git*" } |
    ForEach-Object { $_.FullName.Replace($projectPath, "") } >> $outputFile

# Confirmation
Write-Host "L'arborescence du projet a été enregistrée dans $outputFile"
