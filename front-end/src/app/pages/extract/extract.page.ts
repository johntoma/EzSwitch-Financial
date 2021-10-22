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

  //This function is called when the edit button is clicked.
  //Displays a modal allowing the user to edit the extacted data output.
  //Within the modal, there is a text box with the extracted data output where the user can edit the data.
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

  //Called when Delete Button is clicked.
  //Makes an alert appear asking the user if they are sure.
  //If the user confirms, then the data in the row is deleted.
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


  //Updates the machine learning data
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

  //Displays modal
  async showModal() {
    const modal = await this.modalCtrl.create({
      component: EditDataComponent
    });
    await modal.present();
  }

}
