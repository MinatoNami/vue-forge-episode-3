<script lang="ts" setup>
import { nanoid } from "nanoid";
import { Message, User } from "~/types";

const props = defineProps<{
  messages: Message[];
  users: User[];
  me: User;
  usersTyping?: User[];
}>();

const isOpen = ref(true);

const usersTypingText = computed(() => {
  if (!props.usersTyping?.length) return "";
  // TODO: Filter array of users to remove duplicates
  if (props.usersTyping?.length === 1) {
    return `User ${props.usersTyping[0].name} is typing...`;
  }
  if (props.usersTyping?.length > 3) {
    return `${props.usersTyping?.length} users are typing...`;
  }

  return `${props.usersTyping
    ?.map((user) => user.name)
    .join(" and ")} are typing...`;
});
const emit = defineEmits<{
  (event: "newMessage", newMessage: Message): void;
}>();

const textMessage = ref("");
function sendMessage() {
  emit("newMessage", {
    id: nanoid(),
    userId: props.me.id,
    createdAt: new Date(),
    text: textMessage.value,
  });

  textMessage.value = "";
}

function getUser(userId: String) {
  return props.users.find((user) => user.id === userId);
}

const messageBox = ref<HTMLElement>();
watch(
  () => props.messages.length,
  async () => {
    await nextTick();
    if (messageBox.value) {
      messageBox.value.scrollTop = messageBox.value.scrollHeight;
    }
  }
);
</script>

<template>
  <div class="fixed bottom-[10px] right-[10px]">
    <button
      v-show="!isOpen"
      class="bg-ble-500 p-3 rounded"
      @click="isOpen = !isOpen"
    >
      <IconChat class="w-8 h-8 text-white" />
    </button>

    <div
      v-if="isOpen"
      class="box bg-gray-300 rounded dark:bg-gray-800 w-[450px]"
    >
      <header
        class="bg-gray-200 dark:bg-gray-900 px-4 flex justify-between items-center"
      >
        Customer Support Chat
        <button class="p-4 pr-0" @click="isOpen = false">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>
      </header>
      <div ref="messageBox" class="messages p-4 overflow-y-scroll max-h-[80vh]">
        <ChatBubble
          v-for="message in messages"
          :key="message.id"
          :user="getUser(message.userId)"
          :message="message"
          :is-mine="me.id === message.userId"
        />
        <ChatBubble v-for="user in usersTyping" :key="user.id" :user="user">
          <AppLoading />
        </ChatBubble>
      </div>
      <footer class="p-2">
        <div class="h-6 px-2 text-sm italic" v-if="usersTyping?.length > 0">
          {{ usersTypingText }}
        </div>
        <input
          v-model="textMessage"
          @keypress.enter.exact.prevent="sendMessage"
          type="text"
          placeholder="Type your message"
          class="input w-full block"
        />
      </footer>
    </div>
  </div>
</template>
