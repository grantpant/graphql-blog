import { Prisma } from 'prisma-binding';
import { fragmentReplacements } from './resolvers/index';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  fragmentReplacements
});

export { prisma as default };

/* <<<-------PRISMA PRACTICE------>>>

// Here's an async function that lets you pass in an author ID and
// a data object for a new post, then runs a query for the user
// and returns that data.
async function createPostForUser(authorId, data) {
  const userExists = await prisma.exists.User({ id: authorId });

  if (!userExists) {
    throw new Error('User does not exist');
  }
  // Create a new post for a given user
  const newPost = await prisma.mutation.createPost({
    data: {
      ...data,
      author: {
        connect: {
          id: authorId
        }
      }
    }
  }, '{ author { id name email posts { id title published } }');

  return newPost.author;
}

// // Call the function, passing in the data
// createPostForUser('cjsxch2uw000u07234hvm5ib1', {
//   title: "Why I Love Grant So Much",
//   body: "I love Grant because...I dunno, I just do!",
//   published: true
// })
//   .then(user => console.log(user))
//   .catch(err => console.error(err.message));


async function updatePostForUser(postId, data) {
  const postExists = await prisma.exists.Post({ id: postId });

  if (!postExists) {
    throw new Error('That post does not exist');
  }

  const post = await prisma.mutation.updatePost({
    where: {
      id: postId
    },
    data
  }, '{ author { id name posts { id title body published } } }');

  return post.author;
}
// // Call the function, passing in data
// updatePostForUser('cjt33inkt001c07715zdkcud3', {
//   title: 'My First Post (revised)!',
//   body: 'Ain\'t it great?!? It sure is.',
//   published: false
// })
//   .then(user => console.log(JSON.stringify(user, undefined, 2)))
//   .catch(err => console.error(err.message));

*/