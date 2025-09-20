# Script PowerShell simplifie pour lister les commandes
Write-Host "Liste des commandes disponibles" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

try {
    # Commande MongoDB simple
    $mongoCommand = "db.orders.find({}, {orderNumber: 1, status: 1, 'customer.firstName': 1, 'customer.lastName': 1, total: 1}).sort({orderDate: -1})"
    
    Write-Host "Recuperation des commandes..." -ForegroundColor White
    
    # Executer la commande MongoDB
    $result = mongosh --quiet --eval $mongoCommand mongodb://localhost:27017/ecommerce
    
    if ($result -match "null" -or $result.Trim() -eq "") {
        Write-Host "Aucune commande trouvee" -ForegroundColor Red
        exit 0
    }
    
    Write-Host "`nCommandes trouvees:" -ForegroundColor Green
    
    # Afficher les resultats bruts pour debug
    Write-Host "`nResultat brut:" -ForegroundColor Yellow
    Write-Host $result -ForegroundColor White
    
} catch {
    Write-Host "Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nScript termine !" -ForegroundColor Green
