import { IBook } from '../models/Book.js';
import { IUser } from '../models/User.js';
import { User } from '../models/index.js';

import { signToken } from '../services/auth.js';

const resolvers = {
    Query: {
        getSingleUser: async (_parent: any, _args: any, contextValue: any ): Promise<IUser | null> => {
            const user= contextValue.user;
            console.log("User: ", user);

            console.log("User._id: ", user._id);
            console.log("contextValue.user._id: ", contextValue.user._id);

            if (!user) {
                return null;
            }

            const userData = await User.findOne({ _id: user._id });
            console.log("userData: ", userData);
            return userData;
        },
    },
    Mutation: {
        createUser: async (_parent: any, args: any ): Promise<{ token: string, user: IUser } | null> => {
            console.log("getting ready to call db for create user");
            const user = await User.create(args);
            console.log("user created");
            const token = signToken(user.username, user.email, user._id);
            console.log("token created");
            
            return { token, user };
        },
        saveBook: async (_parent: any, { book }: { book: IBook }, contextValue: any): Promise<IUser | null> => {
            const user = contextValue.user;
            console.log("user: ", user);
            if (!user) {
                return null;
            }
            console.log("book: ", book);
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $addToSet: { savedBooks: book } },
                { new: true, runValidators: true }
            );
            return updatedUser;
        },
        deleteBook: async (_parent: any, { book }: { book: IBook }, contextValue: any ): Promise<IUser | null> => {
            const user = contextValue.user;

            if (!user) {
                return null;
            }

            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { savedBooks: { book } } },
                { new: true, runValidators: true }
            );
            return updatedUser;
        },
        login: async (_parent: any, { email, password }: { email: string, password: string }): Promise<{ token: string, user: IUser } | null> => {
            const user = await User.findOne({ email });
            if (!user) {
                return null;
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                return null;
            }

            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
    },
};

export default resolvers;