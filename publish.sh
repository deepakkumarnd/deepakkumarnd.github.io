# execute in subshell and return the status
(
cd blog || exit. # return if cd fails
bundle exec parrot build
) || exit $?

rsync -av --delete blog/public/ docs/
cp CNAME docs/
git add docs/
today=$(date)
echo "Publish new update on $today"
git commit -m "Publish new update on $today"
git push origin master

