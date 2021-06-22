import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-dialog',
  templateUrl: 'admin-add-keyword.component.html',
  styleUrls: ['./admin-add-keyword.component.scss'],
})
export class AdminAddKeyword {
  inputKeyword: string;

  constructor(public dialogRef: MatDialogRef<AdminAddKeyword>) {}

  onSaveKeyword(): void {
    // this.keywordsService.postKeyword({ name: this.inputKeyword });
  }

  onRejectSave(): void {
    this.dialogRef.close();
  }
}
