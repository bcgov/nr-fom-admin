import { Comment } from 'app/models/comment';

export  const commentStubArray: Comment[] =  [
    new Comment(
    {
        '_id': '22233',
        '_addedBy': 'Marcelo M',
        '_commentPeriod' : '234543',
        'commentNumber': 2,
        'comment': 'This is actually my first comment about this FOM. I\'m really optimistic about this project, just ask Flavia and she\'ll confirm it. ' +
         'I just have to keep writting non sense things here so I can please Anne-Marie, so there\'s lot\'s of lines here you know???' +
         '\n'+ 'more stuff' +
         '\n second more stuff'+
         '\n third more stuff'+
         '\n'+
         '\n'+
         '\n Now I have to add drop-down stuff at the bottom of the page, a big box for the Details, etc....'+
         '\n using the current JSON objects from ACRFD to do this is not that hard, it\'s just a matter of figuring out the classes ' + 
         'and then creating them accordingly. If I had to use the real objects from FOM, then I\'d be in trouble!! ',

        'commentAuthor': {
            '_userId': '23456',
            'orgName': 'My first organization',
            'contactName': 'Mr. First contact',
            'location': 'BC Forest location',
            'requestedAnonymous': true,
            'internal': {
                'email': 'test@test.com',
                'phone': '+14034455',
                'isPublished': false
              },
            'isPublished': false,
          },
          'review': {
            '_reviewerId': '98733',
            'reviewerNotes': 'This is the reviewer notes',
            'reviewerDate': '2021-02-10',
            'isPublished': false
          },
        'dateAdded': '2021-02-10',
        'commentStatus': 'Closed or whatever'
    }),
    new Comment(
      {
          '_id': '22234',
          '_addedBy': 'Marcelo M 2nd',
          '_commentPeriod' : '234544',
          'commentNumber': 3,
          'comment': 'This is actually my second comment about this FOM. I really dont like how this is going',
          'commentAuthor': {
              '_userId': '23456',
              'orgName': 'My second organization',
              'contactName': 'Mr. second contact',
              'location': 'BC Forest location',
              'requestedAnonymous': true,
              'internal': {
                  'email': 'test@test.com',
                  'phone': '+14034455',
                  'isPublished': false
                },
              'isPublished': false,
            },
            'review': {
              '_reviewerId': '98733',
              'reviewerNotes': 'This is the reviewer notes',
              'reviewerDate': '2021-02-10',
              'isPublished': false
            },
          'dateAdded': '2021-04-3',
          'commentStatus': 'Closed or whatever'
      })
];
