
import { Document } from 'app/models/document';

export const singleDocumentStub: Document =
         new Document(
{
    '_id': '5ab560ea91b5ea001975f3dc',
    '_addedBy': '5ab3cd64999d65001916febb',
    '_application': '5be3605e21ad2500237d5e0f',
    '_decision': '5b22de2c0aefdc001950452b',
    '_comment': '5b0f6ef343cf9c0019391cec',
    'documentFileName': 'Proposed FOM_January_18_2021.PDF',
    'displayName': 'Proposed FOM January 18, 2021',
    'internalURL' : './uploads/6383043941972836352.pdf',
    'internalMime': 'application/pdf'
});

export  const singleDocumentStubArray: Document[] =  [
    new Document({
        '_id': '5ab560ea91b5ea001975f3dc',
    '_addedBy': '5ab3cd64999d65001916febb',
    '_application': '5be3605e21ad2500237d5e0f',
    '_decision': '5b22de2c0aefdc001950452b',
    '_comment': '5b0f6ef343cf9c0019391cec',
    'documentFileName': 'Proposed FOM December 18, 2020',
    'displayName': 'Proposed FOM December 18, 2020',
    'internalURL' : './uploads/6383043941972836352.pdf',
    'internalMime': 'application/pdf'
      }),
      new Document({
        '_id': '5ab560ea91b5ea0019752222',
    '_addedBy': '5ab3cd64999d65001916febb',
    '_application': '5be3605e21ad2500237d5e0f',
    '_decision': '5b22de2c0aefdc001950452b',
    '_comment': '5b0f6ef343cf9c0019391cec',
    'documentFileName': 'Proposed FOM January 18, 2021',
    'displayName': 'Proposed FOM January 18, 2021',
    'internalURL' : './uploads/6383043941972836322.pdf',
    'internalMime': 'application/pdf'
      })
  ];
