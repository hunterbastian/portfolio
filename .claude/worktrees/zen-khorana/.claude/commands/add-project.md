---
description: Scaffold a new project page
argument-hint: [project-name]
allowed-tools: Bash, Write, Read
---

Create a new project MDX file at `content/projects/$ARGUMENTS.mdx` with the standard frontmatter template:

```mdx
---
title: ""
displayTitle: ""
description: ""
category: ""
tags: []
image: "/images/optimized/projects/"
video: ""
demo: ""
github: ""
figjam: ""
featured: false
date: ""
---
```

Then remind the user to:
- Add the project image to `public/images/projects/`
- Run `npm run optimize-images` to generate the webp version
- Fill in the frontmatter fields
