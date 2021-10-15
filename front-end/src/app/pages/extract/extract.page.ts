/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';
import { EditDataComponent } from 'src/app/edit-data/edit-data.component';
import { ModalController } from '@ionic/angular';

declare const convertString: any;

@Component({
  selector: 'app-extract',
  templateUrl: './extract.page.html',
  styleUrls: ['./extract.page.scss'],
})

export class ExtractPage implements OnInit {

  constructor(
    private service: SharedService,
    private modalCtrl: ModalController
  ) { }

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

  ModalTitle: string;
  ActivateAddEditMLComp: boolean = false;

  ngOnInit(): void {
    this.refreshMLList();
  }

  addClick() {
    this.ml = {
      MachineLearningId: 0,
      TypeOfSheet: '',
      TrainingDataFileName: 'anonymous.png',
      SheetFileName: 'anonymous.png',
      Output: ''
    };
    this.ModalTitle = 'Add Machine Learning';
    this.ActivateAddEditMLComp = true;

  }

  async editClick(item) {
    const modal = await this.modalCtrl.create({
      component: EditDataComponent,
      componentProps: {
        ml: item,
        ModalTitle: 'Edit Machine Learning',
        Output: item.Output
      }
    });
    await modal.present();

    console.log(item);
    this.ml = item;
    this.ModalTitle = 'Edit Machine Learning';
    this.ActivateAddEditMLComp = true;
  }

  deleteClick(item) {
    if (confirm('Are you sure??')) {
      this.service.deleteMachineLearning(item.MachineLearningId).subscribe(data => {
        alert(data.toString());
        this.refreshMLList();
      });
    }
  }

  onClick() {
    convertString();
  }

  updateMachineLearning() {
    var val = {
      MachineLearningId: this.MachineLearningId,
      TypeOfSheet: this.TypeOfSheet,
      Department: this.Department,
      TrainingDataFileName: this.TrainingDataFileName,
      SheetFileName: this.SheetFileName,
      Output: this.Output,
    };

    this.service.updateMachineLearning(val).subscribe(res => {
      alert(res.toString());
    });
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
      this.Output = this.ml.Output;
    });

  }

  async showModal() {
    const modal = await this.modalCtrl.create({
      component: EditDataComponent
    });
    await modal.present();
  }

}
