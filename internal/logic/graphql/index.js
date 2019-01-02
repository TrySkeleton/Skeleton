const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull, GraphQLList } = require('graphql')

const { eventType, eventFilterTpye } = require('./event')
const { articleType } = require('./article')

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQuery',
        fields: {
            events: {
                args: {
                    filter: {
                        type: eventFilterTpye
                    }
                },
                type: new GraphQLList(eventType),
                resolve(parentValue, { filter }, context, info) {

                    const { endAfters } = filter

                    console.log(info)

                    return []
                }
            },
            articles: {
                type: new GraphQLList(articleType),
                resolve(parentValue, args, request) {
                    return []
                }
            },
            event: {
                type: eventType,
                args: {
                    id: {
                        type: new GraphQLNonNull(GraphQLID)
                    }
                },
                resolve: (parentValue, { id }) => {

                    return {}
                }
            }
        }
    })
})

module.exports = {
    schema
}