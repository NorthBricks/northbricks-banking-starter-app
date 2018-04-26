import { NgModule } from '@angular/core';
import { CurrencyPipe } from './currency/currency';
import { MomentFormatPipe } from './moment-format/moment-format';
import { MomentPipe } from './moment.pipe';
import { FormatCurrencyPipe } from './format-currency/format-currency';
import { CurrencySymbolPipe } from './currency-symbol/currency-symbol';
@NgModule({
	declarations: [CurrencyPipe,
		MomentFormatPipe, MomentPipe,
    FormatCurrencyPipe,
    CurrencySymbolPipe],
	imports: [],
	exports: [CurrencyPipe,
		MomentFormatPipe, MomentPipe,
    FormatCurrencyPipe,
    CurrencySymbolPipe]
})
export class PipesModule { }
