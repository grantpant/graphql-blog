import bcrypt from 'bcryptjs';
import prisma from '../../src/prisma';
import jwt from 'jsonwebtoken';

const userOne = {
  input: {
    name: 'Michael Jordan',
    email: 'jumpman23@gmail.com',
    password: bcrypt.hashSync('password123')
  },
  user: undefined,
  jwt: undefined
};

const userTwo = {
  input: {
    name: 'Penny Hardaway',
    email: 'lilpenny@gmail.com',
    password: bcrypt.hashSync('password123')
  },
  user: undefined,
  jwt: undefined
};

const postOne = {
  input: {
    title: 'MJ published post',
    body: '',
    published: true
  },
  post: undefined
};

const postTwo = {
  input: {
    title: 'MJ UNpublished post',
    body: '',
    published: false
  },
  post: undefined
};

const commentOne = {
  input: {
    text: 'MJ, that post is dyno-mite!',
    author: {
      connect: { id: undefined }
    },
    post: {
      connect: { id: undefined }
    }
  },
  comment: undefined
};

const commentTwo = {
  input: {
    text: 'Thanks, P. Keep it real!',
    author: {
      connect: { id: undefined }
    },
    post: {
      connect: { id: undefined }
    }
  },
  comment: undefined
};

const seedDb = async () => {
  // Delete test data
  await prisma.mutation.deleteManyComments();
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  // Create userOne
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  });
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);

  // Create userTwo
  userTwo.user = await prisma.mutation.createUser({
    data: userTwo.input
  });
  userTwo.jwt = jwt.sign({ userId: userTwo.user.id}, process.env.JWT_SECRET);

  // Create userOne's posts
  postOne.post = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: {
        connect: { id: userOne.user.id}
      }
    }
  });

  postTwo.post = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: {
        connect: { id: userOne.user.id}
      }
    }
  });

  // Create commentOne
  commentOne.input.author.connect.id = userTwo.user.id;
  commentOne.input.post.connect.id = postOne.post.id;

  commentOne.comment = await prisma.mutation.createComment({
    data: commentOne.input
  });

  // Create commentTwo
  commentTwo.input.author.connect.id = userOne.user.id;
  commentTwo.input.post.connect.id = postOne.post.id;

  commentTwo.comment = await prisma.mutation.createComment({
    data: commentTwo.input
  });
};

export { seedDb as default, userOne, userTwo, postOne, postTwo, commentOne, commentTwo };