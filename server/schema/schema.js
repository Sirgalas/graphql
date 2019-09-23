const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt,GraphQLList,GraphQLNonNull } = graphql;

const Movies = require('../models/movie');
const Directors = require('../models/directors');

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString)},
        genre: { type: new GraphQLNonNull(GraphQLString) },
        director: {
            type: DirectorType,
            resolve(parent, args) {
                 return Directors.findById(parent.directorId);
            }
        }
    }),
});

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        movies:{
            type:new GraphQLList(MovieType),
            resolve(parent,args){
               return Movies.find({directorId:parent.id});
            },
        },
    }),
});

const Mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addDirector:{
            type:DirectorType,
            args:{
                name:{type:new GraphQLNonNull(GraphQLString)},
                age:{type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent,arg){
                const director = new Directors({
                    name:arg.name,
                    age:arg.age
                });
                return director.save();
            },
        },
        addMovie:{
            type:MovieType,
            args:{
                name:{type:new GraphQLNonNull(GraphQLString)},
                genre:{type: new GraphQLNonNull(GraphQLString)},
                directorId: {type:GraphQLID}
            },
            resolve(parent,arg){
                const movie = new Movies({
                    name:arg.name,
                    genre:arg.genre,
                    directorId:arg.directorId
                });
                return movie.save();
            },
        },
        deleteDirector:{
            type:DirectorType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){
                return Directors.findByIdAndRemove(args.id,err=>{
                    if(err)console.log(err)
                    }
                );
            }
        },
        deleteMovie:{
            type:MovieType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){
                return Movies.findByIdAndRemove({_id :args.id},err=>{
                    if(err)console.log(err);
                    throw err;
                });
            }
        },
        updateDirector:{
            type:DirectorType,
            args:{
                id:{type:GraphQLID},
                name:{type:new GraphQLNonNull(GraphQLString)},
                age:{type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent,arg){
                return Directors.findByIdAndUpdate(
                    arg.id,
                    {$set:{name:arg.name,age:arg.age}},
                    {new:true},
                );
            },
        },
        updateMovie:{
            type:MovieType,
            args:{
                id:{type:GraphQLID},
                name:{type:new GraphQLNonNull(GraphQLString)},
                genre:{type: new GraphQLNonNull(GraphQLString)},
                directorId: {type:GraphQLID}
            },
            resolve(parent,arg){
                return Movies.findByIdAndUpdate(
                    arg.id,
                    {$set:{name:arg.name,genre:arg.genre,directorId:arg.directorId}},
                    {new:true}
                );
            },
        },
    }
});

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        movie: {
            type: MovieType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Movies.findById(args.id);
            },
        },
        director: {
            type: DirectorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Directors.find(args.id);
            },
        },
        movies:{
            type:new GraphQLList(MovieType),
            resolve(parent,arg){
                console.log(Movies.find());
                return Movies.find({});
            }
        },
        directors:{
            type:new GraphQLList(DirectorType),
            resolve(parent,arg){
                return Directors.find({});
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: Query,
    mutation:Mutation
});