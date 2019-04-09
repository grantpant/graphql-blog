import '@babel/polyfill/noConflict';
import seedDb, { postOne, commentTwo } from './utils/seedDb';
import getClient from './utils/getClient';
import { subscribeToComments, subscribeToPosts } from './utils/operations';
import prisma from '../src/prisma';

beforeEach(seedDb);

const client = getClient();

test('Should subscribe to comments', async (done) => {
  const variables = {
    postId: postOne.post.id
  };

  // ? Not sure why we didn't need to await this call to client.
  client.subscribe({
    query: subscribeToComments,
    variables
  }).subscribe({
    next(res) {
      // Assertions
      expect(res.data.comment.mutation).toBe('DELETED');
      done();
    }
  });

  // Delete a comment from postOne in prisma
  await prisma.mutation.deleteComment({
    where: { id: commentTwo.comment.id }
  });
});

test('Should subscribe to posts', async (done) => {
  client.subscribe({ query: subscribeToPosts }).subscribe({
    next(res) {
      // Assertions
      expect(res.data.post.mutation).toBe('DELETED');
      done();
    }
  });

  // Delete a post in through Prisma
  await prisma.mutation.deletePost({
    where: { id: postOne.post.id }
  });
});