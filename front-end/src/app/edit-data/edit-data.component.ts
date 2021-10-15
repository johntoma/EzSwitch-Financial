/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { ExtractPage } from '../pages/extract/extract.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-data',
  templateUrl: './edit-data.component.html',
  styleUrls: ['./edit-data.component.scss'],
})
export class EditDataComponent implements OnInit {

  constructor(private service: SharedService, private modalCtrl: ModalController) { }

  @Input() ml: any;
  MachineLearningId: string;
  TypeOfSheet: string;
  Department: string;
  TrainingDataFileName: string;
  TrainingFilePath: string;
  SheetFileName: string;
  SheetFilePath: string;
  TrainingDataContent: string;
  @Input() Output: string;

  MachineLearningList: any = [];

  @Input() ModalTitle: string;

  DepartmentsList: any = [];

  ngOnInit(): void {
    this.loadDepartmentList();
  }

  loadDepartmentList() {
    this.service.getAllDepartmentNames().subscribe((data: any) => {
      this.DepartmentsList = data;

      this.MachineLearningId = this.ml.MachineLearningId;
      this.TypeOfSheet = this.ml.TypeOfSheet;
      this.Department = this.ml.Department;
      this.TrainingDataFileName = this.ml.TrainingDataFileName;
      this.TrainingFilePath = this.service.PhotoUrl + this.TrainingDataFileName;
      this.SheetFileName = this.ml.SheetFileName;
      this.SheetFilePath = this.service.PhotoUrl + this.SheetFileName;
      this.TrainingDataContent = this.ml.TrainingDataContent;
      this.Output = this.ml.Output;
    });
  }

  addMachineLearning() {
    var val = {
      MachineLearningId: this.MachineLearningId,
      TypeOfSheet: this.TypeOfSheet,
      Department: this.Department,
      TrainingDataFileName: this.TrainingDataFileName,
      SheetFileName: this.SheetFileName,
      TrainingDataContent: this.TrainingDataContent,
      Output: this.Output
    };

    this.service.addMachineLearning(val).subscribe(res => {
      alert(res.toString());
    });
  }

  updateMachineLearning() {
    var val = {
      MachineLearningId: this.MachineLearningId,
      TypeOfSheet: this.TypeOfSheet,
      Department: this.Department,
      TrainingDataFileName: this.TrainingDataFileName,
      SheetFileName: this.SheetFileName,
      TrainingDataContent: this.TrainingDataContent,
      Output: this.Output,
    };

    this.service.updateMachineLearning(val).subscribe(res => {
      alert(res.toString());
    });
  }



  uploadPhoto(event) {
    var file = event.target.files[0];
    const formData: FormData = new FormData();
    formData.append('uploadedFile', file, file.name);

    this.service.UploadPhoto(formData).subscribe((data: any) => {
      this.SheetFileName = data.toString();
      this.SheetFilePath = this.service.PhotoUrl + this.SheetFileName;
    });
  }

  uploadTrainPhoto(event) {
    var file = event.target.files[0];
    const formData: FormData = new FormData();
    formData.append('uploadedFile', file, file.name);

    this.service.UploadTrainPhoto(formData).subscribe((data: any) => {
      this.TrainingDataFileName = data.toString();
      this.TrainingFilePath = this.service.PhotoUrl + this.TrainingDataFileName;
    });
  }


  async closeClick() {
    this.refreshMLList();
    await this.modalCtrl.dismiss();
  }

  refreshMLList() {

    this.service.getMLList().subscribe(data => {
      this.MachineLearningList = data;
    });

    this.service.getAllDepartmentNames().subscribe((data: any) => {

      this.MachineLearningId = this.ml.MachineLearningId;
      this.TypeOfSheet = this.ml.TypeOfSheet;
      this.Department = this.ml.Department;
      this.TrainingDataFileName = this.ml.TrainingDataFileName;
      this.TrainingFilePath = this.service.PhotoUrl + this.TrainingDataFileName;
      this.SheetFileName = this.ml.SheetFileName;
      this.SheetFilePath = this.service.PhotoUrl + this.SheetFileName;
      this.TrainingDataContent = this.ml.TrainingDataContent;
      this.Output = this.ml.Output;
    });

  }

}

