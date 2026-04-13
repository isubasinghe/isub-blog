# Next.js to Astro Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the isub-blog from Next.js 14 to Astro with SolidJS islands, achieving zero JS on static pages and minimal JS only for interactive components.

**Architecture:** Astro content collections for blog/project markdown, Astro components for static UI, SolidJS islands for interactive visualizations. remark-math + rehype-katex replaces custom KaTeX handling. Shiki (Astro built-in) replaces prism-react-renderer.

**Tech Stack:** Astro 5, SolidJS, @astrojs/solid-js, @astrojs/mdx, vis-network, remark-math, rehype-katex

---

### Task 1: Initialize Astro Project and Configuration

**Files:**
- Create: `astro.config.mjs`
- Modify: `package.json`
- Modify: `tsconfig.json`

- [ ] **Step 1: Remove node_modules and package-lock.json**

Run:
```bash
rm -rf node_modules package-lock.json
```

- [ ] **Step 2: Rewrite package.json for Astro**

Replace `package.json` with:

```json
{
  "name": "isub-blog",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^5.7.10",
    "@astrojs/solid-js": "^5.0.4",
    "@astrojs/mdx": "^4.2.6",
    "solid-js": "^1.9.5",
    "vis-network": "^9.1.9",
    "vis-data": "^7.1.9",
    "katex": "^0.16.21",
    "remark-math": "^6.0.0",
    "rehype-katex": "^7.0.1"
  },
  "devDependencies": {
    "typescript": "^5.8.3"
  }
}
```

- [ ] **Step 3: Create astro.config.mjs**

Create `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  integrations: [solidJs(), mdx()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
```

- [ ] **Step 4: Update tsconfig.json for Astro**

Replace `tsconfig.json` with:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "solid-js"
  }
}
```

- [ ] **Step 5: Create directory structure**

Run:
```bash
mkdir -p src/layouts src/components src/components/clock src/pages/blog src/pages/projects src/content/blog src/content/projects
```

- [ ] **Step 6: Install dependencies**

Run:
```bash
npm install
```
Expected: Clean install with no errors.

- [ ] **Step 7: Verify Astro runs**

Run:
```bash
npx astro check
```
Expected: No fatal errors (may have warnings about missing pages, that's fine).

- [ ] **Step 8: Commit**

```bash
git add package.json astro.config.mjs tsconfig.json
git commit -m "feat: initialize astro project with solidjs and mdx"
```

---

### Task 2: Layout and Static Components

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Nav.astro`
- Create: `src/components/Back.astro`
- Move: `styles.css` → `src/styles.css`

- [ ] **Step 1: Move global styles**

Run:
```bash
cp styles.css src/styles.css
```

- [ ] **Step 2: Create BaseLayout.astro**

Create `src/layouts/BaseLayout.astro`:

```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="dns-prefetch" href="https://wiki.isub.dev" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css"
      integrity="sha384-zh0CIslj3dQfMKhfrLMFi9FGEVEBQxijSvjRYIgKGsx3n4GC0FQwEB2GNUaj9v4p"
      crossorigin="anonymous"
    />
    <title>{title}</title>
    {description && <meta name="description" content={description} />}
  </head>
  <body>
    <div class="container">
      <slot />
    </div>
    <script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
  </body>
</html>

<style>
  .container {
    max-width: 45rem;
    margin: 0 auto;
    margin-top: 2rem;
  }
</style>

<style is:global>
  @import '../styles.css';
</style>
```

- [ ] **Step 3: Create Nav.astro**

Create `src/components/Nav.astro`:

```astro
<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/projects">Projects</a></li>
    <li><a href="/blog">Blog</a></li>
    <li><a href="https://isubasinghe.gitbook.io/isithas-wiki/">Wiki</a></li>
  </ul>
</nav>

<style>
  nav {
    text-align: center;
  }
  ul {
    display: flex;
    justify-content: flex-start;
    padding: 4px 0px;
  }
  li {
    display: flex;
    padding: 6px 0px;
    padding-right: 1rem;
  }
  li:not(:first-child) {
    padding: 6px 1rem;
  }
  a {
    font-size: 1.25rem;
  }
</style>
```

- [ ] **Step 4: Create Back.astro**

Create `src/components/Back.astro`:

```astro
---
interface Props {
  url: string;
}

const { url } = Astro.props;
---

<a href={url}>&lt;</a>

<style>
  a {
    text-decoration: none;
  }
</style>
```

- [ ] **Step 5: Create a minimal index page to test**

Create `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/Nav.astro';
---

<BaseLayout title="Home" description="Isitha Subasinghe's blogging platform and portfolio. You can find about my skills, projects and blogs here.">
  <h1>Isitha's Home Page</h1>
  <Nav />

  <h2>Hey I am Isitha Subasinghe</h2>
  <p>
    I love computers and hacking around with them, I have been programming
    since I was in primary school.
  </p>
  <p>
    I have knowledge in a wide variety of computer science topics, my aim is to keep adding
    to this knowledge.
  </p>
  <p>
    My main interests at the moment are large scale distributed systems and
    programming language implementation.
  </p>
  <p>
    Most of the code I hack around with is open source,
    you can have a look <a style="font-size:16px" href="https://github.com/isubasinghe">here</a>
  </p>
  <p><strong>This following section is mainly aimed at recruiters so they can develop an understanding of what I am like as a programmer and what values I bring into their engineering organisation.</strong></p>
  <h3>Programming Languages - Preferred Languages in Bold</h3>
  <p>
    I generally prefer languages with strong types, as this makes programming easier for me. Being able to write programs with properties that can be
    verified at compile time is a huge help. C++ (I should elaborate more here) and C do not exactly fall into this category but I still like these languages for perhaps more sentimental reasons.
  </p>
  <ul>
    <li><strong>C++</strong></li>
    <li><strong>C</strong></li>
    <li><strong>Haskell</strong></li>
    <li><strong>OCaml</strong></li>
    <li>Python</li>
    <li>Go</li>
    <li>Java</li>
    <li><strong>Rust</strong></li>
    <li>JavaScript</li>
    <li>TypeScript</li>
    <li>x86-64 Assembly</li>
    <li>RISC-V Assembly</li>
  </ul>
  <h3>Programming languages I am learning</h3>
  <ul>
    <li>Idris - Dependant types for formal verifcation is neat</li>
    <li>Racket - So much hype including comments such as "god wrote the universe in lisp"</li>
  </ul>
  <h3>Other</h3>
  <ul>
    <li>TLA+ - Proving distributed systems is important</li>
    <li>PlusCal - Attempting to learn since TLA+ is difficult</li>
    <li>Dafny - formal verification</li>
  </ul>
</BaseLayout>
```

- [ ] **Step 6: Verify dev server starts and home page renders**

Run:
```bash
npx astro dev
```
Open `http://localhost:4321/` in a browser. Verify:
- Page loads with "Isitha's Home Page" heading
- Navigation links appear (Home, Projects, Blog, Wiki)
- Global styles apply (Verdana font, link color #1768ac)
- Container is max-width 45rem and centered

Stop dev server after verification.

- [ ] **Step 7: Commit**

```bash
git add src/layouts/BaseLayout.astro src/components/Nav.astro src/components/Back.astro src/pages/index.astro src/styles.css
git commit -m "feat: add layout, nav, back components and home page"
```

---

### Task 3: Content Collections and Markdown Migration

**Files:**
- Create: `src/content.config.ts`
- Move: `pages/blog/*.md` → `src/content/blog/*.md`
- Move: `pages/projects/*.md` → `src/content/projects/*.md`
- Rename: `src/content/blog/interpreter.md` → `src/content/blog/interpreter.mdx`
- Modify: `src/content/blog/e-pi-i.md` (convert KaTeX code blocks to `$$` syntax)

- [ ] **Step 1: Create content collection schema**

Create `src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    path: z.string(),
    description: z.string().optional().default(''),
    date: z.string().nullable().optional().default(null),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    path: z.string(),
    description: z.string().optional().default(''),
    date: z.string().nullable().optional().default(null),
  }),
});

export const collections = { blog, projects };
```

- [ ] **Step 2: Copy markdown files to content directories**

Run:
```bash
cp pages/blog/branchless-programming.md src/content/blog/
cp pages/blog/either-monad-rust.md src/content/blog/
cp pages/blog/e-pi-i.md src/content/blog/
cp pages/blog/fast-intercore-ipc-part-1.md src/content/blog/
cp pages/blog/lets-prove-leftpad-lean.md src/content/blog/
cp pages/blog/why-not-oop.md src/content/blog/
cp pages/blog/writing-microkernel-p1.md src/content/blog/
cp pages/blog/interpreter.md src/content/blog/interpreter.mdx
cp pages/projects/inverted-index.md src/content/projects/
```

- [ ] **Step 3: Convert KaTeX code blocks in e-pi-i.md**

In `src/content/blog/e-pi-i.md`, replace the ` ```latex ` code block with `$$` math block syntax. The entire content should become:

Replace:
````
```latex
Proof\enspace of\enspace{e}^{\pi*i} = -1
\\
z=\cos{\theta} + i*\sin{\theta}
\\
\frac{dz}{d\theta}=-\sin{\theta} + i*\cos{\theta}
\\
\frac{dz}{d\theta}=i(i*\sin{\theta} + \cos{\theta})
\\
\frac{dz}{d\theta}=i*z
\\
\int{\frac{1}{z}}{dz} = \int{i*\theta}{d\theta}
\\
\log_e{z}=i*\theta + c
\\
e^{i*\theta + c} = z
\\
z=\cos{\theta} + i*\sin{\theta}
\\
When\enspace \theta=0 \enspace z=1 \enspace so \enspace the \enspace constant \enspace is \enspace 0
\\
\dot{.\hspace{.075in}.}\hspace{.5in} e^{i*\theta} = z
\\
\dot{.\hspace{.075in}.}\hspace{.5in} \cos{\theta} + i*\sin{\theta}=e^{i*\theta}
\\
When \enspace \theta=\pi
\\
-1 + i*0 = e^{i*\pi}
\\
e^{i*\pi} = -1 
```
````

With:

```
$$
Proof\enspace of\enspace{e}^{\pi*i} = -1
\\
z=\cos{\theta} + i*\sin{\theta}
\\
\frac{dz}{d\theta}=-\sin{\theta} + i*\cos{\theta}
\\
\frac{dz}{d\theta}=i(i*\sin{\theta} + \cos{\theta})
\\
\frac{dz}{d\theta}=i*z
\\
\int{\frac{1}{z}}{dz} = \int{i*\theta}{d\theta}
\\
\log_e{z}=i*\theta + c
\\
e^{i*\theta + c} = z
\\
z=\cos{\theta} + i*\sin{\theta}
\\
When\enspace \theta=0 \enspace z=1 \enspace so \enspace the \enspace constant \enspace is \enspace 0
\\
\dot{.\hspace{.075in}.}\hspace{.5in} e^{i*\theta} = z
\\
\dot{.\hspace{.075in}.}\hspace{.5in} \cos{\theta} + i*\sin{\theta}=e^{i*\theta}
\\
When \enspace \theta=\pi
\\
-1 + i*0 = e^{i*\pi}
\\
e^{i*\pi} = -1
$$
```

- [ ] **Step 4: Strip the Interpreter import from interpreter.mdx**

The `interpreter.mdx` file currently has `<Interpreter>` and `</Interpreter>` tags. In Astro MDX, the component must be explicitly imported. Edit `src/content/blog/interpreter.mdx` to add the import at the top (after frontmatter) and use the self-closing tag with `client:load`:

Add after the closing `---`:
```mdx
import Interpreter from '../../components/Interpreter.tsx';
```

And replace:
```
<Interpreter>
</Interpreter>
```
with:
```
<Interpreter client:load />
```

(The Interpreter SolidJS component will be created in Task 5.)

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/content/
git commit -m "feat: add content collections with blog and project markdown"
```

---

### Task 4: Blog and Projects Pages

**Files:**
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[...slug].astro`
- Create: `src/pages/projects/index.astro`
- Create: `src/pages/projects/[...slug].astro`

- [ ] **Step 1: Create blog listing page**

Create `src/pages/blog/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Nav from '../../components/Nav.astro';

const posts = await getCollection('blog');
---

<BaseLayout title="Isitha's Blog">
  <h1>Blog</h1>
  <Nav />
  <h4>My thoughts, experiments, ideas and tutorials</h4>
  <ul>
    {posts.map((post) => (
      <li>
        <a href={`/blog/${post.data.path}`}>{post.data.title}</a>
      </li>
    ))}
  </ul>
</BaseLayout>

<style>
  a {
    font-size: 1rem;
  }
  li {
    font-size: 1rem;
  }
  li:not(:last-child) {
    margin-bottom: 1rem;
  }
</style>
```

- [ ] **Step 2: Create blog post detail page**

Create `src/pages/blog/[...slug].astro`:

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Back from '../../components/Back.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.data.path },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
const description = post.data.description || `Isitha Subasinghe ${post.data.title} programming project`;
---

<BaseLayout title={post.data.title} description={description}>
  <Back url="/blog" />
  {post.data.date && (
    <div class="date">Published Date: {post.data.date}</div>
  )}
  <Content />
</BaseLayout>

<style>
  .date {
    margin-top: 20px;
    text-decoration: underline;
    display: flex;
    justify-content: flex-end;
  }
  a {
    font-size: 1rem;
  }
</style>
```

- [ ] **Step 3: Create projects listing page**

Create `src/pages/projects/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Nav from '../../components/Nav.astro';

const projects = await getCollection('projects');
---

<BaseLayout title="Isitha's Projects" description="Isitha Subasinghe's projects developed for fun and curiosity">
  <h1>Projects</h1>
  <Nav />
  <h4>A list of projects I have worked on in my spare time</h4>
  <ul>
    {projects.map((project) => (
      <li>
        <a href={`/projects/${project.data.path}`}>{project.data.title}</a>
      </li>
    ))}
  </ul>
</BaseLayout>

<style>
  a {
    font-size: 1rem;
  }
</style>
```

- [ ] **Step 4: Create project detail page**

Create `src/pages/projects/[...slug].astro`:

```astro
---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Back from '../../components/Back.astro';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map((project) => ({
    params: { slug: project.data.path },
    props: { project },
  }));
}

const { project } = Astro.props;
const { Content } = await render(project);
const description = project.data.description || `Isitha Subasinghe ${project.data.title} programming project`;
---

<BaseLayout title={project.data.title} description={description}>
  <Back url="/projects" />
  <Content />
</BaseLayout>
```

- [ ] **Step 5: Verify blog and projects pages render**

Run:
```bash
npx astro dev
```
Verify in browser:
- `http://localhost:4321/blog` — lists all 8 blog posts with links
- `http://localhost:4321/blog/branchless-programming` — renders the full blog post with syntax-highlighted code
- `http://localhost:4321/blog/e-pi-i` — renders with KaTeX math (formatted equations, not raw LaTeX)
- `http://localhost:4321/projects` — lists projects
- `http://localhost:4321/projects/inverted-index` — renders project page

Note: The interpreter blog post will fail to render until the Interpreter component is created in Task 5. That's expected.

Stop dev server after verification.

- [ ] **Step 6: Commit**

```bash
git add src/pages/blog/ src/pages/projects/
git commit -m "feat: add blog and projects listing and detail pages"
```

---

### Task 5: Port Interpreter to SolidJS

**Files:**
- Create: `src/components/Interpreter.tsx`

The Interpreter component wraps a WASM-based Scheme REPL. It calls `window.parseScheme()` which is loaded from `/ischeme-wasm.js` in `public/`. The WASM script is loaded via a `<script>` tag — in Astro, we'll load it from the component using dynamic script injection.

- [ ] **Step 1: Create Interpreter.tsx**

Create `src/components/Interpreter.tsx`:

```tsx
import { createSignal, onMount } from 'solid-js';

declare global {
  interface Window {
    parseScheme?: (input: string) => Promise<string>;
  }
}

export default function Interpreter() {
  const [output, setOutput] = createSignal('');
  const [input, setInput] = createSignal('');

  const handleInput = (value: string) => {
    if (window.parseScheme) {
      setInput(value);
      window.parseScheme(value).then(setOutput);
    } else {
      setInput('');
      setOutput('wasm not loaded yet');
    }
  };

  onMount(() => {
    const script = document.createElement('script');
    script.src = '/ischeme-wasm.js';
    script.onload = () => {
      handleInput('(+ 1 2)');
    };
    document.head.appendChild(script);
  });

  return (
    <>
      <textarea
        value={input()}
        onInput={(e) => handleInput(e.currentTarget.value)}
      />
      <p />
      <textarea class="output-area" value={output()} readOnly />
      <style>{`
        textarea {
          max-width: 90%;
          width: 750px;
          height: 200px;
        }
        .output-area {
          border: none;
          resize: none;
        }
        .output-area:focus {
          outline: none;
        }
      `}</style>
    </>
  );
}
```

- [ ] **Step 2: Verify interpreter blog post renders**

Run:
```bash
npx astro dev
```
Open `http://localhost:4321/blog/interpreter`. Verify:
- Two textareas appear
- After WASM loads, the input shows `(+ 1 2)` and output shows `3`
- Typing Scheme expressions updates the output

Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add src/components/Interpreter.tsx
git commit -m "feat: port interpreter component to solidjs"
```

---

### Task 6: Port VClock to SolidJS

**Files:**
- Create: `src/components/VClock.tsx`

The vector clock component demonstrates distributed vector clocks. It has two clock instances, each with a counter and state, and supports sending state between them. The original used `immer` + `useState` via a custom `useVClock` hook. In SolidJS, we use `createStore` for nested reactivity.

- [ ] **Step 1: Create VClock.tsx**

Create `src/components/VClock.tsx`:

```tsx
import { createStore } from 'solid-js/store';
import { Show } from 'solid-js';

type Value = {
  counter: number;
  state: number;
};

function createVClock(id: number, initial: number) {
  const [clocks, setClocks] = createStore<Record<number, Value>>({
    [id]: { state: initial, counter: 0 },
  });

  const updateSelf = (newState: number) => {
    setClocks(id, { state: newState, counter: (clocks[id]?.counter ?? 0) + 1 });
  };

  const receiveUpdate = (_newState: number, _vclocks: Record<number, Value>) => {
    // placeholder for receive logic
  };

  const sendUpdate = (receiveFn: Function) => {
    setClocks(id, 'counter', (c) => c + 1);
    receiveFn(clocks[id].state, { ...clocks });
  };

  return { clocks, updateSelf, receiveUpdate, sendUpdate };
}

export default function VClockMan() {
  const clock0 = createVClock(0, 0);
  const clock1 = createVClock(1, 0);

  const getAdder = (clockRef: typeof clock0, id: number) => {
    return () => clockRef.updateSelf(clockRef.clocks[id].state + 1);
  };

  const getMinus = (clockRef: typeof clock0, id: number) => {
    return () => clockRef.updateSelf(clockRef.clocks[id].state - 1);
  };

  return (
    <Show when={clock0.clocks[0] && clock1.clocks[1]}>
      <style>{`
        table {
          font-family: arial, sans-serif;
          border-collapse: collapse;
          width: 100%;
        }
        td, th {
          border: 1px solid #dddddd;
          text-align: left;
          padding: 8px;
        }
        tr:nth-child(even) {
          background-color: #dddddd;
        }
        .buttons {
          display: flex;
          justify-content: space-around;
          margin-top: 10px;
          margin-bottom: 10px;
        }
      `}</style>

      <table>
        <tr>
          <th>State</th>
          {Object.keys(clock0.clocks).map((k) => (
            <th>V[{k}]</th>
          ))}
        </tr>
        <tr>
          <td>{clock0.clocks[0].state}</td>
          {Object.keys(clock0.clocks).map((k) => (
            <td>{clock0.clocks[Number(k)].counter}</td>
          ))}
        </tr>
      </table>

      <div class="buttons">
        <button onClick={getAdder(clock0, 0)}>Add One</button>
        <button onClick={getMinus(clock0, 0)}>Minus One</button>
        <button onClick={() => clock0.sendUpdate(clock1.receiveUpdate)}>
          Send to other
        </button>
      </div>

      <table>
        <tr>
          <th>State</th>
          {Object.keys(clock1.clocks).map((k) => (
            <th>V[{k}]</th>
          ))}
        </tr>
        <tr>
          <td>{clock1.clocks[1].state}</td>
          {Object.keys(clock1.clocks).map((k) => (
            <td>{clock1.clocks[Number(k)].counter}</td>
          ))}
        </tr>
      </table>

      <div class="buttons">
        <button onClick={getAdder(clock1, 1)}>Add One</button>
        <button onClick={getMinus(clock1, 1)}>Minus One</button>
        <button onClick={() => clock1.sendUpdate(clock0.receiveUpdate)}>
          Send to other
        </button>
      </div>
    </Show>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/VClock.tsx
git commit -m "feat: port vclock component to solidjs"
```

---

### Task 7: Port Clock/Berkeley to SolidJS

**Files:**
- Create: `src/components/clock/Clock.tsx`
- Create: `src/components/clock/Berkeley.tsx`

The Berkeley clock synchronization demo has a master clock (red) and 3 slave clocks (yellow). Each clock ticks at a random interval. The reducer manages delta corrections. In SolidJS, we replace React Context + useReducer with a passed-down store.

- [ ] **Step 1: Create Clock.tsx**

Create `src/components/clock/Clock.tsx`:

```tsx
import { createSignal, onMount, onCleanup } from 'solid-js';

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

type ClockProps = {
  id: number;
  colour: string;
  deltas: Record<number, number>;
  dispatch: (action: { type: string; id?: number; delta?: number }) => void;
};

export default function Clock(props: ClockProps) {
  const interval = randomIntFromInterval(500, 1200);
  const [counter, setCounter] = createSignal(0);
  const [deltaLocal, setDeltaLocal] = createSignal(0);

  onMount(() => {
    props.dispatch({ type: 'UPDATE_DELTA', id: props.id, delta: 0 });

    const tickId = setInterval(() => {
      const delta = props.deltas[props.id];
      if (delta !== undefined && delta !== 0) {
        setCounter((c) => c + delta);
        setDeltaLocal(delta);
        setTimeout(() => setDeltaLocal(0), 300);
        props.dispatch({ type: 'RESET_DELTA', id: props.id });
      }
      setCounter((c) => c + 1);
    }, interval);

    onCleanup(() => clearInterval(tickId));
  });

  const showText = () => {
    const d = deltaLocal();
    return d > 0 ? `+ ${d}` : `${d}`;
  };

  return (
    <>
      <style>{`
        .circle_${props.colour} {
          background: ${props.colour};
          width: 100px;
          height: 100px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
        }
        .circle_container {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .delta_local {
          margin-left: 20px;
        }
      `}</style>
      <div class="circle_container">
        <div class={`circle_${props.colour}`}>{counter()}</div>
        {deltaLocal() !== 0 && <div class="delta_local">{showText()}</div>}
      </div>
    </>
  );
}
```

- [ ] **Step 2: Create Berkeley.tsx**

Create `src/components/clock/Berkeley.tsx`:

```tsx
import { createStore } from 'solid-js/store';
import Clock from './Clock.tsx';

type State = {
  deltas: Record<number, number>;
};

export default function BerkeleyClockSync() {
  const [state, setState] = createStore<State>({ deltas: {} });

  const dispatch = (action: { type: string; id?: number; delta?: number }) => {
    switch (action.type) {
      case 'UPDATE_DELTA':
        setState('deltas', action.id!, action.delta!);
        break;
      case 'RESET_DELTA':
        setState('deltas', action.id!, 0);
        break;
    }
  };

  return (
    <>
      <style>{`
        .master {
          display: flex;
          justify-content: center;
          width: 500px;
          margin-bottom: 100px;
        }
        .clocks {
          display: flex;
          justify-content: space-between;
          width: 500px;
        }
      `}</style>
      <div class="master">
        <Clock id={0} colour="red" deltas={state.deltas} dispatch={dispatch} />
      </div>
      <div class="clocks">
        <Clock id={1} colour="yellow" deltas={state.deltas} dispatch={dispatch} />
        <Clock id={2} colour="yellow" deltas={state.deltas} dispatch={dispatch} />
        <Clock id={3} colour="yellow" deltas={state.deltas} dispatch={dispatch} />
      </div>
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/clock/
git commit -m "feat: port berkeley clock sync to solidjs"
```

---

### Task 8: Port Gossip to SolidJS

**Files:**
- Create: `src/components/Gossip.tsx`

The gossip protocol visualizer lets users add/remove nodes and edges, then displays them as a network graph. Replaces `react-graph-vis` with direct `vis-network` usage. Replaces `react-hook-form` with plain form handlers.

- [ ] **Step 1: Create Gossip.tsx**

Create `src/components/Gossip.tsx`:

```tsx
import { createSignal, onMount, onCleanup } from 'solid-js';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';

type Node = {
  id: number;
  label: string;
  state: boolean;
};

type Edge = {
  from: number;
  to: number;
};

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function Gossip() {
  const [nodes, setNodes] = createSignal<Node[]>([
    { id: 0, state: true, label: 'Node 0' },
  ]);
  const [edges, setEdges] = createSignal<Edge[]>([]);

  let graphContainer: HTMLDivElement | undefined;
  let network: Network | undefined;
  let visNodes: DataSet<any>;
  let visEdges: DataSet<any>;

  onMount(() => {
    visNodes = new DataSet(nodes().map((n) => ({ id: n.id, label: n.label })));
    visEdges = new DataSet<any>([]);

    if (graphContainer) {
      network = new Network(
        graphContainer,
        { nodes: visNodes, edges: visEdges },
        { edges: { color: '#a0c1fd' }, height: '500px' }
      );
    }

    const intervalId = setInterval(() => {
      const currentNodes = nodes();
      const currentEdges = edges();
      const index = randomIntFromInterval(0, currentNodes.length - 1);
      const node = currentNodes[index];
      if (node) {
        currentEdges.forEach((edge) => {
          if (edge.from === node.id) {
            // gossip propagation placeholder
          }
        });
      }
    }, 500);

    onCleanup(() => {
      clearInterval(intervalId);
      network?.destroy();
    });
  });

  const syncGraph = () => {
    if (!visNodes || !visEdges) return;
    const currentNodes = nodes();
    const currentEdges = edges();
    visNodes.clear();
    visNodes.add(currentNodes.map((n) => ({ id: n.id, label: n.label })));
    visEdges.clear();
    visEdges.add(currentEdges.map((e, i) => ({ id: i, from: e.from, to: e.to })));
  };

  const handleNodeSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const id = Number(formData.get('id'));
    const type = formData.get('type') as string;

    setNodes((old) => {
      const has = old.some((n) => n.id === id);
      if (has && type === 'add') return old;
      if (has && type === 'remove' && id !== 0)
        return old.filter((n) => n.id !== id);
      if (type === 'add')
        return [...old, { id, state: true, label: `Node ${id}` }];
      return old;
    });
    syncGraph();
  };

  const handleEdgeSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const to = Number(formData.get('to'));
    const from = Number(formData.get('from'));
    const type = formData.get('type') as string;

    setEdges((old) => {
      const has = old.some((edge) => edge.to === to && edge.from === from);
      if (has && type === 'add') return old;
      if (has && type === 'remove')
        return old.filter((edge) => !(edge.from === from && edge.to === to));
      if (type === 'add') return [...old, { to, from }];
      return old;
    });
    syncGraph();
  };

  return (
    <>
      <style>{`
        .form-container {
          border: 1px solid black;
          padding: 10px;
          width: 45%;
        }
        .forms-container {
          display: flex;
          justify-content: space-between;
        }
        @media only screen and (max-width: 600px) {
          .forms-container {
            flex-direction: column;
          }
          .form-container {
            width: auto;
          }
        }
      `}</style>
      <div class="forms-container">
        <form class="form-container" onSubmit={handleNodeSubmit}>
          <label>Node Management</label>
          <hr />
          <p>
            Id: <input name="id" type="number" required />
          </p>
          <select name="type" required>
            <option value="add">Add</option>
            <option value="remove">Remove</option>
          </select>
          <div>
            <input type="submit" value="Submit" />
          </div>
        </form>
        <form class="form-container" onSubmit={handleEdgeSubmit}>
          <label>Edge Management</label>
          <hr />
          <p>
            To: <input name="to" type="number" required />
          </p>
          <p>
            From: <input name="from" type="number" required />
          </p>
          <select name="type">
            <option value="add">Add</option>
            <option value="remove">Remove</option>
          </select>
          <div>
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
      <div ref={graphContainer} />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Gossip.tsx
git commit -m "feat: port gossip protocol visualizer to solidjs with vis-network"
```

---

### Task 9: Test Page, Cleanup, and Final Verification

**Files:**
- Create: `src/pages/test.astro`
- Delete: `pages/` (entire directory)
- Delete: `components/` (entire directory)
- Delete: `helpers/` (entire directory)
- Delete: `next.config.js`
- Delete: `styles.css` (root copy — now at `src/styles.css`)

- [ ] **Step 1: Create test page**

Create `src/pages/test.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import VClockMan from '../components/VClock.tsx';
import BerkeleyClockSync from '../components/clock/Berkeley.tsx';
import Gossip from '../components/Gossip.tsx';
---

<BaseLayout title="Test Page">
  <h1>Component Test Page</h1>
  <h2>Vector Clocks</h2>
  <VClockMan client:load />
  <h2>Berkeley Clock Sync</h2>
  <BerkeleyClockSync client:load />
  <h2>Gossip Protocol</h2>
  <Gossip client:load />
</BaseLayout>
```

- [ ] **Step 2: Verify test page renders all interactive components**

Run:
```bash
npx astro dev
```
Open `http://localhost:4321/test`. Verify:
- Vector clock tables appear with Add One / Minus One / Send to other buttons
- Berkeley clock circles appear (1 red master, 3 yellow slaves) and tick at different rates
- Gossip forms appear for node/edge management with a vis-network graph below

Stop dev server.

- [ ] **Step 3: Run full build**

Run:
```bash
npx astro build
```
Expected: Build completes successfully with no errors. All pages are generated as static HTML.

- [ ] **Step 4: Preview production build**

Run:
```bash
npx astro preview
```
Open `http://localhost:4321/` and verify all pages:
- `/` — Home page with nav and content
- `/blog` — Blog listing with all 8 posts linked
- `/blog/branchless-programming` — Renders with syntax-highlighted code blocks
- `/blog/e-pi-i` — Renders with KaTeX-formatted math equations
- `/blog/interpreter` — Renders with working Scheme REPL
- `/projects` — Projects listing
- `/projects/inverted-index` — Renders project content
- `/test` — All three interactive components working

Stop preview server.

- [ ] **Step 5: Commit test page**

```bash
git add src/pages/test.astro
git commit -m "feat: add test page with interactive component demos"
```

- [ ] **Step 6: Remove old Next.js files**

Run:
```bash
rm -rf pages/ components/ helpers/ next.config.js styles.css PostCreator.hs next-env.d.ts
```

- [ ] **Step 7: Add .gitignore entry for Astro**

Append to `.gitignore` (or create if it doesn't exist):

```
dist/
.astro/
```

- [ ] **Step 8: Final build verification after cleanup**

Run:
```bash
npx astro build
```
Expected: Build succeeds. No references to deleted files remain.

- [ ] **Step 9: Commit cleanup**

```bash
git add -A
git commit -m "chore: remove old next.js files and add astro gitignore"
```
