import dayjs from 'dayjs';

import 'dayjs/locale/pt-br';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(timezone);

dayjs.locale('pt-br');
dayjs.tz.setDefault('America/Sao_Paulo');

dayjs.extend(utc);
dayjs.extend(relativeTime);
