import ReminderDAO  from '../../../common/dao/ReminderDAO';
import NotFound from '../exceptions/notFound';
import {handlerWrapper}  from '../utils';

export const handler = handlerWrapper(async (event) => {
    const {pathParameters: {id}} = event;

    const reminder = await ReminderDAO.getById(id);

    if (!reminder) {
        throw new NotFound();
    }

    return reminder;
});
