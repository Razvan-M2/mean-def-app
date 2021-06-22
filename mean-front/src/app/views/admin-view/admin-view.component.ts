import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { Subscription } from 'rxjs';
import { RelationalKey } from 'src/app/models/RelationalKeys';
import { KeywordsService } from 'src/app/services/keywords.service';
import { RelationalKeyBundle } from '../../models/RelationalKeyBundle';
import { AdminAddKeyword } from './admin-add-keyword.component';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.scss'],
})
export class AdminViewComponent implements OnInit {
  keywords: RelationalKeyBundle = { keys: [], number: 0 };
  title = 'Admin Page';
  selectedKeyword: RelationalKey = { name: '' };
  inputKeyword: string = '';
  private keysSubscription: Subscription;

  constructor(
    private keywordsService: KeywordsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.keysSubscription = this.keywordsService
      .getKeysUpdateListener()
      .subscribe((data: RelationalKeyBundle) => {
        this.keywords = data;
      });
    this.keywordsService.getKeywords();
  }

  onOpenDialog(): void {
    const dialogRef = this.dialog.open(AdminAddKeyword, {
      width: '30%',
      minWidth: '20%',
      // data: { name: this.name, animal: this.animal },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        if (this.keywordsService.postKeyword({ name: result })) {
          this.keywords.keys.push({ name: result });
        }
      }
    });
  }

  onSelectKeyword(event: MatSelectionListChange): void {
    this.selectedKeyword = event.source.selectedOptions.selected[0].value;
    this.inputKeyword = this.selectedKeyword.name;
  }

  onSubmitChangeKeyword(): void {
    if (this.selectedKeyword.name != this.inputKeyword) {
      this.keywordsService.updateKeyword(
        this.selectedKeyword,
        this.inputKeyword
      );
    }
  }

  onSubmitDeleteKeyword(): void {
    if (this.keywordsService.deleteKeyword(this.selectedKeyword.name)) {
      this.selectedKeyword = null;
      this.inputKeyword = '';
    }
  }
}
