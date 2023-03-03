import { gql } from "graphql-tag";

export const SELECT_TODOS = gql`
    query todos(
        $where: todos_bool_exp!
        $order_by: [todos_order_by!]
        $limit: Int = 10
        $offset: Int
    ) {
        todos(where: $where, order_by: $order_by, limit: $limit, offset: $offset) {
            id
            title
            is_completed
            created_at
            is_public
        }
    }
`