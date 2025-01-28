

const typeDefs = `
    type Book {
        bookId: ID!
        title: String!
        authors: [String]
        description: String!
        image: String
        link: String
    }
    
    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
        savedBooks: [Book]
    }

    type Token {
        token: String
        user: User
    }

    input BookInput {
        bookId: String!
        title: String!
        authors: [String]
        description: String!
        image: String
        link: String
    }

    type Query {
        getSingleUser: User
    }

    type Mutation {
        login(email: String!, password: String!): Token
        saveBook(book: BookInput!): User
        createUser(username: String!, email: String!, password: String!): Token
        deleteBook(bookId: ID!): User
    }
`;

export default typeDefs;