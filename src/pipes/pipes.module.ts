import { NgModule } from '@angular/core';
import { CurrencyPipe } from './currency/currency';
import { MomentFormatPipe } from './moment-format/moment-format';
@NgModule({
	declarations: [CurrencyPipe,
    MomentFormatPipe],
	imports: [],
	exports: [CurrencyPipe,
    MomentFormatPipe]
})
export class PipesModule {}
