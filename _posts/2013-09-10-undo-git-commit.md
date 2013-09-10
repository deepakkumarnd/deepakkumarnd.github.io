---
layout: post
title: "Undo git commit, History cleanup"
description: ""
category:
tags: []
---
{% include JB/setup %}

Sometimes you might want to undo the git commits you have done. There could be many reasons for it. You might want to remove the bullshit you have done or fixing typo and keeping the history clean etc. You can easily do these kind of stuff if you are working locally and your commits haven't pushed to remote repository yet. With a little care you can undo them on remote branch too.

Here is a sample git log

    commit 0bb3a3bfedae58d16b50856de1c933fd5b0092a5 (1)
    Author: Deepak <deepak@example.com>
    Date:   Fri Sep 6 14:08:30 2013 +0530

        fix typo

    commit fdf982879e686548ecf3e9215dca3b0c772e66ff (2)
    Author: Deepak <deepak@example.com>
    Date:   Thu Sep 5 10:50:09 2013 +0530

        cleanup syntax

    commit 962a71ccc3c4906ddf64badc8bbf393364ab26cb (3)
    Author: Deepak <deepak@example.com>
    Date:   Tue Sep 3 15:29:58 2013 +0530

        add error message format in validation response

    commit e378b0dc1927c8b20970127327a6df6aaa209159 (4)
    Author: Deepak <deepak@example.com>
    Date:   Tue Sep 3 15:26:07 2013 +0530

In the above sample commits you can see the last two commits are unwanted and this will uglify git commit history. What you want to do is to merge the last three commits. To do that just do a soft reset till the 4th commit id.

    git reset --soft e378b0dc1927c8b20970127327a6df6aaa209159

When doing a soft(--soft) reset git will retain the code changes, incase you don't want changes till that commit use hard reset(--hard). Do a git diff to view the changes.

     git diff HEAD

Now make the necessarry changes you want to make, stage/unstage the changes and create a new meaningful commit.

    git commit -m "<commit messages>"

What will happen if you have already pushed the commits to remote branch? You cannot just undo the changes on remote branch. But git provides force('-f') options which will force git to overwrite history and you can have a neat commit history. To do that push your code using -f switch.

    git push origin branchname -f

Any way this method is not recommended because it rewrites your git history, it may cause issues for other people who are having the same branch and they have already pulled the commits you want to undo. But if you are the only person using that branch and you don't mind deleting those unwanted commit history, then you are good to go with this method.
