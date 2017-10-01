import { NgModule } from '@angular/core';
import { CapitalizePipe } from './../pipes/capitalize.pipe';
import { KeysPipe } from './../pipes/keys.pipe';
import { SortPipe } from './../pipes/sort.pipe';
import { GroupByPipe } from './../pipes/group-by.pipe';

@NgModule({
	declarations: [
    CapitalizePipe,
    KeysPipe,
    SortPipe,
    GroupByPipe
	],
	imports: [

	],
	exports: [
    KeysPipe,
    SortPipe,
    GroupByPipe,
    CapitalizePipe
	]
})

export class PipesModule { }


