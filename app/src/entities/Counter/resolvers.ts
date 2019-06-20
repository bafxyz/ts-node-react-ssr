import gql from 'graphql-tag'
import { Graphql } from '../../types'

export const countQuery = gql`
    query Count {
        count @client
    }
`

const resolvers: Graphql.Resolvers = {
    Mutation: {
        setCount: (parent, { count }, { cache }) => {
            cache.writeData({
                data: {
                    count
                }
            })

            return null
        },
        increment: (parent, args, { cache }) => {
            let data
            try {
                // if query does not exist in the cache it will throw an error
                data = cache.readQuery<any>({
                    query: countQuery
                })
            } catch {}

            cache.writeData({
                data: {
                    count: data ? data.count + 1 : 1
                }
            })

            return null
        }
    },
    Query: {
        getCount: (parent, args, { cache }) => {
            const { count } = cache.readQuery<any>({
                query: countQuery
            })

            return count
        }
    }
}

export default resolvers
