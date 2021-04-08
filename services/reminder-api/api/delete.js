import ReminderDAO  from '../../../common/dao/ReminderDAO';
import {handlerWrapper}  from '../utils';

export const handler = handlerWrapper((event) => {
    const {pathParameters: {id}} = event;

    return ReminderDAO.delete(id);
});
