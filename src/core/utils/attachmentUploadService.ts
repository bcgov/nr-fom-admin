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
  * For fileupdate using FormData, refer to these two links for useful info:
  * https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects
  * https://developer.mozilla.org/en-US/docs/Web/API/FormData/append
  * @param file file's matadata
  * @param fileContent blob
  * @param projectId
  * @param attachmentTypeCode
  * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
  // * @param reportProgress flag to report request and response progress.
  */
  public attachmentCreate(file: any, fileContent ? : Blob, projectId ? : number, attachmentTypeCode ? : string, observe
    :any = 'body'): Observable < any > {

    let headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + '{"isMinistry":true,"isForestClient":true,"clientIds":' +
        '[1011, 1012],"userName":"mmedeir@idir","displayName":"Medeiros, Marcelo IIT:EX"}')
      // .set('Access-Control-Allow-Origin', '*')
      .set('Accept', '*');

    const formParams: FormData = new FormData();
    formParams.append('file', fileContent, file[0].name); // originalname is set in third param.
    formParams.append('projectId', <any>projectId);
    formParams.append('attachmentTypeCode', <any>attachmentTypeCode);

    let responseType: 'text' | 'json' = 'json';
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
