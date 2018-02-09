import { GraphQLObjectType } from "graphql";
import LogInObject from "./mutationObjects/logIn";

export default new GraphQLObjectType({
    name: "Mutations",
    description: "All of the function that requires the user to be logged in",
    fields() {
        return {
            logIn: LogInObject
        };
    }
});