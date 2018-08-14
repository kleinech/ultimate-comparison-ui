import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'markdown-input',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarkdownComponent {
  @Input() name: string;
  @Input() value: string;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
}
