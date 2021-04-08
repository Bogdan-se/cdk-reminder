import ReminderDAO  from '../../../common/dao/ReminderDAO';
import {handlerWrapper}  from '../utils';

export const handler = handlerWrapper((event) => {
    const {pathParameters: {id}, body} = event;
    const {label} = JSON.parse(body);

    return ReminderDAO.update(id, {
        label,
    });
});
