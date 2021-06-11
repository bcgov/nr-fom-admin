import {  Observable} from "rxjs";
import {HttpClient, HttpHeaders, HttpParameterCodec} from "@angular/common/http";
import {CustomHttpParameterCodec} from "../api/encoder";
import {Inject, Injectable, Optional} from "@angular/core";
import { BASE_PATH}  from '../api';
import {Configuration} from "../api";

@Injectable({
  providedIn: 'root'
})
export class AttachmentUploadService {

  protected basePath = 'http://localhost';
  public configuration = new Configuration();
  public defaultHeaders = new HttpHeaders();
  public encoder: HttpParameterCodec;

  constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string,
              @Optional() configuration: Configuration) {
    if (configuration) {
      this.configuration = configuration;
    }
    if (typeof this.configuration.basePath !== 'string') {
      if (typeof basePath !== 'string') {
        basePath = this.basePath;
      }
      this.configuration.basePath = basePath;
      console.log('basePath: ', this.configuration.basePath);
    }
    this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
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

     let headers = this.defaultHeaders;

     let credential: string | undefined;
     // authentication (bearer) required
     credential = this.configuration.lookupCredential('bearer');
     if (credential) {
       headers = headers.set('Authorization', 'Bearer ' + credential);
     }
      headers = headers.set('Accept', '*');

    const formParams: FormData = new FormData();
    formParams.append('file', fileContent, file[0].name); // originalname is set in third param.
    formParams.append('projectId', <any>projectId);
    formParams.append('attachmentTypeCode', <any>attachmentTypeCode);

    let responseType: 'text' | 'json' = 'json';
    return this.httpClient.post<any>(`${this.configuration.basePath}/api/attachment`,
      formParams,
      {
        responseType: <any>responseType,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe
      }
    );
  }
}
