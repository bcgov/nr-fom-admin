import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { faLockOpen, faLock } from '@fortawesome/free-solid-svg-icons';

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const currentDay = new Date().getDate();
import * as R from 'remeda';
export function dateBuilder() {
  const dateTuple = [currentYear, currentMonth, currentDay];
  return dateTuple;
}
@Component({
  selector: 'app-upload-box',
  template: `
    <div class="upload-group">
      <div class="upload-control">
        <ngx-dropzone
          (change)="onSelect($event)"
          #uploader
          [multiple]="multipleFiles"
          [accept]="allowedFileTypes"
          [maxFileSize]="maxFileSize"
          [class.no-files-border]="noFiles"
        >
          <ngx-dropzone-label>
            <span class="material-icons">
              cloud_upload
            </span>
            <div>Drag files to Upload</div>
            <div>or</div>
            <div>
              <a href="javascript:void(0)">Browse</a>
            </div>
          </ngx-dropzone-label>
          <ng-container *ngFor="let f of files">
          <ngx-dropzone-image-preview ngx-dropzone-image-preview   ngProjectAs="ngx-dropzone-preview"   [removable]="true" (removed)="onRemove(f)" [file]="f" *ngIf="isImageType(f.type)">
            <ngx-dropzone-label>{{ f.name }}</ngx-dropzone-label>
          </ngx-dropzone-image-preview>
          <ngx-dropzone-preview *ngIf="!isImageType(f.type)" (removed)="onRemove(f)" [removable]="true" >
            <ngx-dropzone-label>{{ f.name }}</ngx-dropzone-label>

          </ngx-dropzone-preview>
</ng-container>
        </ngx-dropzone>
        <ng-container *ngIf="invalidTypeText">
          <span class="invalid-type-msg">{{ invalidTypeText }}</span>
        </ng-container>
      </div>
<!--
      <div class="file-list" [class.no-files-border]="noFiles">
        <ng-container *ngFor="let file of files; index as i">
          <app-file-row
            [displayName]="title"
            [fileTypeStr]="file.type"
            [fileName]="file.name"
            [docType]="fileType"
            [date]="date"
            [fileSize]="file.size"
            [index]="i"
            (remove)="onRemove($event)"
          ></app-file-row>
        </ng-container>
        <ng-container *ngIf="noFiles">
          <span class="no-files-text">A file must be selected for upload</span>
        </ng-container>
      </div> -->
    </div>
  `,
  styleUrls: ['./file-upload-box.component.scss'],
})
export class UploadBoxComponent implements OnInit {
  isImageType( type: string ) {
    const imageTypes = [
      'image/png',
    'image/jpeg',
    'image/tiff',
    'image/x-tiff',
    'image/bmp',
    'image/x-windows-bmp',
    'image/gif',

    ]
    return imageTypes.includes(type)
  }
  @Input() multipleFiles = false;
  @Input() title = 'No client set';
  @Input() noFiles = false;
  @Input() fileType: string;
  @Input() fileDate: string;
  @Input() date: string;
  @Input() maxFileSizeMB: number;

  @Output() fileBlobsUploaded = new EventEmitter<File[]>();
  monthVal = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  faLockOpen = faLockOpen;
  faLock = faLock;

  @Input() fileTypes: string[] = [
    'image/png',
    'image/jpeg',
    'image/tiff',
    'image/x-tiff',
    'image/bmp',
    'image/x-windows-bmp',
    'image/gif',

    'text/plain',

    'application/pdf',

    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',

    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];

  // browse Link opens the file prompt
  @Input() files: File[] = [];

  @Input() newGeometry: File = null;

  // limit for file types (set from global config)
  allowedFileTypes: string;

  // bytes - default to max 10mb (set from global config)
  maxFileSize = 0;

  invalidTypeText: string;

  constructor() { }
  ngOnInit(): void {
    const dateTuple = dateBuilder();
    const year = dateTuple[0];
    const month = this.monthVal[dateTuple[1]];
    const day = dateTuple[2];

    // get the saved document data
    // if (this.files[0]?.fileDate) {
    //   this.date = this.files[0].fileDate;
    //
    //   /* set today's date value as all files uploaded will be today's date */
    // } else {
    //   this.date = `${day} - ${month} - ${year}`;
    // }

    /* file size multiplied by 1024 for conversion */
    this.maxFileSize = (this.maxFileSizeMB ? this.maxFileSizeMB : 5) * 1048576;
    this.allowedFileTypes = this.fileTypes.join(', ');
  }

  onSelect(event) {
    this.files = R.concat(event.addedFiles, this.files);
    this.invalidTypeText = null;
    this.newGeometry = event.addedFiles;
    // let file:File = event.addedFiles;

    console.log('list of files: ' + this.files.length);
    // console.log('Geometry file: ' + reader.readAsArrayBuffer(blob));
    // console.log(this.newGeometry);

    if (event.addedFiles.length > 0) {
      this.fileBlobsUploaded.emit(this.files);
    } else {
      console.log(event.rejectedFiles);
      if (event.rejectedFiles.some((r) => r.reason === 'type')) {
        this.invalidTypeText = 'The file type is not accepted';
      } else if (event.rejectedFiles.some((r) => r.reason === 'size')) {
        this.invalidTypeText = 'The file size cannot exceed ' + this.maxFileSize / 1048576 + ' MB.';
      }
    }

    let reader = new FileReader();

    reader.onload = function() {
      let text = reader.result;
      console.log(text );
    }
    reader.readAsText(event.addedFiles);

    //const fileContent = await this.readFileContent(this.newGeometry);
    //console.log('fileContent: ', fileContent);

    // this.fileToString(this.newGeometry)
    //   .then((result) => {
    //     console.log(result);
    //   }).catch((e) => {
    //     console.log(e)
    // });
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
    this.fileBlobsUploaded.emit(this.files);
  }


  readFileContent (file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!file) {
        resolve('');
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        console.log('before returning: ', file);
        const text = reader.result.toString();
        console.log('before returning: ', text);
        resolve(text);

      };

      reader.readAsText(file);
    });

  }

// let fileToBlob = async (file) => new Blob([new Uint8Array(await file.arrayBuffer())], {type: file.type });
  async fileToString (file: File) {
    console.log(this.newGeometry)
    try {
      let fileReader = new FileReader();
      const response = new Response(this.newGeometry);
      const newBlob = await response.blob();
      console.log('after newBlog')
      console.log(this.newGeometry)
      const arrayBuffer = await (newBlob.arrayBuffer());
      console.log('after await arrayBuffer')
      fileReader.readAsText(newBlob);
      fileReader.result
      console.log(fileReader);

      console.log(newBlob)
      console.log(arrayBuffer)
    }catch (e){
      console.log(e)
    }
  }

}
