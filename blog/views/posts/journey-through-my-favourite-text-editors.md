<!--
title: Journey through my favourite text editors
date: 02/10/2026
lang: en
category: Reflections
tags: writing, editor
-->

# {post_title}

I have been using many text editors since my college days. College days because that's when I brought my first computer financed by an educational loan from Canara Bank. **Notepad**, **Wordpad** were the default text editors in windows. **Gedit** was my go-to editor on Linux. 

I rarely used word processors such as **Microsoft Word** or **OpenOffice Writer** because most of my writings was either code or technical. But I must admit that the spelling and grammar checking available on those word processors were something I missed on normal text editors of those days.

I have been a long term user of many variants of Linux operating system. Ubuntu was my favorite choice. For many years they used to send free CD's to install Ubuntu. On those days internet was so slow that downloading and installation image of around 700MB can take many hours. Post download you need to make an installation media by writing the image into a CD. The whole process wasn't straightforward, firstly a stable internet connection wasn't available on all the computers secondly not all the computers had the hardware to write into a CD. Even if you managed to install Linux you still had to do some extra work of figuring out the missing device drivers and install them separately. I am not talking about a very distant past decade I am taking about my first two years in college 2007-2008. By 2009 we had a stable and fast internet connection from **Asianet** and never needed CD's or DVD's. We had plenty of USB sticks and external hard disks and the days of optical disks were over.

In college computer lab we had **Solaris** operating system by **Sun Microsystems** (later acquired by Oracle). We connected to the Solaris from a terminal monitor and keyboard and used a terminal interface. At our college lab we had to mandatorily use **Emacs** editor for programming. We had a printout of all the keyboard shortcuts in Emacs, it was a bit difficult to get used to keyboard shortcuts and editor modes, but we became experts in a short span and it was a great fun. **Nano** and **Pico** were used rarely to edit configurations on servers where Emacs wasn't available. **Notepad++** and **Geany** were my two other favorite choices when it comes to C programming on a GUI.

When I started my career in 2011 at a software company called **Sourcebits** my mentor was a power user of **Vim** editor. He used Vim for all his day-to-day work. Since I was a power user of Emacs I was able to do everything using Emacs. But overtime I started using Vim and started doing my day-to-day work using vim. Configuring these editors to suite our work a painful thing, configuring form scratch could take your whole weekend but still I enjoyed doing it back then and later maintained `.vimrc` and `.emacs` files to avoid repeating the configuration. Org mode in Emacs and vertical selection in Vim using visual mode is something I miss from my vim days.

Later I was introduced to **Sublime Text** by a colleague, and I was gradually switched to sublime as my primary editing tool. It was very fast, had beautiful interface, highly configurable and great plugins for my work. I have been an active user of **Sublime Text** for many years. `Control + D` to select similar words under current selection was my favorite in Sublime Text and I still use the key binding to select similar words without realizing that I am using a different editor.

Navigating a large codebase was still a difficult problem. As projects grew, jumping from a function call to its source definition could become surprisingly challenging. With multiple possible files, it wasn’t always easy to remember where a particular method or class was defined. At times, we even had to dig into the internals of a gem to understand how something worked. Back then, one of the key features missing from Sublime Text was the ability to easily click through and navigate to source definitions.

Before working extensively with Ruby, I had used **NetBeans** for Java projects in college. It was an excellent IDE for its time. It would immediately point out syntax errors, provide useful suggestions, and offer autocomplete as you typed. These features made the development experience feel smooth and productive. For Ruby, **JetBrains** released **RubyMine**, which made working with large Ruby projects much easier out of the box. It provided the essential features needed to navigate and understand a large Ruby codebase, making it much easier to jump between definitions, explore code, and work across a project.

Then came **Visual Studio Code**. Microsoft released VS Code as an open-source code editor in 2015, and it quickly gained popularity. Over time, it became much more than just another lightweight editor. With its growing ecosystem of extensions and language support, it started to blur the line between a simple text editor and a full-fledged IDE. For the past two years, I’ve been using VS Code as my primary editor, and it has become a tool I rely on every day. What I particularly enjoy is how well it supports almost every major programming language while still remaining fast and responsive. The extension ecosystem is another big part of the experience. There seems to be an extension for almost everything you need, whether it’s language support, debugging, code navigation, formatting, or tooling. More recently, with the rise of agentic coding, VS Code has become even more interesting to me. The combination of extensions, integrations, and support for AI-powered development workflows makes it feel like the editor is evolving along with the way we write software.

One final note: I’m actually writing this post in VS Code.

For writing that doesn’t involve code, I created a separate VS Code profile and configured it specifically for writing. With a few small changes, I’ve turned VS Code into a comfortable environment for writing blog posts as well.

Here’s the settings configuration I’m currently using:

```json
{
    "chat.agent.enabled": false,
    // Enable word wrap for easy reading
    "editor.wordWrap": "on",
    "editor.wordWrapColumn": 80,

    "files.autoSave": "onFocusChange",
    
    // UI clean-up for distraction-free writing
    "editor.minimap.enabled": false,
    "editor.lineNumbers": "off",
    "editor.glyphMargin": false,
    "editor.folding": false,
    "editor.guides.indentation": false,
    
    // Typography
    "editor.fontSize": 18,
    "editor.lineHeight": 1.6,
    "editor.fontFamily": "'Georgia', 'Times New Roman', serif",

    // Specific tweaks for Markdown files
    "editor.defaultFormatter": "vscode.markdown-language-features",
    "[markdown]": {
        "editor.quickSuggestions": {
            "comments": "off",
            "strings": "off",
            "other": "off"
        },
        "editor.snippetSuggestions": "none",
        "editor.wordBasedSuggestions": "off"
    }
}
```


