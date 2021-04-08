import ReminderDAO  from '../../../common/dao/ReminderDAO';
import {handlerWrapper}  from '../utils';

export const handler = handlerWrapper((event) => {
    const {body} = event;
    const {label} = JSON.parse(body);

    return ReminderDAO.create({
        label,
    });
});
