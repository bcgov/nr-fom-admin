import { Project } from 'app/models/project';

        export const singleProjectStub: Project =
         new Project(
        {
            '_id': 926028,
            'revisionCount': 1,
            'createTimestamp': '2021-02-10',
            'createUser': 'Marcelo the user',
            'updateTimestamp': '2021-03-01',
            'updateUser': 'Marcelo the updater',
            'name': 'Pretty Bird Operations',
            'description': 'Long description of Pretty Bird Operations',
            'commentingOpenDate': '2021-03-02',
            'commentingClosedDate': '2021-04-02',
            'fspId': 4506,
            'districtId': 1111,
            'forestClientId': 2222,
            'workflow_state_code': 'Initial'
        });


    export  const singleProjectStubArray: Project[] =  [
    new Project({
        '_id': 926028,
        'revisionCount': 1,
        'createTimestamp': '2021-02-10',
        'createUser': 'Marcelo the user',
        'updateTimestamp': '2021-03-01',
        'updateUser': 'Marcelo the updater',
        'name': 'Pretty Bird Operations',
        'description': 'Long description of Pretty Bird Operations',
        'commentingOpenDate': '2021-03-02',
        'commentingClosedDate': '2021-04-02',
        'fspId': 4506,
        'districtId': 1111,
        'forestClientId': 2222,
        'workflow_state_code': 'Initial'
      }),
      new Project({
        '_id': 926029,
        'revisionCount': 3,
        'createTimestamp': '2021-02-11',
        'createUser': 'Marcelo the user',
        'updateTimestamp': '2021-03-01',
        'updateUser': 'Marcelo the updater',
        'name': 'Anne-Marie Operations',
        'description': 'Long description of Anne-Marie Operations',
        'commentingOpenDate': '2021-03-03',
        'commentingClosedDate': '2021-04-02',
        'fspId': 4506,
        'districtId': 1111,
        'forestClientId': 2222,
        'workflow_state_code': 'Initial'
      })
  ];
