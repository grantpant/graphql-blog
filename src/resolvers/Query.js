import verifyUser from '../utils/verifyUser';

const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    };

    if (args.query) {
      opArgs.where = { name_contains: args.query };
    }
    // If opArgs is still an empty object at this point,
    // it's okay cuz passing an empty object is the same
    // as passing null.
    return prisma.query.users(opArgs, info);

  },
  posts(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
      // Make sure only published posts are returned
      where: { published: true }
    };
    // If a query string is provided...
    if (args.query) {
      opArgs.where.OR = [{
        // ...search for it in the post title...
        title_contains: args.query
      }, {
        // ...or the post body
        body_contains: args.query
      }];
    }

    return prisma.query.posts(opArgs, info);
  },
  comments(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    };

    return prisma.query.comments(opArgs, info);
  },
  me(parent, args, { prisma, request }, info) {
    const userId = verifyUser(request);
    console.log(info.operation.selectionSet.selections[0].selectionSet.selections)
    return prisma.query.user({
      where: { id: userId }
    }, info);
  },
  async post(parent, args, { prisma, request }, info) {
    const userId = verifyUser(request, false);
    // If there's no userId, we want verifyUser to return
    // null, instead of undefined. If userId is undefined
    // in the prisma.query below, that author.id condition
    // will always return a match.

    // We're using prisma's posts (plural) query here to take
    // advantate of its built-in conditional search criteria
    // (the post (singular) query only lets you search by ID
    // alone).
    const posts = await prisma.query.posts({
      where: {
        // We want to search for the individual post with the ID
        // provided in the args...
        id: args.id,
        // ...Then we also want to check to make sure the post
        // we're about to return either A) is published or
        // B) belongs to the client...
        OR: [{
          published: true
        },
        {
          author: {
            // userId must never be undefined here, or condition
            // will always result in a match.
            id: userId
          }
        }]
      }
    }, info);

    // Check to make sure the prisma.query actually returned
    // a post...
    if (posts.length === 0) {
      throw new Error('No post found');
    }
    // ...Return it if it did.
    return posts[0];
  },
  myPosts(parent, args, { prisma, request }, info) {
    const userId = verifyUser(request);
    const opArgs = {
      where: {
        author: { id: userId }
      },
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    };

    if (args.query) {
      opArgs.where.OR = [{
        title_contains: args.query
      },{
        body_contains: args.query
      }];
    }

    return prisma.query.posts(opArgs, info);
  }
};

export default Query;