# Script PowerShell pour lister les commandes
Write-Host "Liste des commandes disponibles" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

try {
    # Commande MongoDB pour lister les commandes
    $listScript = "db.orders.find({}, {orderNumber: 1, status: 1, 'customer.firstName': 1, 'customer.lastName': 1, total: 1}).sort({orderDate: -1})"
    
    Write-Host "Recuperation des commandes..." -ForegroundColor White
    
    $result = mongosh --quiet --eval $listScript mongodb://localhost:27017/ecommerce
    
    if ($result -match "null" -or $result.Trim() -eq "") {
        Write-Host "Aucune commande trouvee" -ForegroundColor Red
        exit 0
    }
    
    Write-Host "`nCommandes trouvees:" -ForegroundColor Green
    Write-Host "===================" -ForegroundColor Green
    
    # Afficher le resultat brut
    Write-Host $result -ForegroundColor White
    
    Write-Host "`nUtilisation du script de changement:" -ForegroundColor Cyan
    Write-Host ".\change-order-status-simple.ps1 -OrderNumber `"CMD250914662`" -NewStatus `"ready`"" -ForegroundColor White
    
    Write-Host "`nStatuts disponibles:" -ForegroundColor Cyan
    Write-Host "- pending (En attente)" -ForegroundColor White
    Write-Host "- confirmed (Confirmee)" -ForegroundColor White
    Write-Host "- preparing (En preparation)" -ForegroundColor White
    Write-Host "- ready (Prete)" -ForegroundColor White
    Write-Host "- shipped (Expediee)" -ForegroundColor White
    Write-Host "- delivered (Livree)" -ForegroundColor White
    Write-Host "- cancelled (Annulee)" -ForegroundColor White
    
} catch {
    Write-Host "Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nScript termine !" -ForegroundColor Green
