import '@babel/polyfill/noConflict';
import prisma from '../src/prisma';
import seedDb, { userOne, userTwo, commentTwo } from './utils/seedDb';
import getClient from './utils/getClient';
import { deleteComment } from './utils/operations';

beforeEach(seedDb);

test('Should delete own comment', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: commentTwo.comment.id
  };

  await client.mutate({
    mutation: deleteComment,
    variables
  })

  await expect(prisma.exists.Comment({ id: commentTwo.comment.id })).resolves.toBe(false);
});

test('Should not delete other user\'s comment', async () => {
  const client = getClient(userTwo.jwt);
  const variables = {
    id: commentTwo.comment.id
  };

  await expect(
    client.mutate({
      mutation: deleteComment,
      variables
    })
  ).rejects.toThrow();
});