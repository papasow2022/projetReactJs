# Script PowerShell pour lister les commandes disponibles
# Usage: .\list-orders.ps1

Write-Host "📋 Liste des commandes disponibles" -ForegroundColor Cyan
Write-Host "=" * 40 -ForegroundColor Cyan

try {
    # Configuration MongoDB
    $mongoConnectionString = "mongodb://localhost:27017/ecommerce"
    
    # Commande pour lister toutes les commandes
    $listCommand = @"
db.orders.find(
    {},
    {
        "orderNumber": 1,
        "status": 1,
        "customer.firstName": 1,
        "customer.lastName": 1,
        "customer.email": 1,
        "total": 1,
        "orderDate": 1
    }
).sort({ "orderDate": -1 })
"@
    
    Write-Host "Récupération des commandes..." -ForegroundColor White
    
    $orders = mongosh --quiet --eval $listCommand $mongoConnectionString
    
    if ($orders -match "null" -or $orders.Trim() -eq "") {
        Write-Host "❌ Aucune commande trouvée dans la base de données" -ForegroundColor Red
        exit 0
    }
    
    # Parser et afficher les commandes
    $orderLines = $orders -split "`n" | Where-Object { $_ -match "orderNumber" }
    
    Write-Host "`n📊 Commandes trouvées:" -ForegroundColor Green
    
    $index = 1
    foreach ($line in $orderLines) {
        if ($line -match '"orderNumber"\s*:\s*"([^"]*)"') {
            $orderNumber = $matches[1]
            
            # Trouver les autres propriétés dans les lignes suivantes
            $status = "N/A"
            $customerName = "N/A"
            $total = "N/A"
            $date = "N/A"
            
            # Chercher dans les lignes autour
            $startIndex = [array]::IndexOf($orderLines, $line)
            for ($i = $startIndex; $i -lt [Math]::Min($startIndex + 10, $orderLines.Length); $i++) {
                if ($orderLines[$i] -match '"status"\s*:\s*"([^"]*)"') {
                    $status = $matches[1]
                }
                if ($orderLines[$i] -match '"firstName"\s*:\s*"([^"]*)"') {
                    $firstName = $matches[1]
                }
                if ($orderLines[$i] -match '"lastName"\s*:\s*"([^"]*)"') {
                    $lastName = $matches[1]
                    $customerName = "$firstName $lastName"
                }
                if ($orderLines[$i] -match '"total"\s*:\s*(\d+)') {
                    $total = $matches[1]
                }
                if ($orderLines[$i] -match '"orderDate"\s*:\s*ISODate\("([^"]*)"\)') {
                    $date = $matches[1]
                }
            }
            
            # Afficher la commande
            Write-Host "`n$index. Commande #$orderNumber" -ForegroundColor Yellow
            Write-Host "   👤 Client: $customerName" -ForegroundColor White
            Write-Host "   🏷️ Statut: $status" -ForegroundColor Cyan
            Write-Host "   💰 Total: $total GNF" -ForegroundColor Green
            Write-Host "   📅 Date: $date" -ForegroundColor Gray
            
            $index++
        }
    }
    
    Write-Host "`n📋 Utilisation du script de changement de statut:" -ForegroundColor Cyan
    Write-Host ".\change-order-status.ps1 -OrderNumber `"CMD250914662`" -NewStatus `"ready`"" -ForegroundColor White
    
    Write-Host "`n🏷️ Statuts disponibles:" -ForegroundColor Cyan
    Write-Host "   - pending (En attente)" -ForegroundColor White
    Write-Host "   - confirmed (Confirmée)" -ForegroundColor White
    Write-Host "   - preparing (En préparation)" -ForegroundColor White
    Write-Host "   - ready (Prête)" -ForegroundColor White
    Write-Host "   - shipped (Expédiée)" -ForegroundColor White
    Write-Host "   - delivered (Livrée)" -ForegroundColor White
    Write-Host "   - cancelled (Annulée)" -ForegroundColor White
    
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Liste terminée !" -ForegroundColor Green
