<script setup lang="ts">
import { ref } from "vue"
import { useMutation } from "@vue/apollo-composable";
import { INSERT_TODOS_ONE } from "../graphql-operations";
import { gql } from "graphql-tag"

const { type } = defineProps({ type: String })
const newTodoTitle = ref("")
const insertTodosMutation = useMutation(INSERT_TODOS_ONE)

async function addTodo({ todoTitle, type }: { todoTitle: string; type: string }) {
    // Code to add todo here
    const title = todoTitle && todoTitle.trim()
    const is_public = type === "public"

    const result = await insertTodosMutation.mutate(
        {
            object: {
                title,
                is_public,
            }
        },
        {
            optimisticResponse: {
                insert_todos_one: {
                    __typename: "todos",
                    id: -1,
                    title,
                    is_public,
                    is_completed: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            },
            update(cache, { data: { insert_todos_one }}) {
                cache.modify({
                    fields: {
                        todos(existingTodos = []) {
                            const newTodoRef = cache.writeFragment({
                                data: insert_todos_one,
                                fragment: gql`
                                    fragment NewTodo on Todo {
                                        id
                                        title
                                        is_public
                                        is_completed
                                        created_at
                                        updated_at
                                    }
                                `,
                            })
                            return [newTodoRef, ...existingTodos]
                        }
                    }
                })
            }
        }
    )
    console.log("Result:", result)
}
</script>

<template>
    <div class="formInput">
        <input
            class="input"
            placeholder="What needs to be done?"
            v-model="newTodoTitle"
            @keyup.enter="addTodo({ todoTitle: newTodoTitle, type })"
        />
        <i class="downArrow fa fa-angle-down" />
    </div>
</template>
