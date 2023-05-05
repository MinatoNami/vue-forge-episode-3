<script lang="ts" setup>
import { Message, User } from "~/types";
// @ts-expect-error: no types
import Markdown from "vue3-markdown-it";

const props = defineProps<{
  user?: User;
  message?: Message;
  isMine: Boolean;
}>();

const relativeTime = useTimeAgo(() => props.message?.createdAt ?? new Date());
</script>

<template>
  <div class="chat" :class="isMine ? 'chat-end' : 'chat-start'">
    <div class="chat-image avatar">
      <div class="w-10 rounded-full">
        <img :src="user?.avatar" />
      </div>
    </div>

    <div class="chat-header text-xs opacity-50 mb-2">
      <strong>
        {{ user?.name }}
      </strong>
      &nbsp;
      <time v-if="message" class="text-xs text-gray-500 dark:text-gray-400">
        {{ relativeTime }}
      </time>
    </div>

    <div
      class="chat-bubble bg-white dark:bg-gray-900 max-w-max w-full prose prose-sm py-0"
    >
      <Markdown v-if="message" :source="message.text" class="w-full" />
      <slot v-else />
    </div>
  </div>
</template>
