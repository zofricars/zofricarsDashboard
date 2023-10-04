import { FilePreviewModel } from 'ngx-awesome-uploader';
import { HttpRequest, HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FilePickerAdapter } from 'ngx-awesome-uploader';
import { Butler } from '@services/butler.service';
export class DemoFilePickerAdapter extends FilePickerAdapter {
  image:any="";
  constructor(
    private http: HttpClient,
    public _butler:Butler
  ) {
    super();
  }
  public uploadFile(fileItem: FilePreviewModel) {
    
    const form = new FormData();
    form.append('file', fileItem.file);
    const api = 'https://db.buckapi.com:3333/imgApi/containers/tixsImages/upload';
    const req = new HttpRequest('POST', api, form, {reportProgress: true});
    return this.http.request(req)
    .pipe(
      map( (res: HttpEvent<any>) => {
          if (res.type === HttpEventType.Response) {
          this._butler.partImages.push('https://db.buckapi.com/imgApi/server/local-storage/tixsImages/'+res.body.result.files.file[0].name);
          this._butler.newPartImage=true;
          return res.body.id.toString();
        } else if (res.type ===  HttpEventType.UploadProgress ) {
            const UploadProgress = +Math.round((100 * res.loaded) / res.total!);
            return UploadProgress;
        }
      })
    );
   
  }
  public removeFile(fileItem:any): Observable<any> {
    const removeApi = 'https://db.buckapi.com/api/containers/tixsImages/upload';
    return this.http.post(removeApi, {});
  }
}
