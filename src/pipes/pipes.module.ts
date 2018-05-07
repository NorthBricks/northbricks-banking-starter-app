import { NgModule } from '@angular/core';
import { CurrencyPipe } from './currency/currency';
import { MomentFormatPipe } from './moment-format/moment-format';
import { MomentPipe } from './moment.pipe';
import { FormatCurrencyPipe } from './format-currency/format-currency';
import { CurrencySymbolPipe } from './currency-symbol/currency-symbol';
import { LowerCasePipe } from './lower-case/lower-case';
@NgModule({
	declarations: [CurrencyPipe,
		MomentFormatPipe, MomentPipe,
    FormatCurrencyPipe,
    CurrencySymbolPipe,
    LowerCasePipe],
	imports: [],
	exports: [CurrencyPipe,
		MomentFormatPipe, MomentPipe,
    FormatCurrencyPipe,
    CurrencySymbolPipe,
    LowerCasePipe]
})
export class PipesModule { }
