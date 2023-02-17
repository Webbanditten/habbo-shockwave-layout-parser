$folderPath = "../original_assets"

Get-ChildItem -Path $folderPath -Recurse | Where-Object {
    $_.Extension -eq ".png"
} | ForEach-Object {
    Write-Output $_.FullName
    $inputFilePath = $_.FullName
    $outputFilePath = "../output/"+$_.Name
    & magick convert `
      "$inputFilePath" `
      -alpha set `
      -bordercolor "white" `
      -border "1"`
      -fill "none" `
      -draw "color 0,0 floodfill"`
      -shave "1x1" `
      "$outputFilePath"
}


