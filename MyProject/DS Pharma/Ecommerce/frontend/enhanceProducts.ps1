# PowerShell script to enhance products with rating, stock, and reviewCount
# Run with: powershell -ExecutionPolicy Bypass -File enhanceProducts.ps1

$filePath = "src\data\sampleData.js"
$content = Get-Content $filePath -Raw

# Function to generate realistic values
function Get-RandomRating {
    $ratings = @(4.0, 4.2, 4.3, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0)
    return $ratings | Get-Random
}

function Get-RandomStock {
    return Get-Random -Minimum 0 -Maximum 101
}

function Get-RandomReviewCount {
    return Get-Random -Minimum 5 -Maximum 155
}

# Counter for enhancements
$count = 0

# Process each product - find inStock: true/false and add fields after it
$pattern = '(inStock:\s*(?:true|false)),(\s*image:)'

$content = [regex]::Replace($content, $pattern, {
    param($match)
    $count++
    
    $rating = Get-RandomRating
    $stock = Get-RandomStock
    $reviewCount = Get-RandomReviewCount
    
    return "$($match.Groups[1].Value),`n    stock: $stock,`n    rating: $rating,`n    reviewCount: $reviewCount,$($match.Groups[2].Value)"
})

# Write back to file
$content | Set-Content $filePath -NoNewline

Write-Host "✅ Enhanced $count products successfully!"
Write-Host "Added fields: rating, stock, reviewCount"
