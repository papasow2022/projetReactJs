# Script PowerShell pour changer le statut d'une commande
param(
    [Parameter(Mandatory=$true)]
    [string]$OrderNumber,
    
    [Parameter(Mandatory=$true)]
    [string]$NewStatus
)

Write-Host "Changement de statut de commande" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

try {
    # Etape 1: Verifier le statut actuel
    Write-Host "`nETAPE 1: Verification du statut actuel" -ForegroundColor Yellow
    
    $findScript = "db.orders.findOne({orderNumber: '$OrderNumber'}, {orderNumber: 1, status: 1, 'customer.firstName': 1, 'customer.lastName': 1, total: 1})"
    
    Write-Host "Recherche de la commande: $OrderNumber" -ForegroundColor White
    
    $currentResult = mongosh --quiet --eval $findScript mongodb://localhost:27017/ecommerce
    
    if ($currentResult -match "null") {
        Write-Host "Commande $OrderNumber non trouvee !" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Commande trouvee !" -ForegroundColor Green
    Write-Host "Resultat actuel:" -ForegroundColor White
    Write-Host $currentResult -ForegroundColor Gray
    
    # Extraire le statut actuel (methode simple)
    if ($currentResult -match "status:\s*'([^']*)'") {
        $currentStatus = $matches[1]
        Write-Host "Statut actuel: $currentStatus" -ForegroundColor Yellow
    } else {
        Write-Host "Impossible d'extraire le statut actuel" -ForegroundColor Red
        Write-Host "Resultat brut: $currentResult" -ForegroundColor Gray
        exit 1
    }
    
    # Etape 2: Confirmer le changement
    Write-Host "`nETAPE 2: Confirmation du changement" -ForegroundColor Yellow
    Write-Host "Changement propose: $currentStatus -> $NewStatus" -ForegroundColor Cyan
    
    $confirmation = Read-Host "Voulez-vous continuer ? (y/N)"
    if ($confirmation -ne "y" -and $confirmation -ne "Y") {
        Write-Host "Operation annulee par l'utilisateur" -ForegroundColor Red
        exit 0
    }
    
    # Etape 3: Effectuer le changement
    Write-Host "`nETAPE 3: Mise a jour du statut" -ForegroundColor Yellow
    
    $updateScript = "db.orders.updateOne({orderNumber: '$OrderNumber'}, {`$set: {status: '$NewStatus', adminNotes: 'Statut change de $currentStatus a $NewStatus via PowerShell - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')'}})"
    
    Write-Host "Mise a jour en cours..." -ForegroundColor White
    
    $updateResult = mongosh --quiet --eval $updateScript mongodb://localhost:27017/ecommerce
    
    Write-Host "Resultat de la mise a jour:" -ForegroundColor White
    Write-Host $updateResult -ForegroundColor Gray
    
    if ($updateResult -match '"modifiedCount"\s*:\s*1') {
        Write-Host "Statut mis a jour avec succes !" -ForegroundColor Green
    } else {
        Write-Host "Echec de la mise a jour" -ForegroundColor Red
        exit 1
    }
    
    # Etape 4: Verifier le nouveau statut
    Write-Host "`nETAPE 4: Verification du nouveau statut" -ForegroundColor Yellow
    
    $verifyResult = mongosh --quiet --eval $findScript mongodb://localhost:27017/ecommerce
    
    Write-Host "Nouveau resultat:" -ForegroundColor White
    Write-Host $verifyResult -ForegroundColor Gray
    
    if ($verifyResult -match "'status'\s*:\s*'([^']*)'") {
        $newStatus = $matches[1]
        Write-Host "Nouveau statut: $newStatus" -ForegroundColor Green
    }
    
    # Resume final
    Write-Host "`nRESUME FINAL" -ForegroundColor Cyan
    Write-Host "=============" -ForegroundColor Cyan
    Write-Host "Commande: $OrderNumber" -ForegroundColor White
    Write-Host "Changement: $currentStatus -> $newStatus" -ForegroundColor Yellow
    Write-Host "Statut: SUCCES" -ForegroundColor Green
    Write-Host "Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor White
    
} catch {
    Write-Host "Erreur: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`nOperation terminee avec succes !" -ForegroundColor Green
