const { GraphQLObjectType, GraphQLInputObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql')

const articleType = new GraphQLObjectType({
    name: 'Article',
    description: "Usually an article is like a blog post. However it can be used in a different way, for instance to create static sites.",
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLID),
            description: "Unique ID if the article",
            resolve: (parentValue, args, request) => {

            }
        },
        title: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (parentValue, args, request) => {
                console.log(request.session)
            }
        },
        slug: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (parentValue, args, request) => {
                console.log(request.session)
            }
        },
        content: {
            type: GraphQLString,
            resolve: (parentValue, args, request) => {
                console.log(request.session)
            }
        },
        preview: {
            type: GraphQLString,
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
        updated_at: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (parentValue, args, request) => {
                console.log(request.session)
            }
        },
        published_at: {
            type: GraphQLString,
            resolve: (parentValue, args, request) => {
                console.log(request.session)
            }
        }
    }
})

module.exports = {
    articleType
}