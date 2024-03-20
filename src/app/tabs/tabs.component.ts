import {Component, ContentChild, EventEmitter, Input, Output, TemplateRef} from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent<T> {

  // we create shallow local copy of tabs, ans select first tab if no one is selected
  @Input('tabs') set allTabs(tabs: T[]) {
    this.tabs = [...tabs];
    if (!this.selectedTab && this.tabs?.length) {
      this.selectedTabIndex = 0;
      this.selectedTab = this.tabs[0];
    }
  }
  // we can choose to pass tab name function and use default template, or pass custom header template
  @Input() tabNameFunction?: (t: T) => string;
  @Input() headerTemplate?: TemplateRef<any>;
  @Input() bodyTemplate: TemplateRef<any>;
  // we emit event that we removed tab from our local array, but we do not want to depend on implementation, and parent component should use correct service by its own
  @Output() onRemove: EventEmitter<number> = new EventEmitter<number>();

  tabs: T[];
  selectedTabIndex: number | null;
  selectedTab: T | null;

  select(index: number): void {
    this.selectedTabIndex = index;
    this.selectedTab = this.tabs[index];
  }

  remove($event: MouseEvent, index: number): void {
    $event.stopPropagation();
    if (index === this.selectedTabIndex) {
      this.selectedTab = null;
      this.selectedTabIndex = null;
    }
    if (index < this.selectedTabIndex) {
      this.selectedTabIndex--;
    }
    this.tabs.splice(index, 1);
    this.onRemove.emit(index);
  }

}
