const graphql = require('graphql');

const {GraphQLObjectType,GraphQLString,GraphQLSchema}=graphql;

const MoveType= new GraphQLObjectType({
    name:'Move',
    fields:()=>({
        id:{type: GraphQLString},
        name:{type: GraphQLString},
        genre:{type: GraphQLString},
    })
});

const Query= new GraphQLObjectType({
    name:'Query',
    fields:{
        movie:{
            type:MoveType,
            args:{id:{type:GraphQLString}},
            resolve(parent,arg){

            }
        }
    }

});

module.exports = new GraphQLSchema({
    query:Query
});