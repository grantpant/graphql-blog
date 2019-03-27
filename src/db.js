
const users = [
  {
    id: '1',
    name: 'Grant',
    email: 'grantpant@gmail.com',
    age: 37
  },
  {
    id: '2',
    name: 'Dawn',
    email: 'morning84@hotmail.com',
    age: 34
  },
  {
    id: '3',
    name: 'Allie',
    email: 'adhuson@623@yahoo.com'
  },
  {
    id: '4',
    name: 'Mom',
    email: 'krt49@yahoo.com',
    age: 68
  },
  {
    id: '5',
    name: 'Dad',
    email: 'ldt8747@yahoo.com',
    age: 70
  },
  {
    id: '7',
    name: "God",
    email: "alphaandomega@kingdom.com"
  }
];

const posts = [
  {
    id: '1',
    title: "Why Jordan is better than Lebron",
    body: "Jordan is better than Lebron because simply because his Lebron's killer instict is infantile compared to Jordan's. If no other means of comparison settles the debate, that of killer instict without debate.",
    published: true,
    author: '1'
  },
  {
    id: '2',
    title: 'This is why I post',
    body: 'I post becuase I want to.',
    published: true,
    author: "2"
  },
  {
    id: '3',
    title: "So, you think you're smart?",
    body: "Well, you're not",
    published: false,
    author: '3'
  },
  {
    id: '4',
    title: "What's wrong with the Lakers and Celtics?",
    body: "They're both being \"lead\" by someone with a bad attitude. In the case of the Celtics, the team played much better when Kyrie wasn't in the picture. And in the case of the Lakers, Lebron is a big whiny baby who pouts when things aren't going his way.",
    published: true,
    author: '1'
  }
];

const comments = [
  {
    id: '1',
    post: '2',
    author: '4',
    text: "I think you should post because you want to."
  },
  {
    id: '2',
    post: '3',
    author: '2',
    text: "I am very smart. Who do you think you are?"
  },
  {
    id: '3',
    post: '4',
    author: '1',
    text: "True that Kyrie is probably shit as a leader, but if the rest of the team is full of great attitudes then you would think that they would figure out how to collectively do what's best for the team. shm"
  },
  {
    id: '4',
    post: '1',
    author: '3',
    text: "Member when JWill said Lebron would be beat MJ in one-on-one. That fool really on that dope."
  },
  {
    id: '5',
    post: '1',
    author: '7',
    text: "MJ's the GOAT. There. It's settled."
  }
];

const db = {
  users,
  posts,
  comments
};

export { db as default };