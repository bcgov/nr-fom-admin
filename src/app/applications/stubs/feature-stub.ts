import {Feature} from 'core/models/feature';

export const singleFeatureStub: Feature =
  new Feature(
    {
      '_id': '5ba9b32aae40570019c8fd27',
      'type': 'Feature',
      // 'geometry': {
      //     'geometries': [
      //         { 'type': 'Point',
      //           'coordinates': [-128.289839, 54.0190]
      //           }
      //         ]
      // }
      'geometry': {
        'type': 'Point',
        'coordinates': [-128.289839, 54.0190]
      }
      ,
      'properties': {
        'INTRID_SID': 234565
      }
    });

export const singleFeatureStubArray: Feature[] = [
  new Feature({
    '_id': '5ba9b32aae40570019c8fd27',
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': [-128.289839, 54.0190]
    },
    'properties': {
      'INTRID_SID': 234565,
      'TENURE_LEGAL_DESCRIPTION': 'ALL THAT UNSURVEYED CROWN LAND IN THE VICINITY OF SUSKWA, ' +
        'CASSIAR DISTRICT, CONTAINING 9.185 HECTARES, MORE OR LESS.'
    }
  })
];
