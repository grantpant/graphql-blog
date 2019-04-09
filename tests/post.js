import 'cross-fetch/polyfill';
import '@babel/polyfill/noConflict';
import prisma from '../src/prisma';
import seedDb, { userOne, userTwo, postOne, postTwo } from './utils/seedDb';
import getClient from './utils/getClient';
import { getPosts, myPosts,updatePost, createPost, deletePost } from './utils/operations';

const client = getClient();

beforeEach(seedDb);
/*
test('Should expose only published posts', async () => {
  const res = await client.query({ query: getPosts });
  const { posts } = res.data;

  expect(posts.length).toBe(1);
  expect(posts[0].published).toBe(true);
});

test('Should fetch user\'s posts', async () => {
  const client = getClient(userOne.jwt);
  const res = await client.query({ query: myPosts });
  const posts = res.data.myPosts;

  expect(posts.length).toBe(2);
});

test('Should be able to update own post', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: postOne.post.id,
    data: {
      published: false
    }
  };

  const { data } = await client.mutate({
    mutation: updatePost,
    variables
  });
  const exists = await prisma.exists.Post({
    id: postOne.post.id,
    published: false
  });

  expect(data.updatePost.published).toBe(false);
  expect(exists).toBe(true);
});

test('Should create a new post', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    data: {
      title: 'My Brand New Post',
      body: 'Body of new post.',
      published: true
    }
  };

  const res = await client.mutate({
    mutation: createPost,
    variables
  });
  const newPost = res.data.createPost;
  const exists = await prisma.exists.Post({
    id: newPost.id,
    author: { id: userOne.user.id }
  });

  expect(exists).toBe(true);
  expect(newPost.title).toBe('My Brand New Post');
  expect(newPost.body).toBe('Body of new post.');
  expect(newPost.published).toBe(true);
});

test('Should delete user\'s post', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: postTwo.post.id
  };

  const res = await client.mutate({
    mutation: deletePost,
    variables
  });
  const deletedPost = res.data.deletePost;
  const exists = await prisma.exists.Post({ id: postTwo.post.id });

  expect(exists).toBe(false);
  expect(deletedPost.id).toBe(postTwo.post.id);
});

test('Should not be able to update another user\'s post', async () => {
  const client = getClient(userTwo.jwt);
  const variables = {
    id: postTwo.post.id,
    data: {
      published: true
    }
  };

  await expect(client.mutate({
    mutation: updatePost,
    variables
  })).rejects.toThrow('Operation failed');

  const post = await prisma.query.post({
    where: { id: postTwo.post.id }
  });

  expect(post.published).toBe(false);
});

test('Should not be able to delete another user\'s post', async () => {
  const client = getClient(userTwo.jwt);
  const variables = { id: postOne.post.id };

  await expect(client.mutate({
    mutation: deletePost,
    variables
  })).rejects.toThrow('Operation failed');

  await expect(prisma.exists.Post({ id: postOne.post.id }))
    .resolves.toBe(true);
});

test('Should require authentication to create a post', async () => {
  const variables = {
    data: {
      title: 'Invalid Post',
      body: '',
      published: false
    }
  };

  await expect(client.mutate({
    mutation: createPost,
    variables
  })).rejects.toThrow('Authorization required');
});
*/