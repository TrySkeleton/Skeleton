const { GraphQLObjectType, GraphQLInputObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql')

const eventFilterTpye = new GraphQLInputObjectType({
    name: 'EventFilter',
    fields: {
        endAfter: {
            type: GraphQLString
        }
    }
})

const eventType = new GraphQLObjectType({
    name: 'Event',
    description: "An event can be any physical or digital happening or something similar.",
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLID),
            resolve: (parentValue, args, request) => {

            }
        },
        title: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (parentValue, args, request) => {
                console.log(request.session)
            }
        },
        start: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (parentValue, args, request) => {
                console.log(request.session)
            }
        },
        end: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (parentValue, args, request) => {
                console.log(request.session)
            }
        },
        created_at: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (parentValue, args, request) => {
                console.log(request.session)
            }
        },
        description: {
            type: GraphQLString,
            resolve: (parentValue, args, request) => {
                console.log(request.session)
            }
        },
        location: {
            type: GraphQLString,
            resolve: (parentValue, args, request) => {
                console.log(request.session)
            }
        },
        booth: {
            type: GraphQLString,
            resolve: (parentValue, args, request) => {
                console.log(request.session)
            }
        },
    }
})

module.exports = {
    eventFilterTpye,
    eventType
}