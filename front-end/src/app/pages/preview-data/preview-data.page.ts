/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';
import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { PercentPipe } from '@angular/common';

@Component({
  selector: 'app-preview-data',
  templateUrl: './preview-data.page.html',
  styleUrls: ['./preview-data.page.scss'],
})
export class PreviewDataPage implements OnInit {

  constructor(private service: SharedService) {
    pdfDefaultOptions.assetsFolder = 'bleeding-edge';

}

  @Input() ml: any;
  MachineLearningId: string;
  TypeOfSheet: string;
  Department: string;
  TrainingDataFileName: string;
  TrainingFilePath: string;
  SheetFileName: string;
  SheetFilePath: string;
  Output: string;

  MachineLearningList: any = [];

  Zoom = 50; //default zoom value
  PreviewFilePath: string;

  ngOnInit() {
    this.refreshMLList();
    this.PreviewFilePath = 'assets/placeholder-image.png'; //Set preview file to a placeholder image
    this.Zoom = 50;
  }

  //Sets the preview file
  ChangePreviewDocument(dataItem){
    this.PreviewFilePath = this.service.PhotoUrl + dataItem.SheetFileName;
  }

  //Adjusts the "zoom" (size) of the previewed file
  ChangePreviewZoom(){
    const previewFile = document.getElementById('PreviewFile');
    const imgSrc = new Image();
    imgSrc.src = this.PreviewFilePath;
    previewFile.style.width=(this.Zoom).toString() + '%';
    previewFile.style.height=(this.Zoom).toString() + '%';

   }

  //Refreshes the Machine Learning data displayed
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
      this.Output = this.ml.Output;
    });

  }

}
