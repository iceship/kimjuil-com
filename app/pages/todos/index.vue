<script setup lang="ts">
import { todosQuery } from "~/queries/todos";

definePageMeta({
  middleware: "auth",
});

const newTodo = ref("");

const toast = useToast();
const { user } = useUserSession();
const queryCache = useQueryCache();

const { data: todos, status } = useQuery(todosQuery);

const { mutate: addTodo } = useMutation({
  mutation: (title: string) => {
    if (!title.trim())
      throw new Error("Title is required");

    return $fetch("/api/todos", {
      method: "POST",
      body: {
        title,
        completed: 0,
      },
    }) as Promise<Todo>;
  },

  onMutate(title) {
    // let the user enter new todos right away!
    newTodo.value = "";
    const oldTodos = queryCache.getQueryData(todosQuery.key) || [];
    const newTodoItem = {
      title,
      completed: 0,
      // a negative id to differentiate them from the server ones
      id: -Date.now(),
      createdAt: new Date(),
      userId: user.value!.id,
    } satisfies Todo;
    // we use newTodos to check for the cache consistency
    // a better way would be to save the entry time
    // const when = queryCache.getEntries({ key: ['todos'], exact: true }).at(0)?.when
    const newTodos = [...oldTodos, newTodoItem];
    queryCache.setQueryData(todosQuery.key, newTodos);

    queryCache.cancelQueries({ key: todosQuery.key, exact: true });

    return { oldTodos, newTodos, newTodoItem };
  },

  onSuccess(todo, _, { newTodoItem }) {
    // update the todo with the information from the server
    // since we are invalidating queries, this allows us to progressively
    // update the todo list even if the user is adding a lot very quickly
    const todoList = queryCache.getQueryData(todosQuery.key) || [];
    const todoIndex = todoList.findIndex(t => t.id === newTodoItem.id);
    if (todoIndex >= 0) {
      queryCache.setQueryData(
        todosQuery.key,
        todoList.toSpliced(todoIndex, 1, todo),
      );
    }
  },

  onSettled() {
    // always refetch the todos after a mutation
    queryCache.invalidateQueries({ key: todosQuery.key });
  },

  onError(err, _title, { oldTodos, newTodos }) {
    // oldTodos can be undefined if onMutate errors
    // we also want to check if the oldTodos are still in the cache
    // because the cache could have been updated by another query
    if (
      newTodos != null
      && newTodos === queryCache.getQueryData(todosQuery.key)
    ) {
      queryCache.setQueryData(todosQuery.key, oldTodos);
    }

    if (isNuxtZodError(err)) {
      const title = (err as any).data.data.issues.map((issue: { message: string }) => issue.message).join("\n");
      toast.add({ title, color: "error" });
    }
    else {
      console.error(err);
      toast.add({ title: "Unexpected Error", color: "error" });
    }
  },
});

const { mutate: toggleTodo } = useMutation({
  mutation: (todo: Todo) =>
    $fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      body: {
        completed: !todo.completed,
      },
    }),

  onMutate(todo) {
    const oldTodos = queryCache.getQueryData(todosQuery.key) || [];
    const todoIndex = oldTodos.findIndex(t => t.id === todo.id);
    let newTodos = oldTodos;
    if (todoIndex >= 0) {
      newTodos = oldTodos.toSpliced(todoIndex, 1, {
        ...todo,
        completed: todo.completed ? 0 : 1,
      });
      queryCache.setQueryData(todosQuery.key, newTodos);
    }

    queryCache.cancelQueries({ key: todosQuery.key, exact: true });

    return { oldTodos, newTodos };
  },

  onSettled() {
    // always refetch the todos after a mutation
    queryCache.invalidateQueries({ key: todosQuery.key, exact: true });
  },

  onError(err, todo, { oldTodos, newTodos }) {
    // oldTodos can be undefined if onMutate errors
    if (
      newTodos != null
      && newTodos === queryCache.getQueryData(todosQuery.key)
    ) {
      queryCache.setQueryData(todosQuery.key, oldTodos);
    }

    console.error(err);
    toast.add({ title: "Unexpected Error", color: "error" });
  },
});

const { mutate: deleteTodo } = useMutation({
  mutation: (todo: Todo) => $fetch(`/api/todos/${todo.id}`, { method: "DELETE" }),

  onMutate(todo) {
    const oldTodos = queryCache.getQueryData(todosQuery.key) || [];
    const todoIndex = oldTodos.findIndex(t => t.id === todo.id);
    let newTodos = oldTodos;
    if (todoIndex >= 0) {
      newTodos = oldTodos.toSpliced(todoIndex, 1);
      queryCache.setQueryData(todosQuery.key, newTodos);
    }

    queryCache.cancelQueries({ key: todosQuery.key, exact: true });

    return { oldTodos, newTodos };
  },

  onSettled() {
    // always refetch the todos after a mutation
    queryCache.invalidateQueries({ key: todosQuery.key, exact: true });
  },

  onError(err, todo, { oldTodos, newTodos }) {
    // oldTodos can be undefined if onMutate errors
    if (newTodos != null && newTodos === queryCache.getQueryData(todosQuery.key)) {
      queryCache.setQueryData(todosQuery.key, oldTodos);
    }

    console.error(err);
    toast.add({ title: "Unexpected Error", color: "error" });
  },
});
</script>

<template>
  <form
    class="flex flex-col gap-4"
    @submit.prevent="addTodo(newTodo)"
  >
    <div class="flex items-center gap-2">
      <u-input
        v-model="newTodo"
        name="todo"
        class="flex-1"
        placeholder="Make a Nuxt demo"
        autocomplete="off"
        autofocus
        :ui="{ base: 'flex-1' }"
      />

      <u-button
        type="submit"
        icon="i-lucide-plus"
        :disabled="newTodo.trim().length === 0"
      />
    </div>

    <ul class="divide-y divide-gray-200 dark:divide-gray-800">
      <template v-if="status === 'pending'">
        <li
          v-for="i in 3"
          :key="i"
          class="flex items-center gap-4 py-2"
        >
          <u-skeleton class="h-6 flex-1" />
          <u-skeleton class="h-5 w-9 rounded-full" />
          <u-skeleton class="h-6 w-6 rounded-md" />
        </li>
      </template>
      <template v-else>
        <li
          v-for="todo of todos"
          :key="todo.id"
          class="flex items-center gap-4 py-2"
        >
          <span
            class="flex-1 font-medium"
            :class="{
              'text-gray-500': todo.completed || todo.id < 0,
              'line-through': todo.completed,
            }"
          >{{ todo.title }}</span>

          <u-switch
            :model-value="Boolean(todo.completed)"
            :disabled="todo.id < 0"
            @update:model-value="toggleTodo(todo)"
          />

          <u-button
            color="error"
            variant="soft"
            size="xs"
            icon="i-lucide-x"
            :disabled="todo.id < 0"
            @click="deleteTodo(todo)"
          />
        </li>
      </template>
    </ul>
  </form>
</template>
