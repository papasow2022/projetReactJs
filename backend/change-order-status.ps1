# Script PowerShell pour changer le statut d'une commande
# Usage: .\change-order-status.ps1 -OrderNumber "CMD250914662" -NewStatus "ready"

param(
    [Parameter(Mandatory=$true)]
    [string]$OrderNumber,
    
    [Parameter(Mandatory=$true)]
    [ValidateSet("pending", "confirmed", "preparing", "ready", "shipped", "delivered", "cancelled")]
    [string]$NewStatus
)

# Configuration MongoDB
$mongoConnectionString = "mongodb://localhost:27017/ecommerce"
$databaseName = "ecommerce"
$collectionName = "orders"

Write-Host "🔄 Script de changement de statut de commande" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

try {
    # Étape 1: Vérifier le statut actuel
    Write-Host "`n📋 ÉTAPE 1: Vérification du statut actuel" -ForegroundColor Yellow
    
    $findCommand = @"
db.orders.findOne(
    { "orderNumber": "$OrderNumber" },
    { 
        "orderNumber": 1, 
        "status": 1, 
        "customer.firstName": 1, 
        "customer.lastName": 1, 
        "customer.email": 1,
        "total": 1,
        "orderDate": 1
    }
)
"@
    
    Write-Host "Recherche de la commande: $OrderNumber" -ForegroundColor White
    
    $currentOrder = mongosh --quiet --eval $findCommand $mongoConnectionString
    
    if ($currentOrder -match "null") {
        Write-Host "❌ Commande $OrderNumber non trouvée !" -ForegroundColor Red
        exit 1
    }
    
    # Extraire le statut actuel
    $currentStatus = ($currentOrder | Select-String '"status"\s*:\s*"([^"]*)"').Matches[0].Groups[1].Value
    
    Write-Host "✅ Commande trouvée !" -ForegroundColor Green
    Write-Host "   Numéro: $OrderNumber" -ForegroundColor White
    Write-Host "   Statut actuel: $currentStatus" -ForegroundColor Yellow
    
    # Afficher les détails de la commande
    $customerName = ($currentOrder | Select-String '"firstName"\s*:\s*"([^"]*)"').Matches[0].Groups[1].Value
    $customerLastName = ($currentOrder | Select-String '"lastName"\s*:\s*"([^"]*)"').Matches[0].Groups[1].Value
    $customerEmail = ($currentOrder | Select-String '"email"\s*:\s*"([^"]*)"').Matches[0].Groups[1].Value
    $total = ($currentOrder | Select-String '"total"\s*:\s*(\d+)').Matches[0].Groups[1].Value
    
    Write-Host "   Client: $customerName $customerLastName" -ForegroundColor White
    Write-Host "   Email: $customerEmail" -ForegroundColor White
    Write-Host "   Total: $total GNF" -ForegroundColor White
    
    # Étape 2: Confirmer le changement
    Write-Host "`n📋 ÉTAPE 2: Confirmation du changement" -ForegroundColor Yellow
    Write-Host "Changement proposé: $currentStatus → $NewStatus" -ForegroundColor Cyan
    
    $confirmation = Read-Host "Voulez-vous continuer ? (y/N)"
    if ($confirmation -ne "y" -and $confirmation -ne "Y") {
        Write-Host "❌ Opération annulée par l'utilisateur" -ForegroundColor Red
        exit 0
    }
    
    # Étape 3: Effectuer le changement
    Write-Host "`n📋 ÉTAPE 3: Mise à jour du statut" -ForegroundColor Yellow
    
    $updateCommand = @"
db.orders.updateOne(
    { "orderNumber": "$OrderNumber" },
    { 
        `$set: { 
            "status": "$NewStatus",
            "adminNotes": "Statut changé de $currentStatus à $NewStatus via PowerShell - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        } 
    }
)
"@
    
    Write-Host "Mise à jour en cours..." -ForegroundColor White
    
    $updateResult = mongosh --quiet --eval $updateCommand $mongoConnectionString
    
    if ($updateResult -match '"modifiedCount"\s*:\s*1') {
        Write-Host "✅ Statut mis à jour avec succès !" -ForegroundColor Green
    } else {
        Write-Host "❌ Échec de la mise à jour" -ForegroundColor Red
        Write-Host "Résultat: $updateResult" -ForegroundColor Red
        exit 1
    }
    
    # Étape 4: Vérifier le nouveau statut
    Write-Host "`n📋 ÉTAPE 4: Vérification du nouveau statut" -ForegroundColor Yellow
    
    $verifyCommand = @"
db.orders.findOne(
    { "orderNumber": "$OrderNumber" },
    { 
        "orderNumber": 1, 
        "status": 1, 
        "adminNotes": 1,
        "updatedAt": 1
    }
)
"@
    
    $updatedOrder = mongosh --quiet --eval $verifyCommand $mongoConnectionString
    
    $newStatus = ($updatedOrder | Select-String '"status"\s*:\s*"([^"]*)"').Matches[0].Groups[1].Value
    $adminNotes = ($updatedOrder | Select-String '"adminNotes"\s*:\s*"([^"]*)"').Matches[0].Groups[1].Value
    
    Write-Host "✅ Vérification réussie !" -ForegroundColor Green
    Write-Host "   Nouveau statut: $newStatus" -ForegroundColor Green
    Write-Host "   Notes admin: $adminNotes" -ForegroundColor White
    
    # Étape 5: Résumé final
    Write-Host "`n📋 RÉSUMÉ FINAL" -ForegroundColor Cyan
    Write-Host "=" * 30 -ForegroundColor Cyan
    Write-Host "Commande: $OrderNumber" -ForegroundColor White
    Write-Host "Changement: $currentStatus → $newStatus" -ForegroundColor Yellow
    Write-Host "Statut: ✅ SUCCÈS" -ForegroundColor Green
    Write-Host "Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor White
    
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎯 Opération terminée avec succès !" -ForegroundColor Green
