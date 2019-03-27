import verifyUser from '../utils/verifyUser';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email });
    // We don't have to test for the existence of the email b/c the
    // operation would fail if we tried to create a user with an email
    // that already exists. But doing so allows us to throw an error
    // with a message explaining that the email is taken..
    if (emailTaken) {
      throw new Error("A user with this email already exists.");
    }

    const password = await hashPassword(args.data.password);

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    });

    return {
      user,
      // Send the client back a token upon success.
      token: generateToken(user.id)
    };
  },
  async login(parent, args, { prisma }, info) {
    // Retrieve the user with that email from the DB.
    const user = await prisma.query.user({
      where: { email: args.data.email }
    });

    if (!user) {
      throw new Error("Login failed");
    }
    // Use bcrypt to verify that the password they entered matches
    // that which is stored in the DB.
    const passwordVerified = await bcrypt.compare(args.data.password, user.password);

    if (!passwordVerified) {
      throw new Error("Login failed");
    }
    // If all's good, issue a token to return to the client.
    const token = generateToken(user.id);

    return {
      user,
      token
    };
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = verifyUser(request);

    return prisma.mutation.deleteUser({
      where: { id: userId }
    }, info);
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = verifyUser(request);

    if (typeof args.data.password === 'string') {
      args.data.password = await hashPassword(args.data.password);
    }

    return prisma.mutation.updateUser({
      where: { id: userId },
      data: args.data
    }, info);
  },
  createPost(parent, args, { prisma, request }, info) {
    const { title, body, published } = args.data;
    const userId = verifyUser(request);

    return prisma.mutation.createPost({
      data: {
        title,
        body,
        published,
        author: {
          connect: { id: userId }
        }
      }
    }, info);
  },
  async deletePost(parent, args, { prisma, request }, info) {
    const userId = verifyUser(request);
    // prisma.exists returns true if the client is the author of
    // the requested post.
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: { id: userId }
    });
    // If they don't own the post throw a VAGUE error (we don't
    // want to give them anthing specific--they're trying to do
    // something that they shouldn't be doing.)
    if (!postExists) {
      throw new Error("Operation failed");
    }

    return prisma.mutation.deletePost({
      where: { id: args.id }
    }, info);
  },
  async updatePost(parent, args, { prisma, request }, info) {
    const { published } = args.data;
    const userId = verifyUser(request);
    // Check if the requested post belongs to the requesting client.
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: { id: userId }
    });
    // Throw an AMBIGUOUS error if client doesn't own the post.
    if (!postExists) {
      throw new Error("Operation failed");
    }
    // Check if the post is currently publisihed.
    const isPublished = await prisma.exists.Post({
      id: args.id,
      published: true
    });
    // Delete all the comments if the post is being unpublished.
    if (isPublished && published === false) {
      await prisma.mutation.deleteManyComments({
        where: {
          post: { id: args.id }
        }
      });
    }

    return prisma.mutation.updatePost({
      where: { id: args.id },
      data: args.data
    }, info);
  },
  async createComment(parent, args, { prisma, request }, info) {
    const { text, post } = args.data;
    const userId = verifyUser(request);
    // Verify that the post exists AND that it is published.
    const publishedPostExists = await prisma.exists.Post({
      id: post,
      published: true
    });

    if (!publishedPostExists) {
      throw new Error("This post doesn't exist or is not published");
    }

    return prisma.mutation.createComment({
      data: {
        text,
        author: {
          connect: { id: userId }
        },
        post: {
          connect: { id: post }
        }
      }
    }, info);
  },
  async deleteComment(parent, args, { prisma, request }, info) {
    const userId = verifyUser(request);
    // Verify that the comment exists AND that the client is the
    // author.
    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: { id: userId }
    });

    if (!commentExists) {
      throw new Error("Unable to delete comment");
    }

    return prisma.mutation.deleteComment({
      where: { id: args.id }
    }, info);
  },
  async updateComment(parent, args, { prisma, request }, info) {
    const userId = verifyUser(request);
    // prisma.exists will return true if the client is the
    // comment's author.
    const commentExists = await prisma.exists.Comment({
      // Find the requested comment...
      id: args.id,
      // AND verify that its author is client making the request.
      author: { id: userId }
    });

    if (!commentExists) {
      throw new Error("Unable to update comment");
    }

    return prisma.mutation.updateComment({
      where: { id: args.id },
      data: args.data
    }, info);
  }
};

export default Mutation;