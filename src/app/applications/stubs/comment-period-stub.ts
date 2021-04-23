import {CommentPeriod} from 'core/models/commentperiod';

export const commentPeriodStubArray: CommentPeriod[] = [
  new CommentPeriod(
    {
      '_id': 234543,
      '_addedBy': 'Sample User very concerned about this',
      '_application': 123456789,
      'startDate': '2021-01-10',
      'endDate': '2021-02-10'
    }),
  new CommentPeriod(
    {
      '_id': 234544,
      '_addedBy': 'Sample User very concerned about this',
      '_application': 123456789,
      'startDate': '2021-03-10',
      'endDate': '2021-04-10'
    })
];
