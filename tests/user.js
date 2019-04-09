import 'cross-fetch/polyfill';
import '@babel/polyfill/noConflict';
import prisma from '../src/prisma';
import seedDb, { userOne } from './utils/seedDb';
import getClient from './utils/getClient';
import { createUser, getUsers, login, getProfile } from './utils/operations';

const client = getClient();

beforeEach(seedDb);

test('Should create a new user', async () => {
  const variables = {
    data: {
      name: 'Grant',
      email: 'grantpant@gmail.com',
      password: 'password123'
    }
  };

  const res = await client.mutate({
    mutation: createUser,
    variables
  });

  const userExists = await prisma.exists.User({
    id: res.data.createUser.user.id
  });

  expect(userExists).toBe(true);
});

test('Should not login with bad credentials', async () => {
  const variables = {
    data: {
      email: 'jumpman23@gmail.com',
      password: 'wrongpassword'
    }
  };

  await expect(
    client.mutate({
      mutation: login,
      variables
    })
  ).rejects.toThrow()
});

test('Should fail on signup with invalid password', async () => {
  const variables = {
    data: {
      name: 'Ryan',
      email: 'ironhorse@gmail.com',
      password: 'pswd5'
    }
  };

  await expect(
    client.mutate({ mutation: createUser, variables })
  ).rejects.toThrow();
});

test('Should expose public author profiles', async () => {
  const res = await client.query({ query: getUsers });
  const { users } = res.data;

  expect(users.length).toBe(2);
  expect(users[0].email).toBe(null);
  expect(users[0].name).toBe('Michael Jordan');
});

test('Should fetch user profile', async () => {
  const client = getClient(userOne.jwt);
  const res = await client.query({ query: getProfile });
  const { me } = res.data;
  const { user } = userOne;

  expect(me.id).toBe(user.id);
  expect(me.name).toBe(user.name);
  expect(me.email).toBe(user.email);
});

test('Should not signup a user with email that is already in use', async () => {
  const variables = {
    data: {
      name: 'Jordan Wannabe',
      email: 'jumpman23@gmail.com',
      password: 'password123'
    }
  };

  // Make sure we throw error.
  await expect(client.mutate({
    mutation: createUser,
    variables
  })).rejects.toThrow();

  // Make sure prisma didn't create user.
  await expect(prisma.exists.User({ name: 'Jordan Wannabe' }))
    .resolves.toBe(false);
});

test('Should login and provide authentication token', async () => {
  const variables = {
    data: {
      email: 'lilpenny@gmail.com',
      password: 'password123'
    }
  };
  const { data } = await client.mutate({
    mutation: login,
    variables
  });

  // Make sure the token isn't undefined.
  expect(data.login.token).toBeDefined();
});

test('Should reject me query without authentication', async () => {
  // Fire off client query w/o authenticating getClient.
  await expect(client.query({ query: getProfile }))
    .rejects.toThrow();
});

test('Should hide emails when fetching list of users', async () => {
  const { data } = await client.query({ query: getUsers });

  // Loop over each user, confirming that email is null.
  data.users.forEach((user) => {
    expect(user.email).toBe(null);
  });
});
