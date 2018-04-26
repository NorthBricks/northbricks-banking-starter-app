import { Pipe } from '@angular/core';
import moment from 'moment';

@Pipe({
    name: 'moment'
})
export class MomentPipe {
    public transform(value, args) {
        args = args || '';
        return args === 'ago' ? moment(value).fromNow() : moment(value).format(args);
    }
}