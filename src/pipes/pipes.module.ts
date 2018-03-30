import { NgModule } from '@angular/core';
import { CurrencyPipe } from './currency/currency';
@NgModule({
	declarations: [CurrencyPipe],
	imports: [],
	exports: [CurrencyPipe]
})
export class PipesModule {}
