cd views/
csplit --suppress-matched --prefix=add_item_ -b "%01d.ejs" add_item.ejs "/split/"
cd ../
tsc --build tsconfig.json