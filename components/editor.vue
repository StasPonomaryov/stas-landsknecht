<template>
  <div class="tiptap">
    <div v-if="editor">
      <UButton @click.prevent="editor.chain().focus().toggleBold().run()" icon="i-lucide-bold" size="md" class="mr-2"
        title="Bold" :disabled="!editor.can().chain().focus().toggleBold().run()"
        :variant="editor.isActive('bold') ? 'solid' : 'outline'" />
      <UButton @click.prevent="editor.chain().focus().toggleItalic().run()" icon="i-lucide-italic" size="md"
        class="mr-2" :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :variant="editor.isActive('italic') ? 'solid' : 'outline'" />
      <UButton @click.prevent="editor.chain().focus().setParagraph().run()" icon="i-lucide-square-parking" size="md"
        class="mr-2" :variant="editor.isActive('paragraph') ? 'solid' : 'outline'" />
      <UButton @click.prevent="editor.chain().focus().toggleHeading({ level: 1 }).run()" icon="i-lucide-heading-1"
        size="md" class="mr-2" :variant="editor.isActive('heading', { level: 1 }) ? 'solid' : 'outline'" />
      <UButton @click.prevent="editor.chain().focus().toggleHeading({ level: 2 }).run()" icon="i-lucide-heading-2"
        size="md" class="mr-2" :variant="editor.isActive('heading', { level: 2 }) ? 'solid' : 'outline'" />
      <UButton @click.prevent="editor.chain().focus().toggleHeading({ level: 3 }).run()" icon="i-lucide-heading-3"
        size="md" class="mr-2" :variant="editor.isActive('heading', { level: 3 }) ? 'solid' : 'outline'" />
      <UButton @click.prevent="editor.chain().focus().toggleBulletList().run()" icon="i-lucide-list" size="md"
        class="mr-2" :variant="editor.isActive('bulletList') ? 'solid' : 'outline'" />
      <UButton @click.prevent="editor.chain().focus().toggleOrderedList().run()" icon="i-lucide-list-ordered" size="md"
        class="mr-2" :variant="editor.isActive('orderedList') ? 'solid' : 'outline'" />
      <UButton @click.prevent="editor.chain().focus().setHorizontalRule().run()" icon="i-lucide-separator-horizontal"
        size="md" class="mr-2" variant="outline" title="Horizontal separator" />
      <UButton @click.prevent="editor.chain().focus().setHardBreak().run()" icon="i-lucide-corner-down-left" size="md"
        class="mr-2" variant="outline" title="Hard break" />
      <UButton @click.prevent="editor.chain().focus().undo().run()"
        :disabled="!editor.can().chain().focus().undo().run()" class="mr-2" icon="i-lucide-undo" variant="outline"
        title="Undo" />
      <UButton @click.prevent="editor.chain().focus().redo().run()"
        :disabled="!editor.can().chain().focus().redo().run()" class="mr-2" icon="i-lucide-redo" variant="outline"
        title="Redo" />
    </div>
    <TiptapEditorContent :editor="editor" />
  </div>
</template>

<script setup>
import { Markdown } from 'tiptap-markdown'
import { useEditor } from '@tiptap/vue-3'

const props = defineProps(['content']);
const emit = defineEmits(['update:content']);

const editor = useEditor({
  editorProps: {
    attributes: {
      class: 'border border-gray-300 bg-white rounded-md p-2 mt-4',
    },
  },
  content: props.content ?? '', // Початковий вміст може бути HTML або Markdown
  extensions: [
    TiptapStarterKit, Markdown
  ],
  onUpdate({ editor }) {
    const markdown = editor.storage.markdown.getMarkdown(); // Отримуємо Markdown
    emit('update:content', markdown); // Емітімо Markdown
  },
});

onBeforeUnmount(() => {
  if (editor) {
    unref(editor).destroy();
  }
});

watch(() => props.content, (newContent) => {
  if (!editor) return;

  const currentMarkdown = editor.storage.markdown.getMarkdown();
  if (currentMarkdown !== newContent) {
    // Конвертуємо Markdown назад у HTML для редактора
    editor.commands.setContent(newContent, false);
  }
});
</script>

<style lang="scss">
/* Basic editor styles */
.tiptap {
  /* List styles */
  ul,
  ol {
    padding: 0 1rem;
    margin: 1.25rem 1rem 1.25rem 0.4rem;

    li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }

  /* Heading styles */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
    margin: 1rem 1.5rem;
    text-wrap: pretty;
  }

  h1,
  h2 {
    margin-top: 3.5rem;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.4rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  h3 {
    font-size: 1.1rem;
  }

  h4,
  h5,
  h6 {
    font-size: 1rem;
  }

  /* Code and preformatted text styles */
  code {
    background-color: var(--purple-light);
    border-radius: 0.4rem;
    color: var(--black);
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
  }

  pre {
    background: var(--black);
    border-radius: 0.5rem;
    color: var(--white);
    font-family: 'JetBrainsMono', monospace;
    margin: 1.5rem 0;
    padding: 0.75rem 1rem;

    code {
      background: none;
      color: inherit;
      font-size: 0.8rem;
      padding: 0;
    }
  }

  blockquote {
    border-left: 3px solid var(--gray-3);
    margin: 1.5rem 0;
    padding-left: 1rem;
  }

  hr {
    border: none;
    border-top: 1px solid var(--gray-2);
    margin: 2rem 0;
  }
}

.is-active {
  background-color: var(--gray-1);
  color: var(--black);
}
</style>