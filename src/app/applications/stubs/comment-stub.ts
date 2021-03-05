import { Comment } from 'app/models/comment';

export  const commentStubArray: Comment[] =  [
    new Comment(
    {
        '_id': '22233',
        '_addedBy': 'Marcelo M',
        '_commentPeriod' : '234543',
        'commentNumber': 2,
        'comment': 'Hi there. The trees you are trying to cut are absolutely amazing and the entiry community ' +
        'just love them. Actually, we rely on them for our birds and would like to know if you could go on the ' +
         'other side of the creek and work there.',
        'commentAuthor': {
            '_userId': '23456',
            'orgName': 'My first organization',
            'contactName': 'Anonymous',
            'location': 'Quesnel Natural Resource',
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
          'comment': 'Hi there? When are you actually planning on executing this work? Will there be any further \n' +
          'notification? I\'m planing on building a house very close to where the cut will be, that\'s why the \n' +
          'concern. In addition, how long will your work take?',
          'commentAuthor': {
              '_userId': '23456',
              'orgName': 'My second organization',
              'contactName': 'Anonymous',
              'location': 'Fort Nelson Natural Resource',
              'requestedAnonymous': true,
              'internal': {
                  'email': 'anonymous@test.com',
                  'phone': '',
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
          'dateAdded': '2021-03-2',
          'commentStatus': 'Closed or whatever'
      }),
      new Comment(
        {
            '_id': '22235',
            '_addedBy': 'Marcelo M 2nd',
            '_commentPeriod' : '234544',
            'commentNumber': 3,
            'comment': 'I really don\'t like this FOM. It\s going to interfere with my home, which faces the trees ' +
            '\n you guys are cutting. There will be too much sun light coming into my living room and the \n ' +
            'house is going to be a way too warm! What else do you propose? You have my email so please let me know' ,
            'commentAuthor': {
                '_userId': '23456',
                'orgName': 'My second organization',
                'contactName': 'Dorothy',
                'location': 'Mackenzie Natural Resource',
                'requestedAnonymous': true,
                'internal': {
                    'email': 'dorothy@gmail.com',
                    'phone': '+1403-445-5667',
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
            'dateAdded': '2021-03-05',
            'commentStatus': 'Closed or whatever'
        })
];
