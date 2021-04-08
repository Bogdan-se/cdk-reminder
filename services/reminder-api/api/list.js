import ReminderDAO from '../../../common/dao/ReminderDAO';
import {handlerWrapper} from '../utils';

export const handler = handlerWrapper(() => {
    return ReminderDAO.list();
});
