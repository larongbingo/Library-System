/**
 * changeUsername.js
 * Handles all processes for changing the username in an account
 */

import {
    GraphQLString,
    GraphQLNonNull
} from "graphql";
import GraphQLJSON from "graphql-type-json";
import DB from "../../../db/dbMap";
import JWT from "jsonwebtoken";
import createResponse from "./helpers/createResponse";

export default {
    type: GraphQLJSON,
    description: "Changing username of the account",
    args: {
        newUsername: {
            type: new GraphQLNonNull(GraphQLString),
            description: "The new username for the account"
        },
        token: {
            type: new GraphQLNonNull(GraphQLString),
            description: "The token that would request to change the username"
        }
    },
    resolve(root, args) {
        return JWT.verify(args.token, process.env.SECRET_KEY, null, (err, decoded) => {
            if(err || !decoded) {
                return createResponse(false, 3, {reason: "Invalid Token"}); 
            }
            else {
                return DB.models.users.findOne({
                    where: {
                        id: decoded.userId
                    }
                })
                .then(user => {
                    return DB.models.sessions.findOne({
                        where: {
                            token: args.token
                        }
                    })
                    .then(session => {
                        if(!session) {
                            return createResponse(false, 4, {reason: "Token is expired"}); 
                        }

                        if(!user) {
                            return createResponse(false, 9, {reason: "User does not exist"}); 
                        }
                        else {
                            return DB.models.transactions.create({
                                transactionType: "CHANGE USERNAME",
                                transactionRemarks: `user${user.id} changes username from ${user.username} to ${args.newUsername}`,
                                userId: user.id,
                                bookId: null
                            })
                            .then(transaction => {
                                user.update({
                                    username: args.newUsername
                                });
    
                                return DB.models.sessions.findOne({
                                    where: {
                                        token: args.token
                                    }
                                })
                                .then(session => {
                                    session.destroy();

                                    return createResponse(true, 0, {
                                        transactionType: transaction.transactionType,
                                        transactionRemarks: transaction.transactionRemarks
                                    });
                                })
                            })
                        }
                    })
                });
            }
        });
    }
}