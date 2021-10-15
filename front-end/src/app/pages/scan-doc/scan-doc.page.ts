import { Component, Input, OnInit } from '@angular/core';
import { UploadingService } from '../../uploading.service';
import {SharedService} from 'src/app/shared.service';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
import { concat } from 'rxjs';

@Component({
  selector: 'app-scan-doc',
  templateUrl: './scan-doc.page.html',
  styleUrls: ['./scan-doc.page.scss'],
})
export class ScanDocPage implements OnInit {

  constructor(private service:SharedService) { }

  @Input() ml:any;
  MachineLearningId:string;
  TypeOfSheet:string;
  Department:string;
  TrainingDataFileName:string;
  TrainingFilePath:string;
  SheetFileName:string;
  SheetFilePath:string;
  Output:string;

  ngOnInit(): void {
    this.loadDepartmentList();
  }

  loadDepartmentList(){
    this.service.getAllDepartmentNames().subscribe((data:any)=>{
      this.MachineLearningId=this.ml.MachineLearningId;
      this.TypeOfSheet=this.ml.TypeOfSheet;
      this.Department=this.ml.Department;
      this.TrainingDataFileName=this.ml.TrainingDataFileName;
      this.TrainingFilePath=this.service.PhotoUrl+this.TrainingDataFileName;
      this.SheetFileName=this.ml.SheetFileName;
      this.SheetFilePath=this.service.PhotoUrl+this.SheetFileName;
      this.Output=this.ml.Output;
    });
  }

  addMachineLearning(){
    var val = {MachineLearningId:this.MachineLearningId,
                TypeOfSheet:this.TypeOfSheet,
                Department:this.Department,
              TrainingDataFileName:this.TrainingDataFileName,
            SheetFileName:this.SheetFileName,
            Output:this.Output};

    this.service.addMachineLearning(val).subscribe(res=>{
      alert(res.toString());
    });
  }


  uploadPhoto(event){
    var file=event.target.files[0];
    const formData:FormData=new FormData();
    formData.append('uploadedFile',file,file.name);

    this.service.UploadPhoto(formData).subscribe((data:any)=>{
      this.SheetFileName=data.toString();
      this.SheetFilePath=this.service.PhotoUrl+this.SheetFileName;
    })
  }

  uploadTrainPhoto(event){
    var file=event.target.files[0];
    const formData:FormData=new FormData();
    formData.append('uploadedFile',file,file.name);

    this.service.UploadTrainPhoto(formData).subscribe((data:any)=>{
      this.TrainingDataFileName=data.toString();
      this.TrainingFilePath=this.service.PhotoUrl+this.TrainingDataFileName;
    })
  }

}
