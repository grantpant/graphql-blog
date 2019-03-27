import verifyUser from '../utils/verifyUser';

const User = {
  // In the email resolver, we only want to expose the
  // email address to the requesting client if it's THEIR
  // email address. We don't want to expose others' email
  // addresses to them.
  email: {
    // The fragment ensures that the id is included on the
    // User parent
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { prisma, request }, info) {
      const userId = verifyUser(request, false);
      // If the client is authenticated AND if their ID matches
      // that of the parent User object...
      if (userId && userId === parent.id) {
        // ...give  'em back the email...
        return parent.email;
        // ...Otherwise, return null.
      } else {
        return null;
      }
    }
  },
  posts: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { prisma }, info) {
      // Have prisma fetch only posts by the user that
      // are published.
      return prisma.query.posts({
        where: {
          published: true,
          author: { id: parent.id }
        }
      });
    }
  }
};

export default User;