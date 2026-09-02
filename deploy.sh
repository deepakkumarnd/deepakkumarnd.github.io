rsync -av --delete blog/public/ docs/
cp CNAME docs/
git add docs/
today=$(date)
echo "Publish new update on $today"
git commit -m "Publish new update on $today"
git push origin master

