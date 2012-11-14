---
layout: page
title: Welcome
tagline: No tagline yet
---
{% include JB/setup %}

"Light, oh where is the light? Kindle it with burning fire of desire!"
    
## Posts

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>

