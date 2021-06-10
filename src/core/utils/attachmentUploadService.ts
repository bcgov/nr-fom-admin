import {  Observable} from "rxjs";
import {HttpClient, HttpHeaders, HttpParameterCodec} from "@angular/common/http";
import {CustomHttpParameterCodec} from "../api/encoder";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AttachmentUploadService {

  protected basePath = 'http://localhost:3333';
  public encoder: HttpParameterCodec;

  constructor(protected httpClient: HttpClient) {
    this.encoder = new CustomHttpParameterCodec();
  }

 /**
  * @param file
  * @param projectId
  * @param attachmentTypeCode
  * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
  // * @param reportProgress flag to report request and response progress.
  */
  public attachmentCreate(file ? : Blob, projectId ? : number, attachmentTypeCode ? : string, observe
    :any = 'body'): Observable < any > {


    let headers = new HttpHeaders()
      // .set('content-type', ['multipart/form-data', 'boundary'])
      // .set('Content-Type', 'multipart/form-data;boundary=--')
      .set('enctype', 'multipart/form-data')
      .set('Authorization', 'Bearer ' + '{"isMinistry":true,"isForestClient":true,"clientIds":' +
        '[1011, 1012],"userName":"mmedeir@idir","displayName":"Medeiros, Marcelo IIT:EX"}')
      // .set('Access-Control-Allow-Origin', '*')
      .set('Accept', '*/*');

    // let formParams: { append(param: string, value: any): any; };
    // use FormData to transmit files using content-type "multipart/form-data"
    // see https://stackoverflow.com/questions/4007969/application-x-www-form-urlencoded-or-multipart-form-data

    const formParams: FormData = new FormData();

    // if (file !== undefined) {
    console.log('from API: ', file);
    formParams.append('file', <any>file);
    // }
    // if (projectId !== undefined) {
    console.log('projectId: ', projectId)
    formParams.append('projectId', <any>projectId);
    // }
    // if (attachmentTypeCode !== undefined) {
    console.log('attachmentTypeCode: ', attachmentTypeCode)
    formParams.append('attachmentTypeCode', <any>attachmentTypeCode);
    // }

    let responseType: 'text' | 'json' = 'json';
    // if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
    responseType = 'text';
    // }
    console.log('headersAttachment: ', JSON.stringify(headers));
    console.log('formParams: ', formParams.get('file'));

    // return  new Observable<any>();
    return this.httpClient.post<any>(`${this.basePath}/api/attachment`,
      formParams,
      {
        responseType: <any>responseType,
        headers: headers,
        observe: observe
      }
    );
  }
}
