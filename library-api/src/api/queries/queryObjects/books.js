import { 
    GraphQLList,
    GraphQLInt,
    GraphQLString
} from "graphql";
import BooksObject from "../../tables/books";
import DB from "../../../db/dbMap";

export default {
    description: "Returns a list of books",
    type: new GraphQLList(BooksObject),
    args: {
        id: {
            description: "The ID in the Database",
            type: GraphQLInt
        },
        title: {
            description: "The title of the book",
            type: GraphQLString
        },
        author: {
            description: "The author of the book",
            type: GraphQLString
        },
        ISBN: {
            description: "The ISBN of the book",
            type: GraphQLString
        }
    },
    resolve(root, args) {
        return DB.models.books.findAll({where: args});
    }
}