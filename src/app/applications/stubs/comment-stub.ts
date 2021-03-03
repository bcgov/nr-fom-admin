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
         'and then creating them accordingly. If I had to use the real objects from FOM, then I\'d be in trouble!! '+
         '\nBy the way, this is how the JSON structure for this entire page looks like:\n '+ 
         '{\n' +
          '_id: 22234\n'+
          '_addedBy: Marcelo M 2nd\n'+
          '_commentPeriod : 234544\n'+
          'commentNumber: 3\n'+
          'comment: A comment\n'+
          'commentAuthor: {\n' +
              ' &nbsp; &nbsp; _userId: 23456\n'+
              '&nbsp; &nbsp;orgName: My second organization\n'+
              '&nbsp; &nbsp;contactName: Mr. second contact\n'+
              '&nbsp; &nbsp;location: BC Forest location\n'+
              '&nbsp; &nbsp;requestedAnonymous: true\n'+
              '&nbsp; &nbsp;internal: {\n'+
                  '&nbsp; &nbsp;&nbsp; &nbsp;email: test@test.com\n'+
                  '&nbsp; &nbsp;&nbsp; &nbsp;phone: +14034455\n'+
                  '&nbsp; &nbsp;&nbsp; &nbsp;isPublished: false\n'+
                '&nbsp; &nbsp;}\n'+
              '  isPublished: false\n'+
            '}\n'+
            '&nbsp; &nbsp;review: {\n'+
              '&nbsp; &nbsp;&nbsp; &nbsp;_reviewerId: 98733\n'+
              '&nbsp; &nbsp;&nbsp; &nbsp;reviewerNotes: This is the reviewer notes\n'+
              '&nbsp; &nbsp;&nbsp; &nbsp;reviewerDate: 2021-02-10\n'+
              '&nbsp; &nbsp;&nbsp; &nbsp;isPublished: false\n'+
            '&nbsp; &nbsp;}\n'+
          '&nbsp; &nbsp;&nbsp; &nbsp;dateAdded: 2021-04-3\n'+
          '&nbsp; &nbsp;&nbsp; &nbsp;commentStatus: Closed or whatever\n'+
      '})\n'+
         
         
         
         '',

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
